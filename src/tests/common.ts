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
import { Suite } from 'mocha';
import * as wppconnect from '../';

export const testUserId = process.env.TEST_USER_ID;
export const testGroupID = process.env.TEST_GROUP_ID;

export function describeAuthenticatedTest(
  title: string,
  fn: (this: Suite, getClient: () => wppconnect.Whatsapp) => void
) {
  describe(title, async function () {
    let client: wppconnect.Whatsapp;

    if (testUserId) {
      this.timeout(60000);
    }

    before(async function () {
      if (!testUserId) {
        console.warn(
          'Please, set environment variable TEST_USER_ID to run authenticated tests'
        );
        return this.skip();
      }
      wppconnect.defaultLogger.level = 'none';
      client = await wppconnect.create({
        session: 'test-authenticated',
        updatesLog: false,
        disableWelcome: true,
        waitForLogin: false,
      });
      const authenticated = await client.waitForLogin().catch(() => false);

      if (!authenticated) {
        console.warn(
          'Please, set create a authenticated session for "test-authenticated".'
        );
        return this.skip();
      }
    });

    after(async function () {
      if (client) {
        await client.close().catch(() => null);
      }
    });

    fn.call(this, () => client);
  });
}
