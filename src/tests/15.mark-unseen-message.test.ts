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
import { runInNewContext } from 'vm';

import { ControlsLayer } from '../api/layers/controls.layer';

function controls(markIsUnread: (chatId: string) => Promise<unknown>) {
  return Object.assign(Object.create(ControlsLayer.prototype), {
    page: {
      evaluate(callback: (...args: unknown[]) => unknown, ...args: unknown[]) {
        return runInNewContext(`(${callback.toString()})(...args)`, {
          WPP: { chat: { markIsUnread } },
          args,
        });
      },
    },
  }) as ControlsLayer;
}

describe('markUnseenMessage', function () {
  for (const chatId of ['123@c.us', '120363000000000000@g.us']) {
    it(`delegates ${chatId} to the unread action`, async function () {
      const calls: string[] = [];
      const layer = controls(async (id) => {
        calls.push(id);
        return { wid: id };
      });

      assert.strictEqual(await layer.markUnseenMessage(chatId), true);
      assert.deepStrictEqual(calls, [chatId]);
    });
  }

  it('propagates the unread failure instead of returning success', async function () {
    const error = new Error('native unread action rejected');
    const layer = controls(async () => {
      throw error;
    });

    await assert.rejects(
      layer.markUnseenMessage('123@c.us'),
      (e) => e === error
    );
  });

  it('waits for the browser unread action before returning success', async function () {
    let complete!: () => void;
    const action = new Promise<void>((resolve) => {
      complete = resolve;
    });
    const layer = controls(() => action);
    let returned = false;
    const result = layer.markUnseenMessage('123@c.us').then((value) => {
      returned = true;
      return value;
    });

    await Promise.resolve();
    assert.strictEqual(returned, false);
    complete();
    assert.strictEqual(await result, true);
  });
});
