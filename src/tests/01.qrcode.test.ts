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
import { runInNewContext } from 'vm';
import { Page } from 'puppeteer';
import { HostLayer } from '../api/layers/host.layer';
import { hasNewQrCode, waitForNewQrCode } from '../api/helpers/scrape-img-qr';
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
  steps: string[] = [];
  constructor(
    page: QrPage,
    private snapshots: Array<QrSnapshot | Error | Promise<QrSnapshot>>
  ) {
    super(page as unknown as Page, 'qr-contract', { logQR: false });
  }
  protected log() {}
  protected async waitForQrCodePaint() {
    this.steps.push(`wait:${this.urlCode}`);
  }
  async getQrCode() {
    this.reads++;
    this.steps.push('read');
    const value = this.snapshots.shift();
    if (value instanceof Error) throw value;
    return await value;
  }
  async checkOnce() {
    return this.checkQrCode();
  }
}

describe('QRCode render check', function () {
  const canvasIn = (code: string | null, reloadButton = false) => ({
    closest: () => ({
      getAttribute: () => code,
      querySelector: () => (reloadButton ? {} : null),
    }),
  });
  const check = (canvas: unknown, previous: string) =>
    runInNewContext(`(${hasNewQrCode.toString()})(previous)`, {
      document: { querySelector: () => canvas },
      previous,
    });

  it('waits while there is no canvas or it still shows the previous code', function () {
    assert.strictEqual(check(null, ''), false);
    assert.strictEqual(check(canvasIn(null), ''), false);
    assert.strictEqual(check(canvasIn('first-code'), 'first-code'), false);
  });

  it('accepts a new code or the reload button', function () {
    assert.strictEqual(check(canvasIn('first-code'), ''), true);
    assert.strictEqual(check(canvasIn('second-code'), 'first-code'), true);
    assert.strictEqual(check(canvasIn('first-code', true), 'first-code'), true);
  });

  const pollingPage = (answers: Array<boolean | Error>) => {
    const page = {
      calls: [] as unknown[],
      isClosed: () => false,
      evaluate: async (_fn: unknown, previous: unknown) => {
        page.calls.push(previous);
        const answer = answers.length > 1 ? answers.shift() : answers[0];
        if (answer instanceof Error) throw answer;
        return answer;
      },
    };
    return page;
  };

  it('polls from Node until the page reports a new code', async function () {
    const page = pollingPage([false, false, true]);
    await waitForNewQrCode(page as unknown as Page, 'first-code');
    assert.deepStrictEqual(page.calls, [
      'first-code',
      'first-code',
      'first-code',
    ]);
  });

  it('stops waiting when the page cannot be evaluated', async function () {
    const page = pollingPage([new Error('Execution context was destroyed')]);
    await waitForNewQrCode(page as unknown as Page, '');
    assert.strictEqual(page.calls.length, 1);
  });

  it('gives up after the timeout', async function () {
    const page = pollingPage([false]);
    const started = Date.now();
    await waitForNewQrCode(page as unknown as Page, '', 600);
    assert.ok(Date.now() - started < 1500);
    assert.ok(page.calls.length >= 2);
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

  it('waits for a newer painted code before each read', async function () {
    const host = new QrHost(new QrPage(), [first, second]);
    host.catchQR = () => undefined;
    await host.checkOnce();
    await host.checkOnce();
    assert.deepStrictEqual(host.steps, [
      'wait:',
      'read',
      `wait:${first.urlCode}`,
      'read',
    ]);
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
