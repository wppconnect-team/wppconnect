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
import {
  InjectionTimeoutError,
  injectApi,
  waitForWppReady,
} from '../controllers/browser';

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
  WPPConfig?: object;
};

function runInWindow(fn: unknown, window: FakeWindow) {
  return new Function('window', `return (${String(fn)})();`)(window);
}

class FakeSession {
  private listeners = new Map<string, Array<(event: any) => void>>();

  async send(method: string) {
    if (method === 'Page.getFrameTree')
      return { frameTree: { frame: { id: 'main' } } };
  }

  on(event: string, listener: (event: any) => void) {
    this.listeners.set(event, [...(this.listeners.get(event) || []), listener]);
  }

  emit(event: string, payload: unknown) {
    for (const listener of this.listeners.get(event) || []) listener(payload);
  }
}

class SlowReadyPage extends FakePage {
  // Mirrors page.setDefaultTimeout(): applies when no timeout is passed
  defaultTimeout = 30;
  scriptTags = 0;
  closed = false;
  window: FakeWindow = {};
  session = new FakeSession();
  stepDelay = 0;
  withoutCDPSession = false;
  onExposeFunction?: () => void;
  beforeStep?: () => void;
  afterStep?: () => void;
  stepsOn = new Map<FakeWindow, number>();
  private cleanups = new Set<() => void>();

  constructor(public readyDelay: number) {
    super();
  }

  async createCDPSession() {
    if (this.withoutCDPSession) throw new Error('CDP not available');
    return this.session;
  }

  private navigating = false;

  // Like Chrome: steps in flight fail once navigation starts, the new document
  // commits later, and its 'load' fires well after that
  startNavigation() {
    this.navigating = true;
    this.session.emit('Page.frameStartedNavigating', {
      frameId: 'main',
      navigationType: 'reload',
    });
  }

  navigate() {
    this.startNavigation();
    this.navigating = false;
    this.window = {};
    this.session.emit('Page.frameNavigated', { frame: { id: 'main' } });
  }

  reload(loadDelay = 0) {
    this.navigate();
    this.later(() => this.emit('load'), loadDelay);
  }

  later(run: () => void, ms: number) {
    if (ms === 0) return run();
    const timer = setTimeout(run, ms);
    this.cleanups.add(() => clearTimeout(timer));
  }

  close() {
    this.closed = true;
    for (const cleanup of this.cleanups) cleanup();
  }

  isClosed() {
    return this.closed;
  }

  // In-flight steps fail when the document is replaced under them
  private async step<T>(message: string, run: (window: FakeWindow) => T) {
    this.beforeStep?.();
    const window = this.window;
    if (this.stepDelay) await delay(this.stepDelay);
    if (window !== this.window || this.navigating) throw new Error(message);
    this.stepsOn.set(window, (this.stepsOn.get(window) || 0) + 1);
    const result = run(window);
    this.afterStep?.();
    return result;
  }

  async evaluate(fn?: unknown, arg?: object) {
    this.evaluateCalls += 1;
    return this.step('Execution context was destroyed', (window) => {
      const source = String(fn);
      if (source.includes('WPPConfig')) window.WPPConfig = arg;
      return source.includes('typeof window.WAPI')
        ? runInWindow(fn, window)
        : true;
    });
  }

