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

import { Whatsapp } from '../api/whatsapp';
import { CreateConfig, defaultOptions } from '../config/create-config';
import { initBrowser, getOrCreatePage } from './browser';
import { checkUpdates, welcomeScreen } from './welcome';
import { SocketState, StatusFind } from '../api/model/enum';
import { Browser } from 'puppeteer';
import {
  CatchQRCallback,
  CreateOptions,
  LinkByCodeCallback,
  LoadingScreenCallback,
  StatusFindCallback,
} from '../api/model/initializer';
import { SessionToken } from '../token-store';
import { defaultLogger } from '../utils/logger';
import * as path from 'path';
import * as fs from 'fs';
import sanitize from 'sanitize-filename';
import { sleep } from '../utils/sleep';

process.on(
  'unhandledRejection',
  (reason: Error | any, promise: Promise<any>) => {
    let message = 'Unhandled Rejection: ';
    if (reason instanceof Error) {
      if (reason.stack) {
        message += reason.stack;
      } else {
        message += reason.toString();
      }
    } else {
      message += JSON.stringify(reason);
    }

    defaultLogger.error(message);
  }
);

/**
 * Start the bot
 * @returns Whatsapp page, with this parameter you will be able to access the bot functions
 */
export async function create(createOption: CreateOptions): Promise<Whatsapp>;
/**
 * Start the bot
 * You must pass a string type parameter, this parameter will be the name of the client's session. If the parameter is not passed, the section name will be "session".
 * @returns Whatsapp page, with this parameter you will be able to access the bot functions
 * @deprecated Deprecated in favor of create with {@link CreateOptions} (e.g., wppconnect.create({session: 'test'})).
 */
export async function create(
  sessionName: string,
  catchQR?: CatchQRCallback,
  statusFind?: StatusFindCallback,
  onLoadingScreen?: LoadingScreenCallback,
  catchLinkCode?: LinkByCodeCallback,
  options?: CreateConfig,
  browserSessionToken?: SessionToken
): Promise<Whatsapp>;

export async function create(
  sessionOrOption: string | CreateOptions,
  catchQR?: CatchQRCallback,
  statusFind?: StatusFindCallback,
  onLoadingScreen?: LoadingScreenCallback,
  catchLinkCode?: LinkByCodeCallback,
  options?: CreateConfig,
  browserSessionToken?: SessionToken
): Promise<Whatsapp> {
  let session = 'session';
  let usingDeprecatedCreate = false;

  if (
    typeof sessionOrOption === 'string' &&
    sessionOrOption.replace(/\s/g, '').length
  ) {
    session = sessionOrOption.replace(/\s/g, '');

    usingDeprecatedCreate =
      typeof sessionOrOption === 'string' ||
      typeof catchQR !== 'undefined' ||
      typeof statusFind !== 'undefined' ||
      typeof options !== 'undefined' ||
      typeof browserSessionToken !== 'undefined';
  } else if (typeof sessionOrOption === 'object') {
    options = sessionOrOption;
    if (sessionOrOption.session) session = sessionOrOption.session;
    catchQR = sessionOrOption.catchQR || catchQR;
    statusFind = sessionOrOption.statusFind || statusFind;
    onLoadingScreen = sessionOrOption.onLoadingScreen || onLoadingScreen;
    catchLinkCode = sessionOrOption.catchLinkCode || catchLinkCode;

    if (!options.sessionToken) {
      options.sessionToken =
        sessionOrOption.browserSessionToken || browserSessionToken;
    }
  }

  const mergedOptions = { ...defaultOptions, ...options };

  const logger = mergedOptions.logger;

  if (usingDeprecatedCreate) {
    logger.warn(
      'You are using deprecated create method, please use create({options}) See: https://wppconnect.io/wppconnect/pages/Getting%20Started/creating-client.html#passing-options-on-create'
    );
  }

  if (!mergedOptions.disableWelcome) {
    welcomeScreen();
  }

  if (mergedOptions.updatesLog) {
    await checkUpdates();
  }

  let browser = mergedOptions.browser;
  let page = mergedOptions.page;

  if (!browser && page) {
    // Get browser from page
    browser = page.browser();
  } else if (!browser && !page) {
    if (
      !mergedOptions.browserWS &&
      !mergedOptions.puppeteerOptions?.userDataDir
    ) {
      mergedOptions.puppeteerOptions.userDataDir = path.resolve(
        process.cwd(),
        path.join(mergedOptions.folderNameToken, sanitize(session))
      );

      if (!fs.existsSync(mergedOptions.puppeteerOptions.userDataDir)) {
        fs.mkdirSync(mergedOptions.puppeteerOptions.userDataDir, {
          recursive: true,
        });
      }
    }

    if (!mergedOptions.browserWS) {
      logger.info(
        `Using browser folder '${mergedOptions.puppeteerOptions.userDataDir}'`,
        {
          session,
          type: 'browser',
        }
      );
    }

    // Initialize new browser
    logger.info('Initializing browser...', { session, type: 'browser' });
    browser = await initBrowser(session, mergedOptions, logger).catch((e) => {
      if (mergedOptions.browserWS && mergedOptions.browserWS != '') {
        logger.error(`Error when try to connect ${mergedOptions.browserWS}`, {
          session,
          type: 'browser',
        });
      } else {
        logger.error(`Error no open browser`, {
          session,
          type: 'browser',
        });
      }
      logger.error(e.message, {
        session,
        type: 'browser',
      });
      throw e;
    });

    logger.http('checking headless...', {
      session,
      type: 'browser',
    });

    if (mergedOptions.headless) {
      logger.http('headless option is active, browser hidden', {
        session,
        type: 'browser',
      });
    } else {
      logger.http('headless option is disabled, browser visible', {
        session,
        type: 'browser',
      });
    }
  }

  if (!mergedOptions.browserWS && browser['_process']) {
    browser['_process'].once('close', () => {
      browser['isClose'] = true;
    });
  }

  (browser as Browser).on('targetdestroyed', async (target: any) => {
    if (
      typeof (browser as Browser).isConnected === 'function' &&
      !(browser as Browser).isConnected()
    ) {
      return;
    }
    const pages = await browser.pages();
    if (!pages.length) {
      browser.close().catch(() => null);
    }
  });

  (browser as Browser).on('disconnected', () => {
    if (mergedOptions.browserWS) {
      statusFind && statusFind('serverClose', session);
    } else {
      statusFind && statusFind('browserClose', session);
    }
  });

  if (!page) {
    // Initialize a page
    page = await getOrCreatePage(browser);
  }

  if (page) {
    await page.setBypassCSP(true);

    const client = new Whatsapp(page, session, mergedOptions);
    client.catchQR = catchQR;
    client.statusFind = statusFind;
    client.onLoadingScreen = onLoadingScreen;
    client.catchLinkCode = catchLinkCode;

    await client.start();

    if (mergedOptions.waitForLogin) {
      const isLogged = await client.waitForLogin();
      if (!isLogged) {
        throw 'Not Logged';
      }

      let waitLoginPromise = null;
      client.onStateChange(async (state) => {
        const connected = await page.evaluate(() => WPP.conn.isRegistered());
        if (!connected) {
          await sleep(2000);

          if (!waitLoginPromise) {
            waitLoginPromise = client
              .waitForLogin()
              .catch(() => {})
              .finally(() => {
                waitLoginPromise = null;
              });
          }
          await waitLoginPromise;
        }
      });
    }

    return client;
  }
}
