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

      if (authenticated) {
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
