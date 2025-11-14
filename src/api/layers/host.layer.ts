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
import { Logger } from 'winston';
import { CreateConfig, defaultOptions } from '../../config/create-config';
import {
  asciiQr,
  isAuthenticated,
  isInsideChat,
  needsToScan,
} from '../../controllers/auth';
import { initWhatsapp, injectApi } from '../../controllers/browser';
import { defaultLogger, LogLevel } from '../../utils/logger';
import { sleep } from '../../utils/sleep';
import { evaluateAndReturn, scrapeImg } from '../helpers';
import {
  CatchQRCallback,
  HostDevice,
  LinkByCodeCallback,
  LoadingScreenCallback,
  StatusFindCallback,
} from '../model';
import { SocketState } from '../model/enum';
import { ScrapQrcode } from '../model/qrcode';

export class HostLayer {
  readonly session: string;
  readonly options: CreateConfig;
  readonly logger: Logger;

  protected autoCloseInterval = null;
  protected autoCloseCalled = false;

  protected isInitialized = false;
  protected isInjected = false;
  protected isStarted = false;
  protected isLogged = false;
  protected isInChat = false;
  protected checkStartInterval?: NodeJS.Timer = null;
  protected urlCode = '';
  protected attempt = 0;

  public catchQR?: CatchQRCallback = null;
  public statusFind?: StatusFindCallback = null;
  public onLoadingScreen?: LoadingScreenCallback = null;
  public catchLinkCode?: LinkByCodeCallback = null;

  constructor(public page: Page, session?: string, options?: CreateConfig) {
    this.session = session;
    this.options = { ...defaultOptions, ...options };

    this.logger = this.options.logger || defaultLogger;

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
    this.page.on('close', () => {
      this.cancelAutoClose();
      this.log('verbose', 'Page Closed', { type: 'page' });
    });

    this.page.on('load', () => {
      this.log('verbose', 'Page loaded', { type: 'page' });
      this.afterPageLoad();
    });

    this.isInitialized = true;
  }

  protected async afterPageLoad() {
    this.log('verbose', 'Injecting wapi.js');

    const options = {
      deviceName: this.options.deviceName,
      disableGoogleAnalytics: this.options.disableGoogleAnalytics,
      googleAnalyticsId: this.options.googleAnalyticsId,
      linkPreviewApiServers: this.options.linkPreviewApiServers,
      poweredBy: this.options.poweredBy,
    };

    await evaluateAndReturn(
      this.page,
      (options) => {
        (window as any).WPPConfig = options;
      },
      options
    );

    this.isInjected = false;

    await injectApi(this.page, this.onLoadingScreen)
      .then(() => {
        this.isInjected = true;
        this.log('verbose', 'wapi.js injected');
        this.afterPageScriptInjected();
      })
      .catch((e) => {
        console.log(e);
        this.log('verbose', 'wapi.js failed');
        this.log('error', e);
      });
  }

  protected async afterPageScriptInjected() {
    this.getWAVersion()
      .then((version) => {
        this.log('info', `WhatsApp WEB version: ${version}`);
      })
      .catch(() => null);
    this.getWAJSVersion()
      .then((version) => {
        this.log('info', `WA-JS version: ${version}`);
      })
      .catch(() => null);

    evaluateAndReturn(this.page, () => {
      WPP.on('conn.auth_code_change', (window as any).checkQrCode);
    }).catch(() => null);
    evaluateAndReturn(this.page, () => {
      WPP.on('conn.main_ready', (window as any).checkInChat);
    }).catch(() => null);
    this.checkInChat();
    this.checkQrCode();
  }

  public async start() {
    if (this.isStarted) {
      return;
    }

    this.isStarted = true;

    await initWhatsapp(
      this.page,
      null,
      false,
      this.options.whatsappVersion,
      this.options.proxy,
      this.log.bind(this)
    );

    await this.page.exposeFunction('checkQrCode', () => this.checkQrCode());
    /*await this.page.exposeFunction('loginByCode', (phone: string) =>
      this.loginByCode(phone)
    );*/
    await this.page.exposeFunction('checkInChat', () => this.checkInChat());

    this.checkStartInterval = setInterval(() => this.checkStart(), 5000);

    this.page.on('close', () => {
      clearInterval(this.checkStartInterval as NodeJS.Timeout);
    });
  }

  protected async checkStart() {
    needsToScan(this.page)
      .then((need) => {})
      .catch(() => null);
  }

