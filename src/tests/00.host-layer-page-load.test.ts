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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type FakeWindow = {
  WPP?: { isReady: boolean };
  WAPI?: object;
  Store?: object;
};

function runInWindow(fn: unknown, window: FakeWindow) {
  return new Function('window', `return (${String(fn)})();`)(window);
}

class SlowReadyPage extends FakePage {
  // Mirrors page.setDefaultTimeout(): applies when no timeout is passed
  defaultTimeout = 30;
  scriptTags = 0;
  closed = false;
  window: FakeWindow = {};
  onExposeFunction?: () => void;
  stepDelay = 0;
  beforeEvaluate?: () => void;
  private cleanups = new Set<() => void>();

  constructor(private readyDelay: number) {
    super();
  }

  reload() {
    this.window = {};
    this.emit('load');
  }

  close() {
    this.closed = true;
    for (const cleanup of this.cleanups) cleanup();
  }

  isClosed() {
    return this.closed;
  }

  async evaluate(fn?: unknown) {
    this.evaluateCalls += 1;
    this.beforeEvaluate?.();
    return String(fn).includes('typeof window.WAPI')
      ? runInWindow(fn, this.window)
      : true;
  }

  async addScriptTag() {
    this.scriptTags += 1;
    const window = this.window;

    if (window.WPP) {
      window.WAPI = {};
      window.Store = {};
      return;
    }

    window.WPP = { isReady: false };
    if (Number.isFinite(this.readyDelay)) {
      const timer = setTimeout(() => {
        window.WPP.isReady = true;
      }, this.readyDelay);
      this.cleanups.add(() => clearTimeout(timer));
    }
  }

  async exposeFunction() {
    this.onExposeFunction?.();
    await delay(this.stepDelay);
  }

