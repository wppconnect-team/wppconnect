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

import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as qrcode from 'qrcode-terminal';
import { ScrapQrcode } from '../api/model/qrcode';
import { puppeteerConfig } from '../config/puppeteer.config';
import { isValidSessionToken } from '../token-store';

export const getInterfaceStatus = async (
  waPage: puppeteer.Page
): Promise<string | null> => {
  return await waPage
    .waitForFunction(
      () => {
        const elLoginWrapper = document.querySelector(
          'body > div > div > .landing-wrapper'
        );
        const elQRCodeCanvas = document.querySelector('canvas');
        if (elLoginWrapper && elQRCodeCanvas) {
          return 'UNPAIRED';
        }

        const streamStatus =
          window['Store'] &&
          window['Store'].Stream &&
          window['Store'].Stream.displayInfo;
        if (['PAIRING', 'RESUMING', 'SYNCING'].includes(streamStatus)) {
          return 'PAIRING';
        }
        const elChat = document.querySelector('.app,.two') as HTMLDivElement;
        if (elChat && elChat.attributes && elChat.tabIndex) {
          return 'CONNECTED';
        }
        return false;
      },
      {
        timeout: 0,
        polling: 100,
      }
    )
    .then(async (element) => {
      return (await element.evaluate((a) => a)) as string;
    })
    .catch(() => null);
};

/**
 * Validates if client is authenticated
 * @returns true if is authenticated, false otherwise
 * @param waPage
 */
export const isAuthenticated = async (waPage: puppeteer.Page) => {
  const status = await getInterfaceStatus(waPage);
  if (typeof status !== 'string') {
    return null;
  }

  return ['CONNECTED', 'PAIRING'].includes(status);
};

export const needsToScan = async (waPage: puppeteer.Page) => {
  const status = await getInterfaceStatus(waPage);
  if (typeof status !== 'string') {
    return null;
  }

  return status === 'UNPAIRED';
};

export const isInsideChat = async (waPage: puppeteer.Page) => {
  const status = await getInterfaceStatus(waPage);
  if (typeof status !== 'string') {
    return null;
  }

  return status === 'CONNECTED';
};

export const isConnectingToPhone = async (waPage: puppeteer.Page) => {
  const status = await getInterfaceStatus(waPage);
  if (typeof status !== 'string') {
    return null;
  }

  return status === 'PAIRING';
};

export async function asciiQr(code: string): Promise<string> {
  return new Promise((resolve) => {
    qrcode.generate(code, { small: true }, (qrcode) => {
      resolve(qrcode);
    });
  });
}

export async function injectSessionToken(
  page: puppeteer.Page,
  token?: any,
  clear = true
) {
  if (!token || !isValidSessionToken(token)) {
    token = {};
  }

  await page.setRequestInterception(true);

  // @todo Move to another file
  const reqHandler = (req: puppeteer.Request) => {
    if (req.url().endsWith('wppconnect-banner.jpeg')) {
      req.respond({
        body: fs.readFileSync(
          path.resolve(__dirname + '/../../img/wppconnect-banner.jpeg')
        ),
        contentType: 'image/jpeg',
      });
      return;
    }

    if (req.resourceType() !== 'document') {
      req.continue();
      return;
    }

    req.respond({
      status: 200,
      contentType: 'text/html',
      body: `
<!doctype html>
<html lang=en>
  <head>
    <title>Initializing WhatsApp</title>
    <style>
      body {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: arial, sans-serif;
        background-color: #e6e6e6;
      }
      img {
        display: block;
        max-width: 100%;
        max-height:100%;
      }
      h1 {
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div>
      <img src="wppconnect-banner.jpeg" />
      <h1>Initializing WhatsApp ...</h1>
    </div>
  </body>
</html>`,
    });
  };
  page.on('request', reqHandler);

  await page.goto(puppeteerConfig.whatsappUrl);

  if (clear) {
    await page.evaluate((session) => {
      localStorage.clear();
    });
  }
  await page.evaluate((session) => {
    Object.keys(session).forEach((key) => {
      localStorage.setItem(key, session[key]);
    });
  }, token as any);

  // Disable
  page.off('request', reqHandler);
  await page.setRequestInterception(false);
}
