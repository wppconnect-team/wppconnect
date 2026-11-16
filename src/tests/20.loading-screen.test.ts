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
import * as vm from 'vm';

import { onLoadingScreen } from '../controllers/browser';

async function screen(theme: 'old' | 'new') {
  const nodes: Record<string, any> = {};
  const notifications: Array<[number, string]> = [];
  let notify: () => void = () => undefined;
  let paths: Record<string, string> = {};
  const page: any = {
    exposeFunction: async () => undefined,
    evaluate: async (fn: any, selectors: Record<string, string>) => {
      if (typeof fn !== 'function') return;
      paths = selectors;
      const context = {
        selectors,
        document: {},
        window: {
          getElementByXpath: (path: string) => nodes[path] ?? null,
          loadingScreen: (percent: number, message: string) =>
            notifications.push([percent, message]),
        },
        MutationObserver: class {
          constructor(callback: () => void) {
            notify = () => callback.call(this);
          }
          observe() {}
        },
      };
      vm.runInNewContext(`(${fn.toString()})(selectors)`, context);
    },
  };
  await onLoadingScreen(page);
  const bar = paths[theme === 'old' ? 'PROGRESS' : 'PROGRESS_NEW_THEME'];
  const label =
    paths[theme === 'old' ? 'PROGRESS_MESSAGE' : 'PROGRESS_MESSAGE_NEW_THEME'];
  return { nodes, notifications, notify: () => notify(), bar, label };
}

describe('loading screen mutation observer', () => {
  for (const theme of ['old', 'new'] as const) {
    it(`handles a ${theme} progress bar before its message mounts`, async () => {
      const s = await screen(theme);
      s.nodes[s.bar] = { value: 25 };
      assert.doesNotThrow(s.notify);
      assert.deepStrictEqual(s.notifications, [[25, '']]);
      s.notify();
      assert.strictEqual(s.notifications.length, 1);
      s.nodes[s.label] = { innerText: 'Loading messages' };
      s.notify();
      assert.deepStrictEqual(s.notifications[1], [25, 'Loading messages']);
    });

    it(`handles a ${theme} message disappearing and a changing percentage`, async () => {
      const s = await screen(theme);
      s.nodes[s.bar] = { value: 40 };
      s.nodes[s.label] = { innerText: 'Preparing' };
      s.notify();
      delete s.nodes[s.label];
      s.notify();
      s.nodes[s.bar].value = 41;
      s.notify();
      assert.deepStrictEqual(s.notifications, [
        [40, 'Preparing'],
        [40, ''],
        [41, ''],
      ]);
    });

    it(`ignores ${theme} mutations when neither progress bar exists`, async () => {
      const s = await screen(theme);
      assert.doesNotThrow(s.notify);
      assert.deepStrictEqual(s.notifications, []);
    });
  }

  it('deduplicates the normalized new-theme WhatsApp label', async () => {
    const s = await screen('new');
    s.nodes[s.bar] = { value: 70 };
    s.nodes[s.label] = { innerText: 'WhatsApp' };
    s.notify();
    s.notify();
    delete s.nodes[s.label];
    s.notify();
    assert.deepStrictEqual(s.notifications, [[70, '']]);
  });
});