  async waitForFunction(
    fn?: unknown,
    options: { timeout?: number; signal?: AbortSignal } = {}
  ) {
    if (!String(fn).includes('isReady')) return true;

    const timeout = options.timeout ?? this.defaultTimeout;
    // Like puppeteer: polls whatever document is current, only listens for a
    // later abort, and rejects when the page closes
    return new Promise<boolean>((resolve, reject) => {
      const done = (settle: () => void) => {
        clearInterval(poll);
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', onAbort);
        this.cleanups.delete(onClose);
        settle();
      };
      const onAbort = () => done(() => reject(options.signal.reason));
      const onClose = () => done(() => reject(new Error('Waiting failed')));
      const poll = setInterval(() => {
        if (runInWindow(fn, this.window)) done(() => resolve(true));
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
      this.cleanups.add(onClose);
    });
  }
}

class SlowReadyHostLayer extends HostLayer {
  // Not a field initializer: the base constructor already logs
  declare logs: string[];
  failAfterInjection = false;

  protected log(level: string, message: unknown) {
    (this.logs ??= []).push(String(message));
  }

  protected async afterPageScriptInjected() {
    if (this.failAfterInjection) {
      throw new Error('afterPageScriptInjected failed');
    }
    return super.afterPageScriptInjected();
  }

  begin() {
    this.isStarted = true;
    this.isLogged = true;
  }
}

describe('HostLayer slow WhatsApp Web initialization', function () {
  this.timeout(5000);

  let unhandled: unknown[];
  let pages: SlowReadyPage[];
  const onUnhandled = (reason: unknown) => unhandled.push(reason);

  beforeEach(function () {
    unhandled = [];
    pages = [];
    process.on('unhandledRejection', onUnhandled);
  });

  afterEach(async function () {
    // Settle pending waits so a failing test cannot keep mocha alive
    pages.forEach((page) => page.close());
    await delay(20);
    process.off('unhandledRejection', onUnhandled);
    assert.deepStrictEqual(unhandled, []);
  });

  function createClient(readyDelay: number, options = {}) {
    const page = new SlowReadyPage(readyDelay);
    pages.push(page);
    const client = new SlowReadyHostLayer(page as unknown as Page, 'slow', {
      autoClose: 0,
      deviceSyncTimeout: 0,
      ...options,
    });
    client.begin();
    return { page, client };
  }

  it('keeps waiting past the default timeout and reaches login', async function () {
    const { page, client } = createClient(120);

    page.emit('load');

    assert.strictEqual(await client.waitForLogin(), true);
    assert.ok(client.logs.includes('wapi.js injected'));
    assert.ok(client.logs.includes('Checking is logged...'));
    assert.ok(!client.logs.includes('wapi.js failed'));
  });

  it('fails once, naming the stage, when injectionTimeout is exceeded', async function () {
    const { page, client } = createClient(Infinity, { injectionTimeout: 40 });

    page.emit('load');

    await assert.rejects(
      client.waitForLogin(),
      /WPP\.isReady not reached after 40ms/
    );
    assert.strictEqual(
      client.logs.filter((log) => log === 'wapi.js failed').length,
      1
    );
  });

  it('reinjects after a reload during the readiness wait', async function () {
    const { page, client } = createClient(50);

    page.emit('load');
    await delay(20);
    page.reload();

    await client.waitForPageLoad();

    assert.strictEqual(page.scriptTags, 4);
    assert.ok(
      client.logs.includes('wapi.js injection superseded by page reload')
    );
    assert.ok(client.logs.includes('wapi.js injected'));
  });

  it('reinjects after a reload before the readiness wait starts', async function () {
    const { page, client } = createClient(50);
    let reloaded = false;
    page.onExposeFunction = () => {
      if (reloaded) return;
      reloaded = true;
      page.reload();
    };

    page.emit('load');
    await client.waitForPageLoad();

    assert.ok(
      client.logs.includes('wapi.js injection superseded by page reload')
    );
    assert.ok(client.logs.includes('wapi.js injected'));
  });

  it('waits for the next load when navigation breaks injection first', async function () {
    const { page, client } = createClient(50);
    let navigated = false;
    page.beforeEvaluate = () => {
      if (navigated) return;
      navigated = true;
      // The new document's 'load' arrives after the step already failed
      setTimeout(() => page.reload(), 30);
      throw new Error(
        'Execution context was destroyed, most likely because of a navigation.'
      );
    };

    page.emit('load');
    await client.waitForPageLoad();

    assert.ok(!client.logs.includes('wapi.js failed'));
    assert.ok(client.logs.includes('wapi.js injected'));
  });

  it('does not restart the budget on every reload', async function () {
    const { page, client } = createClient(100, { injectionTimeout: 150 });
    const reloads = setInterval(() => page.reload(), 60);

    page.emit('load');
    try {
      await assert.rejects(
        client.waitForPageLoad(),
        /WPP\.isReady not reached after 150ms/
      );
    } finally {
      clearInterval(reloads);
    }
  });

  it('does not let a stuck injection step stretch the budget', async function () {
    const { page, client } = createClient(Infinity, { injectionTimeout: 80 });
    page.stepDelay = 500;
    const startedAt = Date.now();

    page.emit('load');
    await assert.rejects(
      client.waitForPageLoad(),
      /WPP\.isReady not reached after 80ms/
    );
    assert.ok(Date.now() - startedAt < 120);
  });

  it('gives a later page load a fresh budget after a successful injection', async function () {
    const { page, client } = createClient(60, { injectionTimeout: 100 });

    page.emit('load');
    await client.waitForPageLoad();
    await delay(80);
    page.reload();

    await client.waitForPageLoad();
    assert.ok(!client.logs.includes('wapi.js failed'));
  });

  it('logs a failure after injection instead of leaking it', async function () {
    const { page, client } = createClient(10);
    client.failAfterInjection = true;

    page.emit('load');
    await client.waitForPageLoad();
    await delay(10);

    assert.ok(
      client.logs.some((log) => log.includes('afterPageScriptInjected failed'))
    );
  });
});
