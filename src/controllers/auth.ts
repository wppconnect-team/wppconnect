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

import * as puppeteer from 'puppeteer';
import * as qrcode from 'qrcode-terminal';

export const getInterfaceStatus = async (
  waPage: puppeteer.Page
): Promise<puppeteer.HandleFor<Awaited<ReturnType<any>>>> => {
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

        const streamStatus = WPP?.whatsapp?.Stream?.displayInfo;
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
    .then(async (element: puppeteer.HandleFor<Awaited<ReturnType<any>>>) => {
      return (await element.evaluate((a: any) => a)) as puppeteer.HandleFor<
        ReturnType<any>
      >;
    })
    .catch(() => null);
};

/**
 * Validates if client is authenticated
 * @returns true if is authenticated, false otherwise
 * @param waPage
 */
export const isAuthenticated = (waPage: puppeteer.Page) => {
  return waPage.evaluate(() => WPP.conn.isRegistered());
};

export const needsToScan = async (waPage: puppeteer.Page) => {
  const connected = await isAuthenticated(waPage);

  return !connected;
};

export const isInsideChat = async (waPage: puppeteer.Page) => {
  return await waPage.evaluate(() => WPP.conn.isMainReady());
};

export const isConnectingToPhone = async (waPage: puppeteer.Page) => {
  return await waPage.evaluate(
    () => WPP.conn.isMainLoaded() && !WPP.conn.isMainReady()
  );
};

export async function asciiQr(code: string): Promise<string> {
  return new Promise((resolve) => {
    qrcode.generate(code, { small: true }, (qrcode) => {
      resolve(qrcode);
    });
  });
}
