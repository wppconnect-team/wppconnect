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
import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Browser } from 'puppeteer';

import { Whatsapp } from '../api/whatsapp';
import { HostLayer } from '../api/layers/host.layer';
import { closeBrowser } from '../controllers/browser';
import { defaultLogger } from '../utils/logger';

function fakeBrowser(overrides: Record<string, unknown> = {}): Browser {
  return {
    process: () => null,
    close: async () => undefined,
    disconnect: async () => undefined,
    ...overrides,
  } as unknown as Browser;
}

function startIdleChild(): ChildProcess {
  return spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], {
    stdio: 'ignore',
  });
}

function killChild(child: ChildProcess) {
  if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGKILL');
  }
}

function fakePage() {
  const listeners = new Map<string, Array<(...args: any[]) => void>>();
  const page: any = {
    on(event: string, listener: (...args: any[]) => void) {
      listeners.set(event, [...(listeners.get(event) || []), listener]);
      return page;
    },
    emit(event: string, ...args: any[]) {
      for (const listener of listeners.get(event) || []) {
        listener(...args);
      }
    },
    isClosed: () => false,
    close: async () => undefined,
    setBypassCSP: async () => undefined,
    setUserAgent: async () => {
      throw new Error('startup failed');
    },
    evaluate: async () => true,
  };
  return page;
}

describe('Whatsapp.close browser cleanup', function () {
  it('keeps explicit close destructive for a caller-supplied browser', async function () {
    let pageCloseCalls = 0;
    let disconnectCalls = 0;
    const browser = fakeBrowser({
      disconnect: async () => {
        disconnectCalls += 1;
      },
    });
    const page: any = {
      close: async () => {
        pageCloseCalls += 1;
      },
      browser: () => browser,
    };
    const client: any = { page, cancelQrLoop() {} };

    assert.strictEqual(await Whatsapp.prototype.close.call(client), true);
    assert.strictEqual(pageCloseCalls, 1);
    assert.strictEqual(disconnectCalls, 1);
  });

  it('closes the browser even when the page is already closed', async function () {
    this.timeout(20000);
    const child = startIdleChild();

    try {
      let browserCloseCalls = 0;
      const page: any = {
        isClosed: () => true,
        close: async () => undefined,
        browser: () =>
          fakeBrowser({
            process: () => ({ pid: child.pid } as any),
            close: async () => {
              browserCloseCalls += 1;
            },
          }),
      };
      const client: any = { cancelQrLoop() {}, page };

      const result = await Whatsapp.prototype.close.call(client);

      assert.strictEqual(result, true);
      assert.strictEqual(browserCloseCalls, 1);
      assert.strictEqual(await waitForChildExit(child), true);
    } finally {
      killChild(child);
    }
  });

  it('resolves even when the browser close rejects', async function () {
    this.timeout(20000);
    const child = startIdleChild();

    try {
      const page: any = {
        isClosed: () => true,
        close: async () => undefined,
        browser: () =>
          fakeBrowser({
            process: () => ({ pid: child.pid } as any),
            close: async () => {
              throw new Error('Protocol error: Target closed');
            },
          }),
      };
      const client: any = { cancelQrLoop() {}, page };

      assert.strictEqual(await Whatsapp.prototype.close.call(client), true);
    } finally {
      killChild(child);
    }
  });
});

describe('automatic page close', function () {
  it('does not disconnect a borrowed browser when page.close rejects', async function () {
    let disconnectCalls = 0;
    const browser = fakeBrowser({
      disconnect: async () => {
        disconnectCalls += 1;
      },
    });
    const host: any = {
      autoCloseInterval: null,
      options: { autoClose: 1, deviceSyncTimeout: 0 },
      page: {
        isClosed: () => false,
        close: async () => {
          throw new Error('page close failed');
        },
        browser: () => browser,
      },
      log() {},
    };

    (HostLayer.prototype as any).tryAutoClose.call(host);
    await new Promise<void>((resolve) => setImmediate(resolve));

    assert.strictEqual(disconnectCalls, 0);
  });

  it('releases the browser when page.close rejects', async function () {
    let disconnectCalls = 0;
    const browser = fakeBrowser({
      disconnect: async () => {
        disconnectCalls += 1;
      },
    });
    const host: any = {
      browserAcquiredHere: true,
      autoCloseInterval: null,
      options: { autoClose: 1, deviceSyncTimeout: 0 },
      page: {
        isClosed: () => false,
        close: async () => {
          throw new Error('page close failed');
        },
        browser: () => browser,
      },
      log() {},
    };

    (HostLayer.prototype as any).tryAutoClose.call(host);
    await new Promise<void>((resolve) => setImmediate(resolve));

    assert.strictEqual(disconnectCalls, 1);
  });
});

