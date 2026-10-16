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

import { HostLayer } from '../api/layers/host.layer';
import { Whatsapp } from '../api/whatsapp';
import { unregisterServiceWorker } from '../controllers/browser';

const silentLogger: any = { log: () => undefined };

function makeFakePage(overrides: Record<string, any> = {}): any {
  const handlers = new Map<string, Array<(...args: any[]) => void>>();
  const page: any = {
    on(event: string, listener: (...args: any[]) => void) {
      handlers.set(event, [...(handlers.get(event) || []), listener]);
      return page;
    },
    emit(event: string, ...args: any[]) {
      for (const listener of handlers.get(event) || []) {
        listener(...args);
      }
    },
    isClosed: () => false,
    close: async () => undefined,
    evaluate: async () => true,
    evaluateOnNewDocument: async () => undefined,
    exposeFunction: async () => undefined,
    createCDPSession: async () => ({
      send: async (method: string) =>
        method === 'Page.getFrameTree'
          ? { frameTree: { frame: { id: 'main-frame' } } }
          : {},
      on: () => undefined,
    }),
    ...overrides,
  };
  return page;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('idle polling', function () {
  it('does not poll the page for registration state', async function () {
    this.timeout(5000);

    let evaluateCalls = 0;
    const page = makeFakePage({
      evaluate: async () => {
        evaluateCalls += 1;
        return true;
      },
    });

    const client = new Whatsapp(page, 'idle-polling-1', {
      logger: silentLogger,
    });
    assert.ok(client);

    await delay(1200);

    assert.strictEqual(
      evaluateCalls,
      0,
      'the client must not poll isRegistered on a timer'
    );
    page.emit('close');
  });

  it('emits disconnectedMobile from the connection event, once', async function () {
    this.timeout(5000);

    let exposed: ((value: boolean) => void) | undefined;
    const page = makeFakePage({
      exposeFunction: async (name: string, fn: any) => {
        if (name === 'onConnectionChange') {
          exposed = fn;
        }
      },
    });

    const events: string[] = [];
    const client = new Whatsapp(page, 'idle-polling-2', {
      logger: silentLogger,
    });
    client.statusFind = (state: any) => {
      events.push(state);
    };

    await (client as any).wireConnectionEvents();

    const handler = exposed as (value: boolean) => void;
    assert.strictEqual(typeof handler, 'function');

    (client as any).connected = true;
    handler(false);
    handler(false);

    await delay(1100);
    assert.deepStrictEqual(events, ['disconnectedMobile']);
    page.emit('close');
  });

  it('redirects the reused page binding to the latest client', async function () {
    this.timeout(5000);

    const exposed = new Map<string, (value: boolean) => void>();
    const page = makeFakePage({
      exposeFunction: async (name: string, fn: any) => {
        if (exposed.has(name)) {
          throw new Error(
            `Failed to add page binding with name ${name}: window['${name}'] already exists!`
          );
        }
        exposed.set(name, fn);
      },
    });

    const events: string[] = [];
    const first = new Whatsapp(page, 'idle-polling-2a', {
      logger: silentLogger,
    });
    const second = new Whatsapp(page, 'idle-polling-2b', {
      logger: silentLogger,
    });
    first.statusFind = (state: any) => events.push(`first:${state}`);
    second.statusFind = (state: any) => events.push(`second:${state}`);

    await (first as any).wireConnectionEvents();
    await (second as any).wireConnectionEvents();

    (first as any).connected = true;
    (second as any).connected = true;

    const handler = exposed.get('onConnectionChange') as (
      value: boolean
    ) => void;
    assert.strictEqual(typeof handler, 'function');

    handler(false);

    await delay(1100);
    assert.deepStrictEqual(
      events,
      ['second:disconnectedMobile'],
      'the reused page must notify the latest client, not the first one'
    );
    assert.strictEqual((first as any).connected, true);
    page.emit('close');
  });

  it('does not schedule the 5s checkStart poll on start', async function () {
    this.timeout(5000);

    const browserModule = require('../controllers/browser');
    const originalInitWhatsapp = browserModule.initWhatsapp;
    browserModule.initWhatsapp = async () => undefined;

    const originalSetInterval = (global as any).setInterval;
    const scheduled: number[] = [];
    (global as any).setInterval = (_fn: any, ms?: number) => {
      scheduled.push(ms || 0);
      return 0;
    };

    try {
      const page = makeFakePage();
      const layer: any = new HostLayer(page, 'idle-polling-3', {
        logger: silentLogger,
      });

      await layer.start();

      assert.ok(
        !scheduled.includes(5000),
        'start() must not schedule the 5s checkStart poll'
      );
    } finally {
      (global as any).setInterval = originalSetInterval;
      browserModule.initWhatsapp = originalInitWhatsapp;
    }
  });

  it('does not install an interval to reset in-page error handlers', async function () {
    let injected: any;
    const page = {
      evaluateOnNewDocument: async (fn: any) => {
        injected = fn;
      },
    };

    await unregisterServiceWorker(page as any);

    assert.ok(injected, 'a document script must be injected');
    assert.ok(
      !String(injected).includes('setInterval'),
      'the injected script must not schedule a periodic interval'
    );
  });
});
