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
import { readFileSync } from 'fs';
import * as path from 'path';
import { ModuleKind, transpileModule } from 'typescript';
import { runInNewContext } from 'vm';

function messagesApi(
  models: unknown[],
  serialize: (model: unknown) => unknown
) {
  const exports: any = {};
  let constructions = 0;
  const calls: unknown[][] = [];
  runInNewContext(
    transpileModule(
      readFileSync(
        path.join(__dirname, '../lib/wapi/functions/get-messages.js'),
        'utf8'
      ),
      { compilerOptions: { module: ModuleKind.CommonJS } }
    ).outputText,
    {
      exports,
      WPP: {
        chat: {
          getMessages: async (...args: unknown[]) => {
            calls.push(args);
            return models;
          },
        },
        whatsapp: {
          MsgStore: {
            modelClass: class {
              constructor() {
                constructions++;
              }
            },
          },
        },
      },
      WAPI: {
        processMessageObj(model: unknown, me: boolean, notifications: boolean) {
          assert.strictEqual(me, true);
          assert.strictEqual(notifications, true);
          return serialize(model);
        },
      },
    }
  );
  return {
    getMessages: exports.getMessages,
    calls,
    constructions: () => constructions,
  };
}

const defaults = {
  isSentCagPollCreation: false,
  isEventCanceled: false,
  isForwarded: false,
  isQuestion: false,
  isSpoiler: false,
  nonJidMentions: null,
};

describe('WAPI.getMessages model reuse', function () {
  it('serializes the returned models repeatedly without constructing native copies', async function () {
    const model = Object.freeze({ id: 'message' });
    const api = messagesApi([model], (value) => {
      assert.strictEqual(value, model);
      return { id: 'message', body: 'hello' };
    });
    for (let i = 0; i < 20; i++) {
      const messages = await api.getMessages('123@c.us', {
        count: 50,
        includeCallMessages: true,
      });
      assert.strictEqual(messages.length, 1);
      assert.strictEqual(messages[0].body, 'hello');
    }
    assert.strictEqual(api.constructions(), 0);
    assert.strictEqual(api.calls.length, 20);
    assert.deepStrictEqual(api.calls[0], [
      '123@c.us',
      { count: 50, includeCallMessages: true },
    ]);
  });

  for (const values of [
    {},
    Object.fromEntries(Object.keys(defaults).map((key) => [key, undefined])),
  ]) {
    it(`preserves historical defaults for ${
      Object.keys(values).length ? 'undefined' : 'absent'
    } DTO fields`, async function () {
      const serialized = Object.freeze({ id: 'message', ...values });
      const api = messagesApi([{}], () => serialized);
      const [message] = await api.getMessages('123@c.us');
      assert.deepStrictEqual(JSON.parse(JSON.stringify(message)), {
        id: 'message',
        ...defaults,
      });
      assert.notStrictEqual(message, serialized);
      assert.strictEqual(api.constructions(), 0);
    });
  }

  it('retains explicit native values without mutating the DTO or its model', async function () {
    const model = Object.freeze({ id: 'message' });
    const serialized = Object.freeze({
      ...defaults,
      isSentCagPollCreation: true,
      isEventCanceled: true,
      isForwarded: true,
      isQuestion: null,
      isSpoiler: true,
      nonJidMentions: ['mention'],
    });
    const before = JSON.stringify(serialized);
    const api = messagesApi([model], () => serialized);
    const [message] = await api.getMessages('123@c.us');
    assert.deepStrictEqual(JSON.parse(JSON.stringify(message)), serialized);
    assert.strictEqual(JSON.stringify(serialized), before);
    assert.deepStrictEqual(model, { id: 'message' });
    assert.strictEqual(api.constructions(), 0);
  });

  it('returns an empty list without constructing models or invoking serialization', async function () {
    const api = messagesApi([], () => {
      throw new Error('No models to serialize');
    });
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(await api.getMessages('123@c.us'))),
      []
    );
    assert.strictEqual(api.constructions(), 0);
  });
});