function closeBrowserWithTreeKill(
  stub: (...args: any[]) => void
): typeof closeBrowser {
  const browserId = require.resolve('../controllers/browser');
  const treeKillId = require.resolve('tree-kill');
  const browserModule = require.cache[browserId];
  const treeKillModule = require.cache[treeKillId]!;
  const original = treeKillModule.exports;
  try {
    treeKillModule.exports = stub;
    delete require.cache[browserId];
    return require(browserId).closeBrowser;
  } finally {
    require.cache[browserId] = browserModule;
    treeKillModule.exports = original;
  }
}

describe('closeBrowser', function () {
  it('retries failed local process termination instead of caching success', async function () {
    this.timeout(20000);
    const child = startIdleChild();
    const realTreeKill = require('tree-kill');
    let attempts = 0;
    const close = closeBrowserWithTreeKill((pid, signal, callback) => {
      attempts++;
      if (attempts === 1) callback(new Error('Termination denied'));
      else realTreeKill(pid, signal, callback);
    });
    const browser = fakeBrowser({ process: () => child });
    try {
      await close(browser);
      assert.strictEqual(child.exitCode, null);
      assert.strictEqual(child.signalCode, null);
      await close(browser);
      assert.strictEqual(attempts, 2);
      assert.strictEqual(await waitForChildExit(child), true);
      await close(browser);
      assert.strictEqual(attempts, 2);
    } finally {
      killChild(child);
    }
  });

  it('never forces termination using the pid of an already exited child', async function () {
    this.timeout(20000);
    const child = spawn(process.execPath, ['-e', 'process.exit(0)'], {
      stdio: 'ignore',
    });
    let attempts = 0;
    const close = closeBrowserWithTreeKill((_pid, _signal, callback) => {
      attempts++;
      callback(new Error('The old pid must not be killed'));
    });
    try {
      assert.strictEqual(await waitForChildExit(child), true);
      const browser = fakeBrowser({ process: () => child });
      await close(browser);
      await close(browser);
      assert.strictEqual(attempts, 0);
    } finally {
      killChild(child);
    }
  });

  it('shares concurrent cleanup and remains safe when called again', async function () {
    let disconnectCalls = 0;
    const browser = fakeBrowser({
      disconnect: async () => {
        disconnectCalls += 1;
      },
    });

    await Promise.all([closeBrowser(browser), closeBrowser(browser)]);
    await closeBrowser(browser);

    assert.strictEqual(disconnectCalls, 1);
  });

  it('allows retry after a failed disconnect', async function () {
    let disconnectCalls = 0;
    const warnings: string[] = [];
    const originalWarn = defaultLogger.warn;
    defaultLogger.warn = ((message: string) => {
      warnings.push(message);
      return defaultLogger;
    }) as typeof defaultLogger.warn;
    const browser = fakeBrowser({
      disconnect: async () => {
        disconnectCalls += 1;
        if (disconnectCalls === 1) throw new Error('disconnect failed');
      },
    });

    try {
      await closeBrowser(browser);
      await closeBrowser(browser);

      assert.strictEqual(disconnectCalls, 2);
      assert.ok(warnings.some((message) => message.includes('disconnect')));
    } finally {
      defaultLogger.warn = originalWarn;
    }
  });

  it('disconnects a browser without a process handle (remote/browserWS)', async function () {
    let closeCalls = 0;
    let disconnectCalls = 0;
    const browser = fakeBrowser({
      close: async () => {
        closeCalls += 1;
      },
      disconnect: async () => {
        disconnectCalls += 1;
      },
    });

    await closeBrowser(browser);

    assert.strictEqual(closeCalls, 0);
    assert.strictEqual(disconnectCalls, 1);
  });

  it('terminates the OS process tree when a process handle exists', async function () {
    this.timeout(20000);
    const child = startIdleChild();

    try {
      const pid = child.pid;
      assert.ok(pid, 'child process has a pid');

      let gracefulCloseCalls = 0;
      const browser = fakeBrowser({
        // Graceful close returns but does not stop the OS process (the leak)
        process: () => ({ pid } as any),
        close: async () => {
          gracefulCloseCalls += 1;
        },
      });

      await closeBrowser(browser);

      assert.strictEqual(gracefulCloseCalls, 1);
      assert.strictEqual(await waitForChildExit(child), true);
    } finally {
      killChild(child);
    }
  });
});

