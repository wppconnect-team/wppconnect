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

import { readFileSync } from 'fs';
import { Whatsapp } from '../api/whatsapp';
import { CreateConfig, defaultOptions } from '../config/create-config';
import { SessionTokenCkeck, saveToken } from './auth';
import { initWhatsapp, initBrowser, getWhatsappPage } from './browser';
import { checkUpdates, welcomeScreen } from './welcome';
import { SocketState } from '../api/model/enum';
import { deleteFiles } from '../api/helpers';
import { tokenSession } from '../config/tokenSession.config';
import { Browser } from 'puppeteer';

/**
 * A callback will be received, informing the status of the qrcode
 */
export type CatchQR = (
  qrCode: string,
  asciiQR: string,
  attempt: number,
  urlCode?: string
) => void;

/**
 * A callback will be received, informing the customer's status
 */
export type StatusFind = (statusGet: string, session: string) => void;

export interface CreateOptions extends CreateConfig {
  /**
   * You must pass a string type parameter, this parameter will be the name of the client's session. If the parameter is not passed, the section name will be "session".
   */
  session: string;
  /**
   * A callback will be received, informing the status of the qrcode
   */
  catchQR?: CatchQR;
  /**
   * A callback will be received, informing the customer's status
   */
  statusFind?: StatusFind;
  /**
   * Pass the session token information you can receive this token with the await client.getSessionTokenBrowser () function
   */
  browserSessionToken?: tokenSession;
}

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
  catchQR?: CatchQR,
  statusFind?: StatusFind,
  options?: CreateConfig,
  browserSessionToken?: tokenSession
): Promise<Whatsapp>;

export async function create(
  sessionOrOption: string | CreateOptions,
  catchQR?: CatchQR,
  statusFind?: StatusFind,
  options?: CreateConfig,
  browserSessionToken?: tokenSession
): Promise<Whatsapp> {
  let session = 'session';

  if (
    typeof sessionOrOption === 'string' &&
    sessionOrOption.replace(/\s/g, '').length
  ) {
    session = sessionOrOption.replace(/\s/g, '');
  } else if (typeof sessionOrOption === 'object') {
    session = sessionOrOption.session;
    catchQR = sessionOrOption.catchQR || catchQR;
    statusFind = sessionOrOption.statusFind || statusFind;
    browserSessionToken =
      sessionOrOption.browserSessionToken || browserSessionToken;
    options = sessionOrOption;
  }

  let browserToken: any;

  const mergedOptions = { ...defaultOptions, ...options };

  const logger = mergedOptions.logger;

  if (typeof sessionOrOption === 'string') {
    logger.warn(
      'You are using deprecated create method, please use create({options})'
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
    // Initialize new browser
    logger.info('Initializing browser...', { session, type: 'browser' });
    browser = await initBrowser(session, mergedOptions).catch((e) => {
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

  if (SessionTokenCkeck(browserSessionToken)) {
    browserToken = browserSessionToken;
  }

  if (!page) {
    // Initialize a page
    page = await getWhatsappPage(browser);
  }

  // Initialize whatsapp
  await initWhatsapp(session, mergedOptions, page, browserToken);

  if (page) {
    const client = new Whatsapp(page, session, mergedOptions);

    if (mergedOptions.createPathFileToken) {
      client.onStateChange((state) => {
        if (state === SocketState.CONNECTED) {
          setTimeout(() => {
            saveToken(page, session, mergedOptions).catch((e) => {
              logger.error(e, { session });
            });
          }, 1000);
        }
      });
    }

    client.onStateChange(async (state) => {
      if (
        state === SocketState.UNPAIRED ||
        state === SocketState.UNPAIRED_IDLE
      ) {
        logger.info('Session Unpaired', { session });
        if (statusFind) {
          statusFind('desconnectedMobile', session);
        }
        deleteFiles(mergedOptions, session, logger);
      }
    });

    if (mergedOptions.waitForLogin) {
      const isLogged = await client.waitForLogin(catchQR, statusFind);
      if (!isLogged) {
        throw 'Not Logged';
      }

      let waitLoginPromise = null;
      client.onStateChange(async (state) => {
        if (
          state === SocketState.UNPAIRED ||
          state === SocketState.UNPAIRED_IDLE
        ) {
          if (!waitLoginPromise) {
            waitLoginPromise = client
              .waitForLogin(catchQR, statusFind)
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
