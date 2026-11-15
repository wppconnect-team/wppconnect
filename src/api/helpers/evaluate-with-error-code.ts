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

/**
 * Runs `pageFunction(arg)` in the page and keeps the `code` (and the other
 * serializable fields) of a thrown WPPError, which a plain `page.evaluate`
 * drops, leaving only the message.
 *
 * `pageFunction` is sent as source, so it must not reference anything outside
 * of itself, and `arg` must be JSON serializable.
 */
export async function evaluateWithErrorCode<A, R>(
  page: Page,
  pageFunction: (arg: A) => R | Promise<R>,
  arg?: A
): Promise<R> {
  const result: any = await page.evaluate(`(async () => {
    try {
      const value = await (${pageFunction.toString()})(${JSON.stringify(
    arg === undefined ? null : arg
  )});
      return { ok: true, value };
    } catch (e) {
      const error = { message: (e && e.message) || String(e) };
      if (e && typeof e === 'object') {
        for (const key of Object.keys(e)) {
          try {
            error[key] = JSON.parse(JSON.stringify(e[key]));
          } catch (_) {}
        }
      }
      return { ok: false, error };
    }
  })()`);

  if (!result.ok) {
    throw Object.assign(new Error(result.error.message), result.error);
  }
  return result.value;
}