describe('create browser cleanup', function () {
  const session = `browser-cleanup-${process.pid}-${Date.now()}`;
  const tokenFolder = path.resolve(process.cwd(), 'tokens', session);

  after(function () {
    fs.rmSync(tokenFolder, { recursive: true, force: true });
  });

  it('disconnects a browserWS connection created during failed initialization', async function () {
    const browserModule = require('../controllers/browser');
    const originalInitBrowser = browserModule.initBrowser;
    const { create } = require('../controllers/initializer');
    let disconnectCalls = 0;
    let closeCalls = 0;
    browserModule.initBrowser = async () =>
      fakeBrowser({
        on() {
          return this;
        },
        pages: async () => {
          throw new Error('page acquisition failed');
        },
        disconnect: async () => {
          disconnectCalls += 1;
        },
        close: async () => {
          closeCalls += 1;
        },
      });

    try {
      await assert.rejects(
        create({
          session,
          browserWS: 'ws://example.invalid',
          disableWelcome: true,
          updatesLog: false,
          waitForLogin: false,
        }),
        /page acquisition failed/
      );
      assert.strictEqual(disconnectCalls, 1);
      assert.strictEqual(closeCalls, 0);
    } finally {
      browserModule.initBrowser = originalInitBrowser;
    }
  });

  it('leaves a caller-supplied browser alone when initialization fails', async function () {
    const { create } = require('../controllers/initializer');
    let closeCalls = 0;
    let disconnectCalls = 0;
    const browser = fakeBrowser({
      on() {
        return this;
      },
      pages: async () => {
        throw new Error('page acquisition failed');
      },
      close: async () => {
        closeCalls += 1;
      },
      disconnect: async () => {
        disconnectCalls += 1;
      },
    });

    await assert.rejects(
      create({
        session,
        browser,
        disableWelcome: true,
        updatesLog: false,
        waitForLogin: false,
      }),
      /page acquisition failed/
    );
    assert.strictEqual(closeCalls, 0);
    assert.strictEqual(disconnectCalls, 0);
  });

  function stubCreate(child: ChildProcess, pages: () => Promise<any>) {
    const browserModule = require('../controllers/browser');
    const originalInitBrowser = browserModule.initBrowser;
    const { create } = require('../controllers/initializer');

    let browserCloseCalls = 0;
    const launchedBrowser: any = {
      on() {
        return this;
      },
      pages,
      process: () => ({ pid: child.pid }),
      close: async () => {
        browserCloseCalls += 1;
      },
      isConnected: () => true,
    };

    browserModule.initBrowser = async () => launchedBrowser;

    return {
      create,
      get browserCloseCalls() {
        return browserCloseCalls;
      },
      restore() {
        browserModule.initBrowser = originalInitBrowser;
      },
    };
  }

  it('closes a browser launched during create() when startup fails', async function () {
    this.timeout(20000);
    const child = startIdleChild();
    const page = fakePage();
    const stub = stubCreate(child, async () => [page]);

    try {
      await assert.rejects(
        stub.create({
          session,
          disableWelcome: true,
          updatesLog: false,
          waitForLogin: false,
          useChrome: false,
          autoClose: 0,
        }),
        /startup failed/
      );

      assert.strictEqual(stub.browserCloseCalls, 1);
    } finally {
      stub.restore();
      // Stops the connection watchdog started by the Whatsapp constructor
      page.emit('close');
      killChild(child);
    }
  });

  it('closes a browser launched during create() when page acquisition fails', async function () {
    this.timeout(20000);
    const child = startIdleChild();
    const stub = stubCreate(child, async () => {
      throw new Error('page acquisition failed');
    });

    try {
      await assert.rejects(
        stub.create({
          session,
          disableWelcome: true,
          updatesLog: false,
          waitForLogin: false,
          useChrome: false,
          autoClose: 0,
        }),
        /page acquisition failed/
      );

      assert.strictEqual(stub.browserCloseCalls, 1);
      assert.strictEqual(await waitForChildExit(child), true);
    } finally {
      stub.restore();
      killChild(child);
    }
  });
});

function waitForChildExit(
  child: ChildProcess,
  timeout = 8000
): Promise<boolean> {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      return resolve(true);
    }

    const timer = setTimeout(() => resolve(false), timeout);
    child.once('exit', () => {
      clearTimeout(timer);
      resolve(true);
    });
  });
}
