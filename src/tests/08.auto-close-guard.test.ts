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
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import { Whatsapp } from '../api/whatsapp';
import { hasAlivePage } from '../controllers/browser';

function makePage(url: string, closed = false): any {
  return {
    isClosed: () => closed,
    url: () => url,
  };
}

describe('hasAlivePage', function () {
  it('treats an empty browser as having no alive page', function () {
    assert.strictEqual(hasAlivePage([]), false);
  });

  it('ignores a leftover about:blank tab', function () {
    assert.strictEqual(
      hasAlivePage([makePage('about:blank')]),
      false,
      'an about:blank tab must not keep the browser alive'
    );
  });

  it('ignores closed pages', function () {
    assert.strictEqual(
      hasAlivePage([makePage('https://web.whatsapp.com/', true)]),
      false
    );
    assert.strictEqual(hasAlivePage([makePage('about:blank', true)]), false);
  });

  it('keeps the browser alive while a real page is open', function () {
    assert.strictEqual(
      hasAlivePage([makePage('https://web.whatsapp.com/')]),
      true
    );
  });

  it('keeps the browser alive when a real page coexists with about:blank', function () {
    assert.strictEqual(
      hasAlivePage([
        makePage('about:blank'),
        makePage('https://web.whatsapp.com/'),
      ]),
      true
    );
  });

  it('does not probe the url of closed pages', function () {
    let urlCalls = 0;
    const closed = {
      isClosed: () => true,
      url: () => {
        urlCalls += 1;
        return 'https://web.whatsapp.com/';
      },
    };

    assert.strictEqual(hasAlivePage([closed as any]), false);
    assert.strictEqual(urlCalls, 0, 'closed pages must be filtered first');
  });
});

const SESSION = `auto-close-guard-${process.pid}-${Date.now()}`;
const TOKEN_FOLDER = path.resolve(process.cwd(), 'tokens', SESSION);

const CREATE_OPTIONS = {
  disableWelcome: true,
  updatesLog: false,
  waitForLogin: false,
  useChrome: false,
  autoClose: 0,
};

function fakeSessionPage(browser: any) {
  const state = { closed: false };
  const listeners = new Map<string, Array<(...args: any[]) => void>>();
  const page: any = {
    isClosed: () => state.closed,
    url: () => 'https://web.whatsapp.com/',
    setBypassCSP: async () => undefined,
    // Aborts client.start() so create() returns to the caller
    setUserAgent: async () => {
      throw new Error('startup stopped');
    },
    evaluate: async () => true,
    close: async () => undefined,
    on(event: string, listener: (...args: any[]) => void) {
      listeners.set(event, [...(listeners.get(event) || []), listener]);
      return page;
    },
    emit(event: string, ...args: any[]) {
      for (const listener of listeners.get(event) || []) {
        listener(...args);
      }
    },
    browser: () => browser,
  };
  return { page, state };
}

