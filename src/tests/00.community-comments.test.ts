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
import { CommunityLayer } from '../api/layers/community.layer';
import { ListenerLayer } from '../api/layers/listener.layer';

const originalWPP = (globalThis as any).WPP;
describe('Community announcement comments', () => {
  afterEach(() => {
    (globalThis as any).WPP = originalWPP;
  });
  const client = {
    page: { evaluate: (fn: any, ...args: any[]) => fn(...args) },
  };

  it('returns safe comments unchanged and passes the announcement id', async () => {
    const comments = [
      { id: 'reply', parentMsgId: 'parent', body: 'hello', type: 'comment' },
    ];
    (globalThis as any).WPP = {
      chat: {
        getComments: async (id: string) => {
          assert.strictEqual(id, 'parent');
          return comments;
        },
      },
    };
    assert.strictEqual(
      await CommunityLayer.prototype.getComments.call(client, 'parent'),
      comments
    );
  });
  it('passes the exact reply text and preserves native send verdicts', async () => {
    const result = { messageSendResult: 'ERROR_UNKNOWN' };
    (globalThis as any).WPP = {
      chat: {
        sendCommentMessage: async (id: string, text: string) => {
          assert.strictEqual(id, 'parent');
          assert.strictEqual(text, ' text ');
          return result;
        },
      },
    };
    assert.strictEqual(
      await CommunityLayer.prototype.sendCommentMessage.call(
        client,
        'parent',
        ' text '
      ),
      result
    );
  });
  it('does not retry an ambiguous failed send', async () => {
    let calls = 0;
    (globalThis as any).WPP = {
      chat: {
        sendCommentMessage: async () => {
          calls++;
          throw new Error('lost response');
        },
      },
    };
    await assert.rejects(
      CommunityLayer.prototype.sendCommentMessage.call(
        client,
        'parent',
        'text'
      ),
      /lost response/
    );
    assert.strictEqual(calls, 1);
  });
  it('fails clearly with an older WA-JS build', async () => {
    (globalThis as any).WPP = { chat: {} };
    await assert.rejects(
      async () => CommunityLayer.prototype.getComments.call(client, 'parent'),
      /WA-JS build/
    );
    await assert.rejects(
      async () =>
        CommunityLayer.prototype.sendCommentMessage.call(
          client,
          'parent',
          'text'
        ),
      /WA-JS build/
    );
  });
  it('registers the disposable comment listener', () => {
    const callback = () => {};
    const disposable = { dispose() {} };
    const stub = {
      registerEvent: (event: string, listener: unknown) => {
        assert.strictEqual(event, 'onCommentMessage');
        assert.strictEqual(listener, callback);
        return disposable;
      },
    };
    assert.strictEqual(
      ListenerLayer.prototype.onCommentMessage.call(stub, callback),
      disposable
    );
  });
});
