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
    await page.waitForFunction(() => {
      const selectorImg = document.querySelector('canvas');
      const selectorUrl = selectorImg.closest('[data-ref]');
      return selectorUrl.getAttribute('data-ref');
    });
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