describe('targetdestroyed auto-close guard (create lifecycle)', function () {
  it('recognizes the destroyed session target before Page.isClosed updates', async function () {
    const browserModule = require('../controllers/browser');
    const initializer = require('../controllers/initializer');
    const originalInit = browserModule.initBrowser;
    const originalStart = Object.getOwnPropertyDescriptor(
      Whatsapp.prototype,
      'start'
    );
    const target = {};
    const handlers: Record<string, (...args: any[]) => any> = {};
    let disconnects = 0;
    const browser: any = {
      connected: true,
      process: () => null,
      on(name: string, fn: any) {
        handlers[name] = fn;
        return this;
      },
      pages: async () => [page],
      disconnect: async () => {
        disconnects++;
        browser.connected = false;
      },
    };
    const { page } = fakeSessionPage(browser);
    page.target = () => target;
    browserModule.initBrowser = async () => browser;
    Object.defineProperty(Whatsapp.prototype, 'start', {
      configurable: true,
      writable: true,
      value: async () => undefined,
    });
    try {
      await initializer.create({ session: SESSION, ...CREATE_OPTIONS });
      await handlers.targetdestroyed({});
      assert.strictEqual(disconnects, 0);
      assert.strictEqual(page.isClosed(), false);
      await handlers.targetdestroyed(target);
      assert.strictEqual(disconnects, 1);
    } finally {
      browserModule.initBrowser = originalInit;
      if (originalStart)
        Object.defineProperty(Whatsapp.prototype, 'start', originalStart);
      else delete (Whatsapp.prototype as any).start;
    }
  });

  after(function () {
    fs.rmSync(TOKEN_FOLDER, { recursive: true, force: true });
  });

  it('does not act on targets destroyed during startup, before the session page exists', async function () {
    this.timeout(10000);

    const browserModule = require('../controllers/browser');
    const originalInitBrowser = browserModule.initBrowser;
    const { create } = require('../controllers/initializer');

    const state = { pagesCalls: 0, closeCalls: 0 };
    const handlers: Record<string, (...args: any[]) => any> = {};
    const browser: any = {
      on(event: string, handler: (...args: any[]) => any) {
        handlers[event] = handler;
        return this;
      },
      pages: async () => {
        state.pagesCalls += 1;
        return [];
      },
      newPage: async () => {
        throw new Error('session page not ready');
      },
      process: () => null,
      disconnect: async () => undefined,
      close: async () => {
        state.closeCalls += 1;
      },
      isConnected: () => true,
    };

    browserModule.initBrowser = async () => browser;

    try {
      await assert.rejects(
        create({ session: SESSION, ...CREATE_OPTIONS }),
        /session page not ready/
      );

      assert.ok(
        handlers['targetdestroyed'],
        'handler registered during create'
      );

      const pagesCallsBefore = state.pagesCalls;
      await handlers['targetdestroyed']({});

      assert.strictEqual(
        state.pagesCalls,
        pagesCallsBefore,
        'the startup guard must return before inspecting pages'
      );
      assert.strictEqual(state.closeCalls, 0);
    } finally {
      browserModule.initBrowser = originalInitBrowser;
    }
  });

  async function createWithSessionPage(
    browserOverrides: Record<string, any> = {},
    logger?: any,
    resource: 'page' | 'browser' | 'owned' = 'owned'
  ) {
    const handlers: Record<string, (...args: any[]) => any> = {};
    const state = {
      pages: [] as any[],
      pagesCalls: 0,
      closeCalls: 0,
      disconnectCalls: 0,
      connected: true,
    };
    const browser: any = {
      on(event: string, handler: (...args: any[]) => any) {
        handlers[event] = handler;
        return this;
      },
      pages: async () => {
        state.pagesCalls += 1;
        return state.pages;
      },
      process: () => null,
      disconnect: async () => {
        state.disconnectCalls += 1;
      },
      close: async () => {
        state.closeCalls += 1;
      },
      get connected() {
        return state.connected;
      },
      ...browserOverrides,
    };
    const { page, state: pageState } = fakeSessionPage(browser);
    if (resource !== 'page') state.pages = [page];

    const { create } = require('../controllers/initializer');
    const browserModule = require('../controllers/browser');
    const originalInitBrowser = browserModule.initBrowser;
    if (resource === 'owned') browserModule.initBrowser = async () => browser;
    try {
      await create({
        session: SESSION,
        ...(resource === 'page'
          ? { page }
          : resource === 'browser'
          ? { browser }
          : { browserWS: 'ws://example.invalid' }),
        ...CREATE_OPTIONS,
        ...(logger ? { logger } : {}),
      }).catch(() => {});
    } finally {
      browserModule.initBrowser = originalInitBrowser;
    }

    assert.ok(handlers['targetdestroyed'], 'handler registered during create');

    return {
      handlers,
      state,
      pageState,
      page,
      browser,
      stop: () => page.emit('close'),
    };
  }

  it('preserves a borrowed Page browser during targetdestroyed', async function () {
    const { handlers, state, pageState, stop } = await createWithSessionPage(
      {},
      undefined,
      'page'
    );
    try {
      pageState.closed = true;
      state.pages = [makePage('about:blank')];
      const pagesCallsBefore = state.pagesCalls;
      await handlers['targetdestroyed']({});
      assert.strictEqual(state.pagesCalls, pagesCallsBefore);
      assert.strictEqual(state.disconnectCalls, 0);
      assert.strictEqual(state.closeCalls, 0);
    } finally {
      stop();
    }
  });

  it('preserves a shared caller-supplied remote Browser connection', async function () {
    const { handlers, state, pageState, browser, stop } =
      await createWithSessionPage({}, undefined, 'browser');
    try {
      pageState.closed = true;
      state.pages = [makePage('about:blank')];
      await handlers['targetdestroyed']({});
      assert.strictEqual(state.disconnectCalls, 0);
      assert.strictEqual(state.closeCalls, 0);
      assert.strictEqual(browser.connected, true);
    } finally {
      stop();
    }
  });

  it('disconnects a remote browser once the session tab is closed and only about:blank remains', async function () {
    this.timeout(10000);

    const { handlers, state, pageState, stop } = await createWithSessionPage();

    try {
      pageState.closed = true;
      state.pages = [makePage('about:blank')];
      await handlers['targetdestroyed']({});

      assert.strictEqual(state.closeCalls, 0);
      assert.strictEqual(state.disconnectCalls, 1);
    } finally {
      stop();
    }
  });

  it('contains and logs a browser.pages failure in targetdestroyed', async function () {
    const errors: string[] = [];
    const logger = {
      info() {},
      http() {},
      warn() {},
      log() {},
      error(message: string) {
        errors.push(message);
      },
    };
    const { handlers, browser, stop } = await createWithSessionPage({}, logger);
    browser.pages = async () => {
      throw new Error('pages failed');
    };

    try {
      await assert.doesNotReject(handlers['targetdestroyed']({}));
      assert.ok(errors.some((message) => message.includes('targetdestroyed')));
    } finally {
      stop();
    }
  });

  it('shares cleanup across client.close and targetdestroyed', async function () {
    const { handlers, state, pageState, page, stop } =
      await createWithSessionPage();
    const autoCloseRuns: Promise<any>[] = [];
    page.close = async () => {
      if (pageState.closed) return;
      pageState.closed = true;
      state.pages = [makePage('about:blank')];
      autoCloseRuns.push(handlers['targetdestroyed']({}));
    };

    try {
      const client: any = { page, cancelQrLoop() {} };
      await Promise.all([
        Whatsapp.prototype.close.call(client),
        Whatsapp.prototype.close.call(client),
      ]);
      await Promise.all(autoCloseRuns);
      await Whatsapp.prototype.close.call(client);

      assert.strictEqual(state.disconnectCalls, 1);
    } finally {
      stop();
    }
  });

  it('terminates an owned browser when automatic close hangs', async function () {
    this.timeout(15000);
    const child = spawn(
      process.execPath,
      ['-e', 'setInterval(() => {}, 1000)'],
      {
        stdio: 'ignore',
      }
    );

    try {
      const { handlers, state, pageState, stop } = await createWithSessionPage({
        process: () => ({ pid: child.pid }),
        close: () => new Promise<void>(() => {}),
      });

      try {
        pageState.closed = true;
        state.pages = [makePage('about:blank')];
        await handlers['targetdestroyed']({});

        assert.strictEqual(await waitForChildExit(child), true);
      } finally {
        stop();
      }
    } finally {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL');
      }
    }
  });

  it('does not inspect pages after a getter-only browser disconnects', async function () {
    this.timeout(10000);

    const { handlers, state, pageState, stop } = await createWithSessionPage();

    try {
      pageState.closed = true;
      state.pages = [makePage('about:blank')];
      state.connected = false;
      const pagesCallsBefore = state.pagesCalls;

      await handlers['targetdestroyed']({});

      assert.strictEqual(state.pagesCalls, pagesCallsBefore);
      assert.strictEqual(state.closeCalls, 0);
    } finally {
      stop();
    }
  });

  it('keeps the browser open for a temporarily blank session page', async function () {
    this.timeout(10000);

    const { handlers, state, pageState, stop } = await createWithSessionPage();

    try {
      pageState.closed = false;
      state.pages = [makePage('about:blank')];
      await handlers['targetdestroyed']({});

      assert.strictEqual(state.closeCalls, 0);
    } finally {
      stop();
    }
  });

  it('keeps the browser open when a separate target is destroyed', async function () {
    this.timeout(10000);

    const { handlers, state, pageState, stop } = await createWithSessionPage();

    try {
      pageState.closed = false;
      state.pages = [makePage('https://web.whatsapp.com/')];
      await handlers['targetdestroyed']({});

      assert.strictEqual(state.closeCalls, 0);
    } finally {
      stop();
    }
  });
});

function waitForChildExit(child: ReturnType<typeof spawn>): Promise<boolean> {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      return resolve(true);
    }

    const timer = setTimeout(() => resolve(false), 8000);
    child.once('exit', () => {
      clearTimeout(timer);
      resolve(true);
    });
  });
}
