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
import * as assert from 'assert';
import { Page } from 'puppeteer';

import { HostLayer } from '../api/layers/host.layer';
import { injectApi } from '../controllers/browser';

class FakePage {
  evaluateCalls = 0;
  private listeners = new Map<string, Array<() => void>>();

  on(event: string, listener: () => void) {
    const listeners = this.listeners.get(event) || [];
    listeners.push(listener);
    this.listeners.set(event, listeners);
    return this;
  }

  emit(event: string) {
    for (const listener of this.listeners.get(event) || []) {
      listener();
    }
  }

  async evaluate() {
    this.evaluateCalls += 1;
    return true;
  }

  isClosed() {
    return false;
  }

  async waitForFunction() {
    return true;
  }
}

class DelayedInjectionHostLayer extends HostLayer {
  private completeInjection?: () => void;

  protected log() {}

  protected async afterPageLoad() {
    await new Promise<void>((resolve) => {
      this.completeInjection = resolve;
    });
    this.isInjected = true;
  }

  finishInjection() {
    this.completeInjection?.();
  }
}

describe('HostLayer page reinjection', function () {
  it('waits for the current page injection before evaluating WAPI', async function () {
    const page = new FakePage();
    const client = new DelayedInjectionHostLayer(
      page as unknown as Page,
      'reinjection-test'
    );

    page.emit('load');
    const connected = client.isConnected();
    await Promise.resolve();

    assert.strictEqual(page.evaluateCalls, 0);

    client.finishInjection();
    assert.strictEqual(await connected, true);
    assert.strictEqual(page.evaluateCalls, 1);
  });

  it('propagates a WAPI readiness timeout instead of marking injection complete', async function () {
    const page = {
      evaluate: async () => false,
      addScriptTag: async () => undefined,
      exposeFunction: async () => undefined,
      waitForFunction: async () => {
        throw new Error('WAPI readiness timeout');
      },
    };

    await assert.rejects(
      injectApi(page as unknown as Page),
      /WAPI readiness timeout/
    );
  });
});

class AuthenticationPage extends FakePage {
  constructor(private results: Array<boolean | Error>) {
    super();
  }

  async evaluate() {
    this.evaluateCalls += 1;
    const result = this.results.shift();
    if (result instanceof Error) throw result;
    return result ?? false;
  }
}

class AuthenticationHostLayer extends HostLayer {
  protected log() {}

  begin(logged = false) {
    this.isStarted = true;
    this.isLogged = logged;
  }

  get logged() {
    return this.isLogged;
  }

  readQr() {
    return this.checkQrCode();
  }
}

describe('HostLayer authentication during navigation', function () {
  this.timeout(5000);

  it('keeps waiting for registration after a destroyed execution context', async function () {
    const page = new AuthenticationPage([
      new Error(
        'Execution context was destroyed, most likely because of a navigation.'
      ),
      false,
      true,
    ]);
    const client = new AuthenticationHostLayer(
      page as unknown as Page,
      'navigation'
    );
    client.begin();

    await client.waitForQrCodeScan();

    assert.strictEqual(page.evaluateCalls, 3);
    assert.strictEqual(client.logged, true);
  });

  it('does not mark a QR session authenticated when a QR callback races navigation', async function () {
    const page = new AuthenticationPage([
      new Error('Execution context was destroyed'),
    ]);
    const client = new AuthenticationHostLayer(
      page as unknown as Page,
      'qr-callback'
    );
    client.begin();

    await client.readQr();

    assert.strictEqual(client.logged, false);
  });

  it('waits for the resolved chat readiness value', async function () {
    const page = new AuthenticationPage([false, true]);
    const client = new AuthenticationHostLayer(
      page as unknown as Page,
      'chat-ready'
    );
    client.begin(true);

    assert.strictEqual(await client.waitForInChat(), true);
    assert.strictEqual(page.evaluateCalls, 2);
  });
});

class SlowReadyPage extends FakePage {
  // Mirrors page.setDefaultTimeout(): applies when no timeout is passed
  defaultTimeout = 30;
  scriptTags = 0;
  private document = 0;
  private injected?: { document: number; at: number };

