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
import { closeBrowser } from '../controllers/browser';

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

describe('closeBrowser', function () {
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
