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
import { Browser, BrowserContext, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { CreateConfig } from '../config/create-config';
import { puppeteerConfig } from '../config/puppeteer.config';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { useragentOverride } from '../config/WAuserAgente';
import { WebSocketTransport } from './websocket';
import { Logger } from 'winston';
import { SessionToken } from '../token-store';
import { LoadingScreenCallback } from '../api/model';
import { LogLevel } from '../utils/logger';
import { sleep } from '../utils/sleep';

export async function unregisterServiceWorker(page: Page) {
  await page.evaluateOnNewDocument(() => {
    // Remove existent service worker
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (let registration of registrations) {
          registration.unregister();
        }
      })
      .catch((err) => null);

    // Disable service worker registration
    // @ts-ignore
    navigator.serviceWorker.register = new Promise(() => {});

    setInterval(() => {
      window.onerror = console.error;
      window.onunhandledrejection = console.error;
    }, 500);
  });
}

/**
 * Força o carregamento de uma versão específica do WhatsApp WEB
 * @param page Página a ser injetada
 * @param version Versão ou expressão semver
 */
export async function setWhatsappVersion(
  page: Page,
  version: string,
  log?: (level: LogLevel, message: string, meta?: object) => any
) {
  let body: string | null = null;
  try {
    body = waVersion.getPageContent(version);
  } catch (error) {}

  if (!body) {
    log?.(
      'error',
      `Version not available for ${version}, using latest as fallback`
    );
    return;
  }

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
  version?: string,
  proxy?: {
    url: string;
    username: string;
    password: string;
  },
  log?: (level: LogLevel, message: string, meta?: object) => any
) {
  if (proxy) {
    await page.authenticate({
      username: proxy.username,
      password: proxy.password,
    });
  }

  await page.setUserAgent(useragentOverride);

  await unregisterServiceWorker(page);

  if (version) {
    log?.('verbose', `Setting WhatsApp WEB version to ${version}`);
    await setWhatsappVersion(page, version, log);
  }

  log?.('verbose', `Loading WhatsApp WEB`);
  await page.goto(puppeteerConfig.whatsappUrl, {
    waitUntil: 'load',
    timeout: 0,
    referer: 'https://whatsapp.com/',
  });

  log?.('verbose', 'WhatsApp WEB loaded');
  /*setTimeout(() => {
    log?.('verbose', `Loading WhatsApp WEB`);

    const timeout = 10 * 1000;
    page
      .goto(puppeteerConfig.whatsappUrl, {
        timeout,
        waitUntil: 'domcontentloaded',
      })
      .catch(() => {});

    log?.('verbose', `WhatsApp WEB loaded`);
  }, 1000);
  */

  return page;
}

let lastPercent = null;
let lastPercentMessage = null;
export async function onLoadingScreen(
  page: Page,
  onLoadingScreenCallBack?: LoadingScreenCallback
) {
  await page.evaluate(`function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }`);

  await page
    .exposeFunction(
      'loadingScreen',
      async (percent: number, message: string) => {
        if (lastPercent !== percent || lastPercentMessage !== message) {
          onLoadingScreenCallBack && onLoadingScreenCallBack(percent, message);
          lastPercent = percent;
          lastPercentMessage = message;
        }
      }
    )
    .catch(() => null);

  await page.evaluate(
    function (selectors) {
      let observer = new MutationObserver(function () {
        let window2: any = window;

        let progressBar = window2.getElementByXpath(selectors.PROGRESS);
        let progressBarNewTheme = window2.getElementByXpath(
          selectors.PROGRESS_NEW_THEME
        );
        let progressMessage = window2.getElementByXpath(
          selectors.PROGRESS_MESSAGE
        );
        let progressMessageNewTheme = window2.getElementByXpath(
          selectors.PROGRESS_MESSAGE_NEW_THEME
        );

        if (progressBar) {
          if (
            this.lastPercent !== progressBar.value ||
            this.lastPercentMessage !== progressMessage.innerText
          ) {
            window2.loadingScreen(progressBar.value, progressMessage.innerText);
            this.lastPercent = progressBar.value;
            this.lastPercentMessage = progressMessage.innerText;
          }
        } else if (progressBarNewTheme) {
          if (
            this.lastPercent !== progressBarNewTheme.value ||
            this.lastPercentMessage !== progressMessageNewTheme.innerText
          ) {
            const progressMsg =
              progressMessageNewTheme.innerText != 'WhatsApp'
                ? progressMessageNewTheme.innerText
                : '';
            window2.loadingScreen(progressBarNewTheme.value, progressMsg);
            this.lastPercent = progressBarNewTheme.value;
            this.lastPercentMessage = progressMsg;
          }
        }
      });

      observer.observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });
    },
    {
      PROGRESS: "//*[@id='app']/div/div/div[2]/progress",
      PROGRESS_NEW_THEME: "//*[@id='app']/div/div/div[3]/progress",
      PROGRESS_MESSAGE: "//*[@id='app']/div/div/div[3]",
      PROGRESS_MESSAGE_NEW_THEME: "//*[@id='app']/div/div/div[2]",
    }
  );
}

export async function injectApi(
  page: Page,
  onLoadingScreenCallBack?: LoadingScreenCallback
) {
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
    path: require.resolve('@wppconnect/wa-js'),
  });

  await page.evaluate(() => {
    WPP.chat.defaultSendMessageOptions.createChat = true;
    WPP.conn.setKeepAlive(true);
  });
  await page.addScriptTag({
    path: require.resolve(
      path.join(__dirname, '../../dist/lib/wapi', 'wapi.js')
    ),
  });
  await onLoadingScreen(page, onLoadingScreenCallBack);
  // Make sure WAPI is initialized
  await page
    .waitForFunction(() => {
      return (
        typeof window.WAPI !== 'undefined' &&
        typeof window.Store !== 'undefined' &&
        window.WPP.isReady
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
    /**
     * Setting the headless mode to the old Puppeteer mode, when using the 'new' mode, results in an error on CentOS7 and Debian11.
     * Temporary fix.
     *
     * If proxy settings are provided, they are applied to the browser launch arguments.
     * This allows the browser to use the specified proxy server for all network requests.
     */

    const args = options.browserArgs
      ? options.browserArgs
      : [...puppeteerConfig.chromiumArgs];
    if (options.proxy && options.proxy.url) {
      args.push(`--proxy-server=${options.proxy.url}`);
    }

    browser = await puppeteer.launch({
      headless: options.headless,
      devtools: options.devtools,
      args,
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
          process.on('exit', () => {
            // Remove only on exit signal
            try {
              rimraf.sync(tmpUserDataDir);
            } catch (error) {}
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
    const data = await axios.get<any>(endpointURL).then((r) => r.data);

    return await WebSocketTransport.create(data.webSocketDebuggerUrl, 10000);
  } catch (e) {}

  // Throw first error
  throw error;
}
