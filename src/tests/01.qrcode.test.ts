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
import * as wppconnect from '../index';
import * as assert from 'assert';
import { sleep } from '../utils/sleep';

describe('QRCode test', function () {
  let client: wppconnect.Whatsapp = null;

  this.timeout(20000);

  before(async function () {
    if (process.env.SKIP_QR_CODE) {
      this.skip();
    }

    wppconnect.defaultLogger.level = 'none';

    client = await wppconnect.create({
      session: 'qrcode-reader',
      waitForLogin: false,
      autoClose: 0,
    });

    await client.waitForPageLoad();
  });

  after(async function () {
    if (client) {
      await client.close();
    }
  });

  it('Get QRCode', async function () {
    const result = await client.getQrCode();
    assert.ok(result);
    assert.ok(result.urlCode);
    assert.ok(result.base64Image);
  });

  it('Await QRCode change', async function () {
    this.timeout(60000);

    const first = await client.getQrCode();
    await sleep(25000);
    const second = await client.getQrCode();

    assert.ok(second);
    assert.ok(second.urlCode !== first.urlCode);
    assert.ok(second.base64Image !== first.base64Image);
  });

  it('Await QRCode reload button', async function () {
    this.timeout(8 * 20000 + 20000);

    const result = await new Promise((resolve) => {
      client.waitForQrCodeScan((q, a, attempt) => {
        if (attempt > 6) {
          resolve(true);
        }
      });
    });

    assert.ok(result);
  });
});
