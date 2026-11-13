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
import { Page } from 'puppeteer';
import { HostLayer } from '../api/layers/host.layer';

describe('QRCode live smoke', function () {
  let client: wppconnect.Whatsapp = null;
  const originalLogLevel = wppconnect.defaultLogger.level;

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
      logQR: false,
      updatesLog: false,
      disableWelcome: true,
    });

    await client.waitForPageLoad();
  });

  after(async function () {
    try {
      if (client) await client.close();
    } finally {
      wppconnect.defaultLogger.level = originalLogLevel;
    }
  });

  it('Get QRCode', async function () {
    const result = await client.getQrCode();
    assert.ok(result);
    assert.ok(result.urlCode);
    assert.ok(result.base64Image);
  });
});

type QrSnapshot = { urlCode: string; base64Image: string };

class QrPage {
  reads = 0;
  on() {
    return this;
  }
  isClosed() {
    return false;
  }
  async evaluate() {
    this.reads++;
    return false;
  } // Not registered, so QR pairing is required.
}

class QrHost extends HostLayer {
  reads = 0;
  constructor(
    page: QrPage,
    private snapshots: Array<QrSnapshot | Error | Promise<QrSnapshot>>
  ) {
    super(page as unknown as Page, 'qr-contract', { logQR: false });
  }
  protected log() {}
  async getQrCode() {
    this.reads++;
    const value = this.snapshots.shift();
    if (value instanceof Error) throw value;
    return await value;
  }
  async checkOnce() {
    return this.checkQrCode();
  }
}

describe('QRCode callback contract', function () {
  const first = { urlCode: 'first-code', base64Image: 'first-image' };
  const second = { urlCode: 'second-code', base64Image: 'second-image' };

  it('deduplicates snapshots and counts only new nonempty codes', async function () {
    const host = new QrHost(new QrPage(), [
      first,
      first,
      { urlCode: '', base64Image: '' },
      second,
    ]);
    const events: any[][] = [];
    host.catchQR = (...args) => events.push(args);
    for (let i = 0; i < 4; i++) await host.checkOnce();
    assert.deepStrictEqual(
      events.map(([image, , attempt, code]) => ({ image, attempt, code })),
      [
        { image: first.base64Image, attempt: 1, code: first.urlCode },
        { image: second.base64Image, attempt: 2, code: second.urlCode },
      ]
    );
    assert.ok(
      events.every(
        (event) => typeof event[1] === 'string' && event[1].length > 0
      )
    );
  });

  it('cancels before any page or QR lookup', async function () {
    const page = new QrPage();
    const host = new QrHost(page, [first]);
    host.cancelQrLoop();
    await host.checkOnce();
    assert.strictEqual(page.reads, 0);
    assert.strictEqual(host.reads, 0);
  });

  it('suppresses a QR result that arrives after cancellation', async function () {
    let resolveQr: (value: QrSnapshot) => void;
    const pending = new Promise<QrSnapshot>((resolve) => {
      resolveQr = resolve;
    });
    const host = new QrHost(new QrPage(), [pending]);
    let callbacks = 0;
    host.catchQR = () => callbacks++;
    const checking = host.checkOnce();
    await new Promise(setImmediate);
    assert.strictEqual(host.reads, 1);
    host.cancelQrLoop();
    resolveQr(first);
    await checking;
    assert.strictEqual(callbacks, 0);
  });

  it('propagates QR lookup errors without publishing a callback', async function () {
    const error = new Error('QR lookup context destroyed');
    const host = new QrHost(new QrPage(), [error]);
    let callbacks = 0;
    host.catchQR = () => callbacks++;
    await assert.rejects(host.checkOnce(), (value) => value === error);
    assert.strictEqual(callbacks, 0);
  });
});
