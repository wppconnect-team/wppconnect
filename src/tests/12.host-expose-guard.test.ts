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

const silentLogger: any = { log: () => undefined };

function makePage(overrides: Record<string, any> = {}): any {
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
    exposeFunction: async () => undefined,
    removeExposedFunction: async () => undefined,
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

function makeLayer(page: any): any {
  return new HostLayer(page, 'expose-guard', { logger: silentLogger });
}

describe('host expose guard', function () {
  describe('exposePageFunction', function () {
    it('exposes a fresh binding without removing anything', async function () {
      const exposed: string[] = [];
      const removed: string[] = [];
      const page = makePage({
        exposeFunction: async (name: string) => {
          exposed.push(name);
        },
        removeExposedFunction: async (name: string) => {
          removed.push(name);
        },
      });
      const layer = makeLayer(page);

      await layer.exposePageFunction('cb', () => 1);

      assert.deepStrictEqual(exposed, ['cb']);
      assert.deepStrictEqual(removed, [], 'nothing to remove on a fresh page');
    });

    it('replaces a binding left by a previous client', async function () {
      const removed: string[] = [];
      let attempts = 0;
      const page = makePage({
        exposeFunction: async () => {
          attempts += 1;
          if (attempts === 1) {
            throw new Error(
              "Failed to add page binding with name cb: window['cb'] already exists!"
            );
          }
        },
        removeExposedFunction: async (name: string) => {
          removed.push(name);
        },
      });
      const layer = makeLayer(page);

      await layer.exposePageFunction('cb', () => 1);

      assert.strictEqual(attempts, 2, 'the binding must be re-exposed');
      assert.deepStrictEqual(removed, ['cb']);
    });

    it('rethrows unrelated errors without removing', async function () {
      const removed: string[] = [];
      let attempts = 0;
      const page = makePage({
        exposeFunction: async () => {
          attempts += 1;
          throw new Error('Target closed');
        },
        removeExposedFunction: async (name: string) => {
          removed.push(name);
        },
      });
      const layer = makeLayer(page);

      await assert.rejects(
        layer.exposePageFunction('cb', () => 1),
        /Target closed/
      );
      assert.strictEqual(attempts, 1, 'must not retry unrelated failures');
      assert.deepStrictEqual(removed, []);
    });
  });

  describe('start', function () {
    it('completes on a reused page that already has the bindings', async function () {
      this.timeout(10000);

      const browserModule = require('../controllers/browser');
      const originalInitWhatsapp = browserModule.initWhatsapp;
      browserModule.initWhatsapp = async () => undefined;

      const exposed: string[] = [];
      const removed: string[] = [];
      const page = makePage({
        exposeFunction: async (name: string) => {
          // Every binding already exists (page reused across clients)
          if (!removed.includes(name)) {
            throw new Error(
              `Failed to add page binding with name ${name}: window['${name}'] already exists!`
            );
          }
          exposed.push(name);
        },
        removeExposedFunction: async (name: string) => {
          removed.push(name);
        },
      });
      const layer = makeLayer(page);

      try {
        await layer.start();
        layer.cancelQrLoop();

        const names = [
          'checkQrCode',
          'onLinkCode',
          'onLinkCodeExpired',
          'onLinkCodeError',
          'checkInChat',
        ];
        for (const name of names) {
          assert.ok(removed.includes(name), `${name} binding was replaced`);
          assert.ok(exposed.includes(name), `${name} re-exposed`);
        }
      } finally {
        browserModule.initWhatsapp = originalInitWhatsapp;
        layer.cancelQrLoop();
      }
    });
  });
});
