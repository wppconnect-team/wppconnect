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

import { SenderLayer } from '../api/layers/sender.layer';

function sender(forward: (...args: any[]) => unknown) {
  return Object.assign(Object.create(SenderLayer.prototype), {
    page: {
      evaluate(callback: (...args: unknown[]) => unknown, ...args: unknown[]) {
        return runInNewContext(`(${callback.toString()})(...args)`, {
          WPP: { chat: { forwardMessages: forward } },
          args,
        });
      },
    },
  }) as SenderLayer;
}

describe('SenderLayer.forwardMessagesV2', function () {
  it('passes a single complete message id as an array to the native API', async function () {
    const id = 'false_123@c.us_MESSAGE';
    let calls = 0;
    const layer = sender((chat, ids, options) => {
      calls++;
      assert.strictEqual(chat, '456@lid');
      assert.ok(Array.isArray(ids), 'native API must receive a message array');
      assert.deepStrictEqual(ids, [id]);
      assert.strictEqual(options, undefined);
      return [];
    });

    assert.deepStrictEqual(await layer.forwardMessagesV2('456@lid', id), []);
    assert.strictEqual(calls, 1);
  });

  it('forwards all ids and options without changing the caller input', async function () {
    const ids = ['message-one', 'message-two'];
    const options = {
      displayCaptionText: true,
      multicast: false,
      appendedText: true,
    };
    const before = JSON.stringify({ ids, options });
    const layer = sender((chat, messages, receivedOptions) => {
      assert.strictEqual(chat, '123@g.us');
      assert.deepStrictEqual(messages, ids);
      assert.deepStrictEqual(receivedOptions, options);
      return [];
    });

    assert.deepStrictEqual(
      await layer.forwardMessagesV2('123@g.us', ids, options),
      []
    );
    assert.strictEqual(JSON.stringify({ ids, options }), before);
  });

  it('preserves a native failure list instead of interpreting it as sent message ids', async function () {
    const failures = [{ id: 'message-two', error: 'not forwarded' }];
    const layer = sender(() => failures);
    assert.deepStrictEqual(
      await layer.forwardMessagesV2('123@c.us', ['message-one', 'message-two']),
      failures
    );
  });

  it('propagates a rejected native operation', async function () {
    const error = new Error('Native forwarding unavailable');
    const layer = sender(async () => {
      throw error;
    });
    await assert.rejects(
      layer.forwardMessagesV2('123@c.us', ['message']),
      (value) => value === error
    );
  });
});