  constructor(private readyDelay: number) {
    super();
  }

  reload() {
    this.document += 1;
    this.emit('load');
  }

  async evaluate(fn?: unknown) {
    this.evaluateCalls += 1;
    // Fresh document: wa-js is not there yet
    return !String(fn).includes('typeof window.WAPI');
  }

  async addScriptTag() {
    this.scriptTags += 1;
    this.injected = { document: this.document, at: Date.now() };
  }

  async exposeFunction() {}

  private isReady() {
    return (
      this.injected?.document === this.document &&
      Date.now() - this.injected.at >= this.readyDelay
    );
  }

  async waitForFunction(
    fn?: unknown,
    options: { timeout?: number; signal?: AbortSignal } = {}
  ) {
    if (!String(fn).includes('isReady')) return true;

    const timeout = options.timeout ?? this.defaultTimeout;
    // Like puppeteer, keeps polling across navigations until ready, timeout or abort
    return new Promise<boolean>((resolve, reject) => {
      const done = (fn: () => void) => {
        clearInterval(poll);
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', onAbort);
        fn();
      };
      const onAbort = () => done(() => reject(options.signal.reason));
      const poll = setInterval(() => {
        if (this.isReady()) done(() => resolve(true));
      }, 5);
      const timer =
        timeout > 0
          ? setTimeout(() => {
              const error = new Error(`Waiting failed: ${timeout}ms exceeded`);
              error.name = 'TimeoutError';
              done(() => reject(error));
            }, timeout)
          : undefined;
      options.signal?.addEventListener('abort', onAbort);
    });
  }
}

class SlowReadyHostLayer extends HostLayer {
  // Not a field initializer: the base constructor already logs
  declare logs: string[];

  protected log(level: string, message: unknown) {
    (this.logs ??= []).push(String(message));
  }

  begin() {
    this.isStarted = true;
    this.isLogged = true;
  }
}

describe('HostLayer slow WhatsApp Web initialization', function () {
  this.timeout(5000);

  let unhandled: unknown[];
  const onUnhandled = (reason: unknown) => unhandled.push(reason);

  beforeEach(function () {
    unhandled = [];
    process.on('unhandledRejection', onUnhandled);
  });

  afterEach(async function () {
    // Let pending rejections surface before checking
    await new Promise((resolve) => setTimeout(resolve, 20));
    process.off('unhandledRejection', onUnhandled);
    assert.deepStrictEqual(unhandled, []);
  });

  function createClient(page: SlowReadyPage, options = {}) {
    const client = new SlowReadyHostLayer(page as unknown as Page, 'slow', {
      autoClose: 0,
      deviceSyncTimeout: 0,
      ...options,
    });
    client.begin();
    return client;
  }

  it('keeps waiting past the default timeout and reaches login', async function () {
    const page = new SlowReadyPage(120);
    const client = createClient(page);

    page.emit('load');

    assert.strictEqual(await client.waitForLogin(), true);
    assert.ok(client.logs.includes('wapi.js injected'));
    assert.ok(client.logs.includes('Checking is logged...'));
    assert.ok(!client.logs.includes('wapi.js failed'));
  });

  it('fails once, naming the stage, when injectionTimeout is exceeded', async function () {
    const page = new SlowReadyPage(Infinity);
    const client = createClient(page, { injectionTimeout: 40 });

    page.emit('load');

    await assert.rejects(
      client.waitForLogin(),
      /WPP\.isReady not reached after 40ms/
    );
  });

  it('reinjects after a reload instead of waiting on the stale injection', async function () {
    const page = new SlowReadyPage(50);
    const client = createClient(page);

    page.emit('load');
    await new Promise((resolve) => setTimeout(resolve, 20));
    page.reload();

    await client.waitForPageLoad();

    assert.strictEqual(page.scriptTags, 4);
    assert.ok(
      client.logs.includes('wapi.js injection superseded by page reload')
    );
    assert.ok(client.logs.includes('wapi.js injected'));
  });
});