  protected async checkQrCode() {
    const needScan = await needsToScan(this.page).catch(() => null);

    this.isLogged = !needScan;
    if (!needScan) {
      this.attempt = 0;
      return;
    }

    const result = await this.getQrCode();

    if (!result?.urlCode || this.urlCode === result.urlCode) {
      return;
    }
    if (typeof this.options.phoneNumber === 'string') {
      return this.loginByCode(this.options.phoneNumber);
    }
    this.urlCode = result.urlCode;
    this.attempt++;

    let qr = '';

    if (this.options.logQR || this.catchQR) {
      qr = await asciiQr(this.urlCode);
    }

    if (this.options.logQR) {
      this.log(
        'info',
        `Waiting for QRCode Scan (Attempt ${this.attempt})...:\n${qr}`,
        { code: this.urlCode }
      );
    } else {
      this.log('verbose', `Waiting for QRCode Scan: Attempt ${this.attempt}`);
    }

    this.catchQR?.(result.base64Image, qr, this.attempt, result.urlCode);
  }

  protected async loginByCode(phone: string) {
    const code = await evaluateAndReturn(
      this.page,
      async ({ phone }) => {
        return JSON.parse(
          JSON.stringify(await WPP.conn.genLinkDeviceCodeForPhoneNumber(phone))
        );
      },
      { phone }
    );
    if (this.options.logQR) {
      this.log('info', `Waiting for Login By Code (Code: ${code})\n`);
    } else {
      this.log('verbose', `Waiting for Login By Code`);
    }
    this.catchLinkCode?.(code);
  }

  protected async checkInChat() {
    const inChat = await isInsideChat(this.page).catch(() => null);

    this.isInChat = !!inChat;

    if (!inChat) {
      return;
    }
    this.log('http', 'Connected');
    this.statusFind?.('inChat', this.session);
  }

  protected tryAutoClose() {
    if (this.autoCloseInterval) {
      this.cancelAutoClose();
    }

    if (
      (this.options.autoClose > 0 || this.options.deviceSyncTimeout > 0) &&
      !this.autoCloseInterval &&
      !this.page.isClosed()
    ) {
      this.log('info', 'Closing the page');
      this.autoCloseCalled = true;
      this.statusFind && this.statusFind('autocloseCalled', this.session);
      try {
        this.page.close();
      } catch (error) {}
    }
  }

