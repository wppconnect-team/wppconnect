/*
 * This file is part of WPPConnect.
 *
 * WPPConnect is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * WPPConnect is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with WPPConnect.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Page } from 'puppeteer';
import { CreateConfig, defaultOptions } from '../../config/create-config';
import { SocketState } from '../model/enum';
import { initWhatsapp, injectApi } from '../../controllers/browser';
import { ScrapQrcode } from '../model/qrcode';
import { evaluateAndReturn, scrapeImg } from '../helpers';
import {
  asciiQr,
  getInterfaceStatus,
  isAuthenticated,
  isInsideChat,
  needsToScan,
} from '../../controllers/auth';
import { sleep } from '../../utils/sleep';
import { defaultLogger, LogLevel } from '../../utils/logger';
import { Logger } from 'winston';
import { CatchQRCallback, HostDevice, StatusFindCallback } from '../model';
import {
  FileTokenStore,
  isValidSessionToken,
  isValidTokenStore,
  MemoryTokenStore,
  TokenStore,
} from '../../token-store';

export class HostLayer {
  readonly session: string;
  readonly options: CreateConfig;
  readonly logger: Logger;
  readonly tokenStore: TokenStore;

  protected autoCloseInterval = null;
  protected statusFind?: StatusFindCallback = null;

  constructor(public page: Page, session?: string, options?: CreateConfig) {
    this.session = session;
    this.options = { ...defaultOptions, ...options };

    this.logger = this.options.logger || defaultLogger;

    if (typeof this.options.tokenStore === 'string') {
      switch (this.options.tokenStore) {
        case 'memory':
          this.tokenStore = new MemoryTokenStore();
          break;

        case 'file':
        default:
          this.tokenStore = new FileTokenStore({
            path: this.options.folderNameToken,
          });
          break;
      }
    } else {
      this.tokenStore = this.options.tokenStore;
    }

    if (!isValidTokenStore(this.tokenStore)) {
      this.log('warn', 'Invalid tokenStore, using default tokenStore', {
        type: 'tokenStore',
      });

      if (this.options.folderNameToken) {
        this.tokenStore = new FileTokenStore({
          path: this.options.folderNameToken,
        });
      } else {
        this.tokenStore = new MemoryTokenStore();
      }
    }

    this.log('info', 'Initializing...');
    this.initialize();
  }

  protected log(level: LogLevel, message: string, meta: object = {}) {
    this.logger.log({
      level,
      message,
      session: this.session,
      type: 'client',
      ...meta,
    });
  }

  protected async initialize() {
    let sessionToken = this.options.sessionToken;
    if (!sessionToken) {
      sessionToken = await Promise.resolve(
        this.tokenStore.getToken(this.session)
      );
    }

    if (isValidSessionToken(sessionToken)) {
      this.log('verbose', 'Injecting session token', { type: 'token' });
    }

    await initWhatsapp(
      this.page,
      sessionToken,
      !this.options?.puppeteerOptions?.userDataDir,
      this.options.whatsappVersion
    );

    this.page.on('load', () => {
      this.log('verbose', 'Page loaded', { type: 'page' });
      this.afterPageLoad();
    });
    this.page.on('close', () => {
      this.cancelAutoClose();
      this.log('error', 'Page Closed', { type: 'page' });
    });
  }

  protected async afterPageLoad() {
    this.log('verbose', 'Injecting wapi.js');
    await injectApi(this.page)
      .then(() => {
        this.log('verbose', 'wapi.js injected');
        this.getWAVersion()
          .then((version) => {
            this.log('info', `WhatsApp WEB version: ${version}`);
          })
          .catch(() => null);
      })
      .catch((e) => {
        this.log('verbose', 'wapi.js failed');
      });
  }

  protected tryAutoClose() {
    if (this.autoCloseInterval) {
      this.cancelAutoClose();
    }

    if (
      this.options.autoClose > 0 &&
      !this.autoCloseInterval &&
      !this.page.isClosed()
    ) {
      this.log('info', 'Closing the page');
      this.statusFind && this.statusFind('autocloseCalled', this.session);
      try {
        this.page.close();
      } catch (error) {}
    }
  }

  protected startAutoClose() {
    if (this.options.autoClose > 0 && !this.autoCloseInterval) {
      const seconds = Math.round(this.options.autoClose / 1000);
      this.log('info', `Auto close configured to ${seconds}s`);

      let remain = seconds;
      this.autoCloseInterval = setInterval(() => {
        if (this.page.isClosed()) {
          this.cancelAutoClose();
          return;
        }
        remain -= 1;
        if (remain % 10 === 0 || remain <= 5) {
          this.log('http', `Auto close remain: ${remain}s`);
        }
        if (remain <= 0) {
          this.tryAutoClose();
        }
      }, 1000);
    }
  }

  protected cancelAutoClose() {
    clearInterval(this.autoCloseInterval);
    this.autoCloseInterval = null;
  }

  public async getQrCode() {
    let qrResult: ScrapQrcode | undefined;

    qrResult = await scrapeImg(this.page).catch(() => undefined);

    return qrResult;
  }

  public async waitForQrCodeScan(catchQR?: CatchQRCallback) {
    let urlCode = null;
    let attempt = 0;

    while (true) {
      let needsScan = await needsToScan(this.page).catch(() => null);
      if (!needsScan) {
        break;
      }

      const result = await this.getQrCode();
      if (result?.urlCode && urlCode !== result.urlCode) {
        urlCode = result.urlCode;
        attempt++;

        let qr = '';

        if (this.options.logQR || catchQR) {
          qr = await asciiQr(urlCode);
        }

        if (this.options.logQR) {
          this.log(
            'info',
            `Waiting for QRCode Scan (Attempt ${attempt})...:\n${qr}`,
            { code: urlCode }
          );
        } else {
          this.log('verbose', `Waiting for QRCode Scan: Attempt ${attempt}`);
        }

        if (catchQR) {
          catchQR(result.base64Image, qr, attempt, result.urlCode);
        }
      }
      await sleep(200);
    }
  }

  public async waitForInChat() {
    let inChat = await isInsideChat(this.page);

    while (inChat === false) {
      await sleep(200);
      inChat = await isInsideChat(this.page);
    }
    return inChat;
  }

  public async waitForPageLoad() {
    await this.page
      .waitForFunction(`!document.querySelector('#initial_startup')`)
      .catch(() => {});
    await getInterfaceStatus(this.page).catch(() => null);
  }

  public async waitForLogin(
    catchQR?: CatchQRCallback,
    statusFind?: StatusFindCallback
  ) {
    this.statusFind = statusFind;

    this.log('http', 'Waiting page load');

    await this.waitForPageLoad();

    this.log('http', 'Checking is logged...');
    let authenticated = await isAuthenticated(this.page).catch(() => null);

    this.startAutoClose();

    if (authenticated === false) {
      this.log('http', 'Waiting for QRCode Scan...');
      statusFind && statusFind('notLogged', this.session);
      await this.waitForQrCodeScan(catchQR);

      this.log('http', 'Checking QRCode status...');
      // Wait for interface update
      await sleep(200);
      authenticated = await isAuthenticated(this.page).catch(() => null);

      if (authenticated === null) {
        this.log('warn', 'Failed to authenticate');
        statusFind && statusFind('qrReadError', this.session);
      } else if (authenticated) {
        this.log('http', 'QRCode Success');
        statusFind && statusFind('qrReadSuccess', this.session);
      } else {
        this.log('warn', 'QRCode Fail');
        statusFind && statusFind('qrReadFail', this.session);
        this.tryAutoClose();
        throw 'Failed to read the QRCode';
      }
    } else if (authenticated === true) {
      this.log('http', 'Authenticated');
      statusFind && statusFind('isLogged', this.session);
    }

    if (authenticated === true) {
      // Reinicia o contador do autoclose
      this.cancelAutoClose();
      this.startAutoClose();
      // Wait for interface update
      await sleep(200);
      this.log('http', 'Checking phone is connected...');
      const inChat = await this.waitForInChat();

      if (!inChat) {
        this.log('warn', 'Phone not connected');
        statusFind && statusFind('phoneNotConnected', this.session);
        this.tryAutoClose();
        throw 'Phone not connected';
      }
      this.cancelAutoClose();
      this.log('http', 'Connected');
      statusFind && statusFind('inChat', this.session);
      return true;
    }

    if (authenticated === false) {
      this.tryAutoClose();
      this.log('warn', 'Not logged');
      throw 'Not logged';
    }

    this.tryAutoClose();
    this.log('error', 'Unknow error');
    throw 'Unknow error';
  }

  /**
   * Delete the Service Workers
   * @category Host
   */
  public async killServiceWorker() {
    return await evaluateAndReturn(this.page, () => WAPI.killServiceWorker());
  }

  /**
   * Load the service again
   * @category Host
   */
  public async restartService() {
    return await evaluateAndReturn(this.page, () => WAPI.restartService());
  }

  /**
   * @category Host
   * @returns Current host device details
   */
  public async getHostDevice(): Promise<HostDevice> {
    return await evaluateAndReturn(this.page, () => WAPI.getHost());
  }

  /**
   * Retrieves WA version
   * @category Host
   */
  public async getWAVersion() {
    return await evaluateAndReturn(this.page, () => WAPI.getWAVersion());
  }

  /**
   * Retrieves the connecction state
   * @category Host
   */
  public async getConnectionState(): Promise<SocketState> {
    return await evaluateAndReturn(this.page, () => {
      //@ts-ignore
      return Store.State.default.state;
    });
  }

  /**
   * Retrieves if the phone is online. Please note that this may not be real time.
   * @category Host
   */
  public async isConnected() {
    return await evaluateAndReturn(this.page, () => WAPI.isConnected());
  }

  /**
   * Retrieves if the phone is online. Please note that this may not be real time.
   * @category Host
   */
  public async isLoggedIn() {
    return await evaluateAndReturn(this.page, () => WAPI.isLoggedIn());
  }

  /**
   * Retrieves Battery Level
   * @category Host
   */
  public async getBatteryLevel() {
    return await evaluateAndReturn(this.page, () => WAPI.getBatteryLevel());
  }

  /**
   * Start phone Watchdog, forcing the phone connection verification.
   *
   * @category Host
   * @param interval interval number in miliseconds
   */
  public async startPhoneWatchdog(interval: number = 15000) {
    return await evaluateAndReturn(
      this.page,
      (interval) => WAPI.startPhoneWatchdog(interval),
      interval
    );
  }

  /**
   * Stop phone Watchdog, more details in {@link startPhoneWatchdog}
   * @category Host
   */
  public async stopPhoneWatchdog(interval: number) {
    return await evaluateAndReturn(this.page, () => WAPI.stopPhoneWatchdog());
  }
}