  async addScriptTag() {
    return this.step(
      'Protocol error (DOM.resolveNode): Node with given id does not belong to the document',
      (window) => {
        this.scriptTags += 1;
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
    );
  }

  async exposeFunction() {
    this.onExposeFunction?.();
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

  async function createClient(
    readyDelay: number,
    options = {},
    setup?: (page: SlowReadyPage) => void
  ) {
    const page = new SlowReadyPage(readyDelay);
    setup?.(page);
    pages.push(page);
    const client = new SlowReadyHostLayer(page as unknown as Page, 'slow', {
      autoClose: 0,
      deviceSyncTimeout: 0,
      ...options,
    });
    client.begin();
    await delay(0);
    return { page, client };
  }

  it('keeps waiting past the default timeout and reaches login', async function () {
    const { page, client } = await createClient(120);

    page.emit('load');

    assert.strictEqual(await client.waitForLogin(), true);
    assert.ok(client.logs.includes('wapi.js injected'));
    assert.ok(client.logs.includes('Checking is logged...'));
    assert.ok(!client.logs.includes('wapi.js failed'));
  });

  it('waits without limit when injectionTimeout is 0', async function () {
    const { page, client } = await createClient(120, { injectionTimeout: 0 });

    page.emit('load');

    await client.waitForPageLoad();
    assert.ok(client.logs.includes('wapi.js injected'));
  });

  it('sets WPPConfig before injecting wa-js', async function () {
    const { page, client } = await createClient(10, { poweredBy: 'test' });
    let configAtInjection: object | undefined;
    page.beforeStep = () => {
      if (page.scriptTags === 0) configAtInjection = page.window.WPPConfig;
    };

    page.emit('load');
    await client.waitForPageLoad();

    assert.strictEqual(configAtInjection?.['poweredBy'], 'test');
  });

  it('fails once, naming the stage, when injectionTimeout is exceeded', async function () {
    const { page, client } = await createClient(Infinity, {
      injectionTimeout: 40,
    });

    page.emit('load');

    await assert.rejects(client.waitForLogin(), (error: Error) => {
      return (
        error instanceof InjectionTimeoutError &&
        error.message === 'WPP.isReady not reached after 40ms'
      );
    });
    assert.strictEqual(
      client.logs.filter((log) => log === 'wapi.js failed').length,
      1
    );
  });

  it('fails fast on an injection error without a navigation', async function () {
    const { page, client } = await createClient(10);
    page.beforeStep = () => {
      throw new ReferenceError('WPP is not defined');
    };
    const startedAt = Date.now();

    page.emit('load');

    await assert.rejects(client.waitForPageLoad(), /WPP is not defined/);
    assert.ok(Date.now() - startedAt < 1000);
  });

  it('reinjects after a reload during the readiness wait', async function () {
    const { page, client } = await createClient(50);

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
    const { page, client } = await createClient(50);
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

  it('treats step errors after a document change as superseded', async function () {
    const { page, client } = await createClient(30);
    page.stepDelay = 20;
    let reloaded = false;
    page.beforeStep = () => {
      if (reloaded || page.scriptTags !== 1) return;
      reloaded = true;
      // The step fails ~20ms after the commit, long before 'load'
      page.reload(150);
    };

    page.emit('load');
    await client.waitForPageLoad();

    assert.ok(!client.logs.includes('wapi.js failed'));
    assert.ok(client.logs.includes('wapi.js injected'));
  });

  it('treats step errors after a navigation starts as superseded', async function () {
    const { page, client } = await createClient(30);
    page.stepDelay = 20;
    page.beforeStep = () => {
      if (page.scriptTags !== 1) return;
      page.beforeStep = undefined;
      // The step fails right away; the commit and 'load' come later
      page.startNavigation();
      page.later(() => page.reload(100), 80);
    };

    page.emit('load');
    await client.waitForPageLoad();

    assert.ok(!client.logs.includes('wapi.js failed'));
    assert.ok(
      client.logs.includes('wapi.js injection superseded by page reload')
    );
  });

  it('fails within budget when a started navigation never commits', async function () {
    const { page, client } = await createClient(30, { injectionTimeout: 100 });
    page.stepDelay = 20;
    page.beforeStep = () => {
      page.beforeStep = undefined;
      page.startNavigation();
    };

    page.emit('load');

    await assert.rejects(client.waitForPageLoad(), (error: Error) => {
      return (
        error instanceof InjectionTimeoutError &&
        /Execution context was destroyed/.test(String(error.cause))
      );
    });
  });

  for (const [kind, event] of [
    [
      'same-document',
      { frameId: 'main', navigationType: 'historySameDocument' },
    ],
    ['child frame', { frameId: 'child', navigationType: 'differentDocument' }],
  ] as const) {
    it(`does not wait on ${kind} navigations`, async function () {
      const { page, client } = await createClient(30);
      page.beforeStep = () => {
        page.session.emit('Page.frameStartedNavigating', event);
        throw new Error('boom');
      };
      const startedAt = Date.now();

      page.emit('load');

      await assert.rejects(client.waitForPageLoad(), /boom/);
      assert.ok(Date.now() - startedAt < 1000);
    });
  }

  it('stops a superseded injection from writing into the new document', async function () {
    const { page, client } = await createClient(30);
    page.stepDelay = 10;
    const reloaded = new Promise<void>((resolve) => {
      page.beforeStep = () => {
        if (page.scriptTags !== 1) return;
        page.beforeStep = undefined;
        page.reload(100);
        resolve();
      };
    });

    page.emit('load');
    await reloaded;
    await delay(60);

    // Before the new 'load', nothing from the old injection reached it
    assert.deepStrictEqual(page.window, {});
    await client.waitForPageLoad();
    assert.ok(client.logs.includes('wapi.js injected'));
  });

  for (const [step, scriptTags] of [
    ['wa-js', 1],
    ['wapi.js', 2],
  ] as const) {
    it(`runs no step on the new document after a commit following ${step}`, async function () {
      const { page, client } = await createClient(30);
      let committed: FakeWindow | undefined;
      page.afterStep = () => {
        if (committed || page.scriptTags !== scriptTags) return;
        page.reload(100);
        committed = page.window;
      };

      page.emit('load');
      await delay(60);

      assert.ok(committed);
      assert.strictEqual(page.stepsOn.get(committed) ?? 0, 0);
      await client.waitForPageLoad();
    });
  }

  it('waits again after the document changes until its load', async function () {
    const { page, client } = await createClient(10);

    page.emit('load');
    await client.waitForPageLoad();
    page.navigate();
    let settled = false;
    const waiting = client.waitForPageLoad().then(() => (settled = true));
    await delay(30);

    assert.strictEqual(settled, false);
    page.emit('load');
    await waiting;
  });

  it('does not mark a document injected when it changes as injection ends', async function () {
    const { page, client } = await createClient(10);
    const waitForFunction = page.waitForFunction.bind(page);
    let navigated = false;
    page.waitForFunction = async (fn, options) => {
      const result = await waitForFunction(fn, options);
      if (!navigated && String(fn).includes('isReady')) {
        navigated = true;
        page.navigate();
      }
      return result;
    };

    page.emit('load');
    await delay(60);

    assert.ok(navigated);
    assert.ok(!client.logs.includes('wapi.js injected'));
    page.emit('load');
    await client.waitForPageLoad();
  });

  it('falls back to the load event without a CDP session', async function () {
    const { page, client } = await createClient(50, {}, (page) => {
      page.withoutCDPSession = true;
    });

    page.emit('load');
    await delay(20);
    page.window = {};
    page.emit('load');
    await client.waitForPageLoad();

    assert.ok(client.logs.includes('Could not watch document changes'));
    assert.ok(
      client.logs.includes('wapi.js injection superseded by page reload')
    );
  });

  it('rejects injectApi with an aborted signal before any step', async function () {
    const page = new SlowReadyPage(10);
    pages.push(page);
    const controller = new AbortController();
    controller.abort();

    await assert.rejects(
      injectApi(page as unknown as Page, undefined, {
        signal: controller.signal,
      }),
      { name: 'AbortError' }
    );
    assert.strictEqual(page.scriptTags, 0);
  });

  it('names the stage when waitForWppReady times out on its own', async function () {
    const page = new SlowReadyPage(Infinity);
    pages.push(page);

    await assert.rejects(
      waitForWppReady(page as unknown as Page, { timeout: 30 }),
      (error: Error) =>
        error instanceof InjectionTimeoutError &&
        error.message === 'WPP.isReady not reached after 30ms'
    );
  });

  it('injects wa-js into a document that only has WAPI and Store', async function () {
    const { page, client } = await createClient(10);
    page.window = { WAPI: {}, Store: {} };

    page.emit('load');
    await client.waitForPageLoad();

    assert.strictEqual(page.scriptTags, 2);
  });

  it('skips injection when wa-js and WAPI are already there', async function () {
    const { page, client } = await createClient(10);
    page.window = { WPP: { isReady: true }, WAPI: {}, Store: {} };

    page.emit('load');
    await client.waitForPageLoad();

    assert.strictEqual(page.scriptTags, 0);
  });

  it('ignores navigations of child frames', async function () {
    const { page, client } = await createClient(30);

    page.emit('load');
    await delay(10);
    page.session.emit('Page.frameNavigated', {
      frame: { id: 'child', parentId: 'main' },
    });
    await client.waitForPageLoad();

    assert.ok(
      !client.logs.includes('wapi.js injection superseded by page reload')
    );
  });

  it('fails within budget when a navigation never reaches load', async function () {
    const { page, client } = await createClient(Infinity, {
      injectionTimeout: 100,
    });

    page.emit('load');
    await delay(10);
    page.navigate();

    await assert.rejects(client.waitForPageLoad(), InjectionTimeoutError);
  });

  it('does not restart the budget on every reload', async function () {
    const { page, client } = await createClient(100, {
      injectionTimeout: 150,
    });
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
    const { page, client } = await createClient(Infinity, {
      injectionTimeout: 100,
    });
    page.stepDelay = 1000;
    const startedAt = Date.now();

    page.emit('load');
    await assert.rejects(
      client.waitForPageLoad(),
      /WPP\.isReady not reached after 100ms/
    );
    assert.ok(Date.now() - startedAt < 400);
  });

  it('aborts the remaining steps when injectApi runs out of time', async function () {
    const page = new SlowReadyPage(Infinity);
    pages.push(page);
    page.stepDelay = 60;

    await assert.rejects(
      injectApi(page as unknown as Page, undefined, { timeout: 40 }),
      InjectionTimeoutError
    );
    const scriptTags = page.scriptTags;
    await delay(200);

    assert.strictEqual(page.scriptTags, scriptTags);
  });

  it('retries when puppeteer gives up waiting for an execution context', async function () {
    const { page, client } = await createClient(30);
    const waitForFunction = page.waitForFunction.bind(page);
    let failed = false;
    page.waitForFunction = async (fn, options) => {
      if (!failed && String(fn).includes('isReady')) {
        failed = true;
        const cause = new Error('Waiting for context');
        cause.name = 'TimeoutError';
        throw new Error('Waiting failed', { cause });
      }
      return waitForFunction(fn, options);
    };

    page.emit('load');
    await client.waitForPageLoad();

    assert.ok(failed);
    assert.ok(client.logs.includes('wapi.js injected'));
  });

  it('gives a later page load a fresh budget after a successful injection', async function () {
    const { page, client } = await createClient(30, { injectionTimeout: 150 });

    page.emit('load');
    await client.waitForPageLoad();
    await delay(160);
    page.reload();

    await client.waitForPageLoad();
    assert.ok(!client.logs.includes('wapi.js failed'));
  });

  it('gives a later page load a fresh budget after a failed injection', async function () {
    const { page, client } = await createClient(Infinity, {
      injectionTimeout: 60,
    });

    page.emit('load');
    await assert.rejects(client.waitForPageLoad(), InjectionTimeoutError);
    await delay(80);
    page.readyDelay = 10;
    page.reload();

    await client.waitForPageLoad();
    assert.ok(client.logs.includes('wapi.js injected'));
  });

  it('logs failures after injection instead of leaking them', async function () {
    const { page, client } = await createClient(10);
    client.failAfterInjection = true;

    page.emit('load');
    await client.waitForPageLoad();
    await delay(10);

    assert.ok(
      client.logs.some((log) => log.includes('afterPageScriptInjected failed'))
    );
  });

  it('logs throwing user callbacks instead of leaking them', async function () {
    const { page, client } = await createClient(10);
    client.statusFind = () => {
      throw new Error('statusFind failed');
    };
    client.catchQR = () => {
      throw new Error('catchQR failed');
    };
    client.getQrCode = async () => ({ urlCode: 'code', base64Image: 'image' });
    const evaluate = page.evaluate.bind(page);
    page.evaluate = async (fn, arg) =>
      String(fn).includes('isRegistered') ? false : evaluate(fn, arg);

    page.emit('load');
    await client.waitForPageLoad();
    await delay(50);

    assert.ok(client.logs.some((log) => log.includes('statusFind failed')));
    assert.ok(client.logs.some((log) => log.includes('catchQR failed')));
  });
});
