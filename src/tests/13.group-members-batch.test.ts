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

import { GroupLayer } from '../api/layers/group.layer';

const silentLogger: any = { log: () => undefined };

function makePage(evaluateCalls: any[]): any {
  const page: any = {
    on: () => page,
    isClosed: () => false,
    createCDPSession: async () => ({
      send: async (method: string) =>
        method === 'Page.getFrameTree'
          ? { frameTree: { frame: { id: 'main-frame' } } }
          : {},
      on: () => undefined,
    }),
    evaluate: async (pageFunction: (...args: any[]) => any, ...args: any[]) => {
      evaluateCalls.push(args);
      return pageFunction(...args);
    },
  };
  return page;
}

describe('group members batching', function () {
  const originalWPP = (global as any).WPP;
  const originalWAPI = (global as any).WAPI;

  afterEach(function () {
    (global as any).WPP = originalWPP;
    (global as any).WAPI = originalWAPI;
  });

  it('resolves every member contact in a single page call', async function () {
    const ids = [
      '111@s.whatsapp.net',
      '222@s.whatsapp.net',
      '333@s.whatsapp.net',
      '444@s.whatsapp.net',
      '555@s.whatsapp.net',
    ];

    (global as any).WPP = {
      group: {
        getParticipants: async (groupId: string) =>
          ids.map((id) => ({ id: { _serialized: id }, groupId })),
      },
    };
    (global as any).WAPI = {
      getContact: (id: string) => ({ id, name: `contact-${id}` }),
    };

    const evaluateCalls: any[] = [];
    const layer = new GroupLayer(makePage(evaluateCalls), 'group-batch', {
      logger: silentLogger,
    });

    const result = (await layer.getGroupMembers('group@g.us')) as any[];

    // One call for the participant ids, one for every contact - not N+1.
    assert.strictEqual(
      evaluateCalls.length,
      2,
      'member contacts must be fetched in a single page call'
    );
    assert.strictEqual(result.length, ids.length);
    assert.deepStrictEqual(
      result.map((contact) => contact.id),
      ids
    );
    assert.deepStrictEqual(
      result.map((contact) => contact.name),
      ids.map((id) => `contact-${id}`)
    );
  });

  it('returns an empty array for a group without members', async function () {
    (global as any).WPP = {
      group: {
        getParticipants: async () => [],
      },
    };
    (global as any).WAPI = {
      getContact: (id: string) => ({ id }),
    };

    const evaluateCalls: any[] = [];
    const layer = new GroupLayer(makePage(evaluateCalls), 'group-batch', {
      logger: silentLogger,
    });

    const result = await layer.getGroupMembers('group@g.us');

    assert.deepStrictEqual(result, []);
  });
});
