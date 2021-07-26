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

import * as ChromeLauncher from 'chrome-launcher';
import * as os from 'os';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as waVersion from '@wppconnect/wa-version';
import axios from 'axios';
import { addExitCallback } from 'catch-exit';
import { Browser, BrowserContext, Page, Request } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { CreateConfig } from '../config/create-config';
import { puppeteerConfig } from '../config/puppeteer.config';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { injectSessionToken } from './auth';
import { useragentOverride } from '../config/WAuserAgente';
import { WebSocketTransport } from './websocket';
import { Logger } from 'winston';
import { SessionToken } from '../token-store';

/**
 * Força o carregamento de uma versão específica do WhatsApp WEB
 * @param page Página a ser injetada
 * @param version Versão ou expressão semver
 */
export async function setWhatsappVersion(page: Page, version: string) {
  const body = waVersion.getPageContent(version);

  await page.setRequestInterception(true);

  page.on('request', (req) => {
    if (req.url().startsWith('https://web.whatsapp.com/check-update')) {
      req.abort();
      return;
    }
    if (req.url() !== 'https://web.whatsapp.com/') {
      req.continue();
      return;
    }

    req.respond({
      status: 200,
      contentType: 'text/html',
      body: body,
    });
  });
}

export async function initWhatsapp(
  page: Page,
  token?: SessionToken,
  clear = true,
  version?: string
) {
  await page.setUserAgent(useragentOverride);

  // Auth with token
  await injectSessionToken(page, token, clear);

  if (version) {
    await setWhatsappVersion(page, version);
  }

  const timeout = 10 * 1000;
  await Promise.race([
    page.goto(puppeteerConfig.whatsappUrl, { timeout }).catch(() => {}),
    page.waitForSelector('body', { timeout }).catch(() => {}),
  ]);

  return page;
}

export async function injectApi(page: Page) {
  const injected = await page
    .evaluate(() => {
      // @ts-ignore
      return (
        typeof window.WAPI !== 'undefined' &&
        typeof window.Store !== 'undefined'
      );
    })
    .catch(() => false);

  if (injected) {
    return;
  }

  await page.addScriptTag({
    path: require.resolve(
      path.join(__dirname, '../../dist/lib/wapi', 'wapi.js')
    ),
  });

  // Make sure WAPI is initialized
  return await page
    .waitForFunction(() => {
      // @ts-ignore
      return (
        typeof window.WAPI !== 'undefined' &&
        typeof window.Store !== 'undefined'
      );
    })
    .catch(() => false);
}

/**
 * Initializes browser, will try to use chrome as default
 * @param session
 */
export async function initBrowser(
  session: string,
  options: CreateConfig,
  logger: Logger
): Promise<Browser> {
  if (options.useChrome) {
    const chromePath = getChrome();
    if (chromePath) {
      if (!options.puppeteerOptions) {
        options.puppeteerOptions = {};
      }
      options.puppeteerOptions.executablePath = chromePath;
    } else {
      logger.warn('Chrome not found, using chromium', {
        session,
        type: 'browser',
      });
    }
  }

  // Use stealth plugin to avoid being detected as a bot
  puppeteer.use(StealthPlugin());

  let browser = null;
  if (options.browserWS && options.browserWS != '') {
    const transport = await getTransport(options.browserWS);
    browser = await puppeteer.connect({ transport });
  } else {
    browser = await puppeteer.launch({
      headless: options.headless,
      devtools: options.devtools,
      args: options.browserArgs
        ? options.browserArgs
        : [...puppeteerConfig.chromiumArgs],
      ...options.puppeteerOptions,
    });

    // Register an exit callback to remove user-data-dir
    try {
      const arg = browser
        .process()
        .spawnargs.find((s: string) => s.startsWith('--user-data-dir='));

      if (arg) {
        const tmpUserDataDir = arg.split('=')[1];

        // Only if path is in TMP directory
        if (
          path.relative(os.tmpdir(), tmpUserDataDir).startsWith('puppeteer')
        ) {
          addExitCallback((signal) => {
            // Remove only on exit signal
            if (signal === 'exit') {
              try {
                rimraf.sync(tmpUserDataDir);
              } catch (error) {}
            }
          });
        }
      }
    } catch (error) {}
  }

  return browser;
}

export async function getOrCreatePage(
  browser: Browser | BrowserContext
): Promise<Page> {
  const pages = await browser.pages();

  if (pages.length) {
    return pages[0];
  }

  return await browser.newPage();
}

/**
 * Retrieves chrome instance path
 */
function getChrome() {
  try {
    return ChromeLauncher.Launcher.getFirstInstallation();
  } catch (error) {
    return undefined;
  }
}

async function getTransport(browserWS: string) {
  let error = null;
  try {
    return await WebSocketTransport.create(browserWS, 10000);
  } catch (e) {
    error = e;
  }

  // Automatic get the endpoint
  try {
    const endpointURL =
      browserWS.replace(/ws(s)?:/, 'http$1:') + '/json/version';
    const data = await axios.get(endpointURL).then((r) => r.data);

    return await WebSocketTransport.create(data.webSocketDebuggerUrl, 10000);
  } catch (e) {}

  // Throw first error
  throw error;
}
