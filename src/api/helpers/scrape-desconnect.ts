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
declare global {
  interface Window {
    Store: any;
  }
}
export async function scrapeDesconnected(page: Page): Promise<boolean> {
  const result = await page.evaluate(() => {
    const scrape = window.Store.State.default.on('change:state');
    if (
      scrape.__x_stream === 'DISCONNECTED' &&
      scrape.__x_state === 'CONNECTED'
    ) {
      return true;
    } else {
      return false;
    }
  });
  return result;
}
