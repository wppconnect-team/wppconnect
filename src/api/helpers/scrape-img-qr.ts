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
import { ScrapQrcode } from '../model/qrcode';
import { sleep } from '../../utils/sleep';

/**
 * Page-side check for a QR code other than `previous`, or for the reload
 * button WhatsApp shows once the codes run out.
 */
export function hasNewQrCode(previous: string): boolean {
  const holder = document.querySelector('canvas')?.closest('[data-ref]');
  if (holder?.querySelector('button')) return true;
  const code = holder?.getAttribute('data-ref');
  return !!code && code !== previous;
}

/**
 * Waits for WhatsApp to paint a new QR code. The ref changes before the canvas
 * does, and a read made in between misses the code until the next rotation.
 * Polls from Node: page timers stall in hidden tabs and on a busy main thread.
 */
export async function waitForNewQrCode(
  page: Page,
  previous: string,
  timeout = 20000
): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline && !page.isClosed()) {
    const painted = await page
      .evaluate(hasNewQrCode, previous)
      .catch(() => null);
    // null: navigated or closed; let the caller read whatever is there
    if (painted !== false) return;
    await sleep(250);
  }
}

export async function scrapeImg(page: Page): Promise<ScrapQrcode | undefined> {
  let click = await page
    .evaluate(() => {
      const selectorImg = document.querySelector('canvas');
      const selectorUrl = selectorImg.closest('[data-ref]');
      //const buttonReload = selectorUrl.querySelector('[role="button"]') as HTMLButtonElement;
      const buttonReload = selectorUrl.querySelector('button');
      if (buttonReload != null) {
        buttonReload.click();
        return true;
      }
      return false;
    })
    .catch(() => false);

  if (click) {
    await page.waitForFunction(
      () => {
        const selectorImg = document.querySelector('canvas');
        const selectorUrl = selectorImg.closest('[data-ref]');
        return selectorUrl.getAttribute('data-ref');
      },
      { polling: 250 }
    );
  }

  const result = await page
    .evaluate(() => {
      const selectorImg = document.querySelector('canvas');
      const selectorUrl = selectorImg.closest('[data-ref]');

      if (selectorImg != null && selectorUrl != null) {
        let data = {
          base64Image: selectorImg.toDataURL(),
          urlCode: selectorUrl.getAttribute('data-ref'),
        };
        return data;
      } else {
        return undefined;
      }
    })
    .catch(() => undefined);

  return result;
}
