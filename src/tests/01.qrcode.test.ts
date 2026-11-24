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
import { initWhatsapp } from '../controllers/browser';

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

class AuthCodePage {
  reads = 0;
  constructor(private answers: unknown[]) {}
  on() {
    return this;
  }
  isClosed() {
    return false;
  }
  async evaluate() {
    this.reads++;
    const answer = this.answers.shift();
    if (answer instanceof Error) throw answer;
    return answer;
  }
}

describe('QRCode from the wa-js auth code', function () {
  const getQrCode = (page: AuthCodePage) =>
    new HostLayer(page as unknown as Page, 'qr-auth-code', {
      logQR: false,
    }).getQrCode();
  const fullCode = 'https://wa.me/settings/linked_devices#2@ref,a,b,c,1';

  it('builds the image from the exact code of the WhatsApp QR', async function () {
    // No reload button, then WPP.conn.getAuthCode().fullCode
    const result = await getQrCode(new AuthCodePage([false, fullCode]));
    assert.strictEqual(result.urlCode, fullCode);
    assert.match(result.base64Image, /^data:image\/png;base64,.{100,}/);
  });

  it('reloads an expired code and leaves the next one to auth_code_change', async function () {
    const page = new AuthCodePage([true]);
    assert.strictEqual(await getQrCode(page), undefined);
    assert.strictEqual(page.reads, 1);
  });

  it('returns nothing while WhatsApp has no code', async function () {
    assert.strictEqual(
      await getQrCode(new AuthCodePage([false, undefined])),
      undefined
    );
    assert.strictEqual(
      await getQrCode(new AuthCodePage([false, new Error('WPP not ready')])),
      undefined
    );
  });
});

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

describe('initWhatsapp page visibility', function () {
  const fakePage = (bringToFront: () => Promise<void>) => {
    const calls: string[] = [];
    const record = (name: string) => async () => void calls.push(name);
    return {
      calls,
      setUserAgent: record('setUserAgent'),
      evaluateOnNewDocument: record('evaluateOnNewDocument'),
      goto: record('goto'),
      bringToFront: async () => {
        calls.push('bringToFront');
        await bringToFront();
      },
    };
  };

  it('brings the session page to front before loading WhatsApp', async function () {
    const page = fakePage(async () => undefined);
    await initWhatsapp(page as unknown as Page, null, false);
    assert.deepStrictEqual(page.calls.slice(-2), ['bringToFront', 'goto']);
  });

  it('still loads WhatsApp when the page cannot be brought to front', async function () {
    const page = fakePage(async () => {
      throw new Error('Target closed');
    });
    await initWhatsapp(page as unknown as Page, null, false);
    assert.strictEqual(page.calls[page.calls.length - 1], 'goto');
  });
});