  protected startAutoClose(time: number | null = null) {
    if (time === null || time === undefined) {
      time = this.options.autoClose;
    }

    if (time > 0 && !this.autoCloseInterval) {
      const seconds = Math.round(time / 1000);
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

  public async waitForQrCodeScan() {
    if (!this.isStarted) {
      throw new Error('waitForQrCodeScan error: Session not started');
    }
    while (!this.page.isClosed() && !this.isLogged) {
      await sleep(200);
      const needScan = await needsToScan(this.page).catch(() => null);
      this.isLogged = !needScan;
    }
  }

  public async waitForInChat() {
    if (!this.isStarted) {
      throw new Error('waitForInChat error: Session not started');
    }

    if (!this.isLogged) {
      return false;
    }

    const start = Date.now();

    while (!this.page.isClosed() && this.isLogged && !this.isInChat) {
      if (
        this.options.deviceSyncTimeout > 0 &&
        Date.now() - start >= this.options.deviceSyncTimeout
      ) {
        return false;
      }

      await sleep(1000);
      const inChat = isInsideChat(this.page).catch(() => null);
      this.isInChat = !!inChat;
    }
    return this.isInChat;
  }

  public async waitForPageLoad() {
    while (!this.isInjected) {
      await sleep(200);
    }

    await this.page.waitForFunction(() => WPP.isReady).catch(() => {});
  }

  public async waitForLogin() {
    this.log('http', 'Waiting page load');

    await this.waitForPageLoad();

    this.log('http', 'Checking is logged...');
    let authenticated = await isAuthenticated(this.page).catch(() => null);

    this.startAutoClose();

    if (authenticated === false) {
      this.log(
        'http',
        typeof this.options.phoneNumber === 'string'
          ? 'Waiting for Login by Code...'
          : 'Waiting for QRCode Scan...'
      );
      this.statusFind?.('notLogged', this.session);
      await this.waitForQrCodeScan();

      this.log(
        'http',
        typeof this.options.phoneNumber === 'string'
          ? 'Checking Login by Code status...'
          : 'Checking QRCode status...'
      );
      // Wait for interface update
      await sleep(200);
      authenticated = await isAuthenticated(this.page).catch(() => null);

      if (authenticated === null) {
        this.log('warn', 'Failed to authenticate');
        this.statusFind?.('qrReadError', this.session);
      } else if (authenticated) {
        this.log('http', 'Login with success');
        this.statusFind?.('qrReadSuccess', this.session);
      } else {
        this.log('warn', 'Login Fail');
        this.statusFind?.('qrReadFail', this.session);
        this.tryAutoClose();
        throw 'Failed to read the QRCode';
      }
    } else if (authenticated === true) {
      this.log('http', 'Authenticated');
      this.statusFind?.('isLogged', this.session);
    }

    if (authenticated === true) {
      // Reinicia o contador do autoclose
      this.cancelAutoClose();
      // Wait for interface update
      await sleep(200);
      this.startAutoClose(this.options.deviceSyncTimeout);
      this.log('http', 'Checking phone is connected...');
      const inChat = await this.waitForInChat();

      if (!inChat) {
        this.log('warn', 'Phone not connected');
        this.statusFind?.('phoneNotConnected', this.session);
        this.tryAutoClose();
        throw 'Phone not connected';
      }
      this.cancelAutoClose();
      return true;
    }

    if (authenticated === false) {
      this.tryAutoClose();
      this.log('warn', 'Not logged');
      throw 'Not logged';
    }

    this.tryAutoClose();

    if (this.autoCloseCalled) {
      this.log('error', 'Auto Close Called');
      throw 'Auto Close Called';
    }

    if (this.page.isClosed()) {
      this.log('error', 'Page Closed');
      throw 'Page Closed';
    }

    this.log('error', 'Unknow error');
    throw 'Unknow error';
  }

  /**
   * @category Host
   * @returns Current host device details
   */
  public async getHostDevice(): Promise<HostDevice> {
    return await evaluateAndReturn(this.page, () => WAPI.getHost());
  }

  /**
   * @category Host
   * @returns Current wid connected
   */
  public async getWid(): Promise<string> {
    return await evaluateAndReturn(this.page, () => WAPI.getWid());
  }

  /**
   * Retrieves WA version
   * @category Host
   */
  public async getWAVersion() {
    await this.page
      .waitForFunction(() => WAPI.getWAVersion())
      .catch(() => null);

    return await evaluateAndReturn(this.page, () => WAPI.getWAVersion());
  }

  /**
   * Retrieves WA-JS version
   * @category Host
   */
  public async getWAJSVersion() {
    await this.page.waitForFunction(() => WPP.version).catch(() => null);

    return await evaluateAndReturn(this.page, () => WPP.version);
  }

  /**
   * Retrieves the connection state
   * @category Host
   */
  public async getConnectionState(): Promise<SocketState> {
    return await evaluateAndReturn(this.page, () => {
      return WPP.whatsapp.Socket.state as SocketState;
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
   * Check is online
   * @category Host
   */
  public async isOnline(): Promise<boolean> {
    return await evaluateAndReturn(this.page, () => WPP.conn.isOnline());
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

  /**
   * Check the current session is an MultiDevice session
   * @category Host
   */
  public async isMultiDevice() {
    return await evaluateAndReturn(this.page, () => WPP.conn.isMultiDevice());
  }
  /**
   * Retrieve main interface is authenticated, loaded and synced
   * @category Host
   */
  public async isMainReady() {
    return await evaluateAndReturn(this.page, () => WPP.conn.isMainReady());
  }

  /**
   * Retrieve if is authenticated
   * @category Host
   */
  public async isAuthenticated() {
    return await evaluateAndReturn(this.page, () => WPP.conn.isAuthenticated());
  }

  /**
   * Retrieve if main interface is authenticated and loaded, bot not synced
   * @category Host
   */
  public async isMainLoaded() {
    return await evaluateAndReturn(this.page, () => WPP.conn.isMainLoaded());
  }

  /**
   * Retrieve if main interface is initializing
   * @category Host
   */
  public async isMainInit() {
    return await evaluateAndReturn(this.page, () => WPP.conn.isMainInit());
  }

  /**
   * Join or leave of WhatsApp Web beta program.
   * Will return the value seted
   * @category Host
   */
  public async joinWebBeta(value: boolean): Promise<boolean> {
    return await evaluateAndReturn(
      this.page,
      (value) => WPP.conn.joinWebBeta(value),
      value
    );
  }
  /**
   * Get WhatsApp build constants
   * @category Host
   * @returns Build constants information
   */
  public async getBuildConstants() {
    return await evaluateAndReturn(this.page, () =>
      WPP.conn.getBuildConstants()
    );
  }

  /**
   * Check if the account has been migrated to LID
   * @category Host
   * @returns true if the account has been migrated to LID, false otherwise
   */
  public async isLidMigrated(): Promise<boolean> {
    return await evaluateAndReturn(
      this.page,
      () => WPP.whatsapp.functions.isLidMigrated() as boolean
    );
  }
}
