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
import * as path from 'path';
import axios from 'axios';
import { Browser, BrowserContext, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { CreateConfig } from '../config/create-config';
import { puppeteerConfig } from '../config/puppeteer.config';
import StealthPlugin = require('puppeteer-extra-plugin-stealth');
import { auth_InjectToken } from './auth';
import { useragentOverride } from '../config/WAuserAgente';
import { WebSocketTransport } from './websocket';
import { tokenSession } from '../config/tokenSession.config';

export async function initWhatsapp(
  session: string,
  options: CreateConfig,
  page: Page,
  token?: tokenSession
) {
  // Auth with token
  await auth_InjectToken(page, session, options, token);

  await page.setUserAgent(useragentOverride);

  const timeout = 2 * 1000;
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

  await page.addScriptTag({
    path: require.resolve(
      path.join(__dirname, '../../dist/lib/middleware', 'middleware.js')
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
  extras = {}
): Promise<Browser> {
  if (options.useChrome) {
    const chromePath = getChrome();
    if (chromePath) {
      extras = { ...extras, executablePath: chromePath };
    } else {
      console.log('Chrome not found, using chromium');
      extras = {};
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
      ...extras,
    });
  }

  return browser;
}

export async function getWhatsappPage(
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
    const chromeInstalations = ChromeLauncher.Launcher.getInstallations();
    return chromeInstalations[0];
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
