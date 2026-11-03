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

import { GroupLayer } from '../api/layers/group.layer';
import { ProfileLayer } from '../api/layers/profile.layer';
import { StatusLayer } from '../api/layers/status.layer';

describe('Layer async return values', function () {
  describe('GroupLayer.promoteParticipant', function () {
    it('returns the evaluation result of promoteParticipants', async function () {
      const expected = [{ participant: '123@c.us', isSuperAdmin: true }];
      const layer = Object.assign(Object.create(GroupLayer.prototype), {
        page: {
          evaluate(
            callback: (...args: unknown[]) => unknown,
            ...args: unknown[]
          ) {
            return runInNewContext(`(${callback.toString()})(...args)`, {
              WPP: {
                group: {
                  promoteParticipants: async () => expected,
                },
              },
              args,
            });
          },
        },
      }) as GroupLayer;

      const result = await layer.promoteParticipant('group@g.us', '123@c.us');
      assert.deepStrictEqual(result, expected);
    });
  });

  describe('ProfileLayer.setProfileStatus', function () {
    it('returns the evaluation result of setMyStatus', async function () {
      const expected = { status: 200 };
      const layer = Object.assign(Object.create(ProfileLayer.prototype), {
        page: {
          evaluate(
            callback: (...args: unknown[]) => unknown,
            ...args: unknown[]
          ) {
            return runInNewContext(`(${callback.toString()})(...args)`, {
              WPP: {
                profile: {
                  setMyStatus: async () => expected,
                },
              },
              args,
            });
          },
        },
      }) as ProfileLayer;

      const result = await layer.setProfileStatus('Available');
      assert.deepStrictEqual(result, expected);
    });
  });

  describe('StatusLayer methods', function () {
    const validBase64Image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

    it('sendImageStatus awaits and returns { ack, id }', async function () {
      const layer = Object.assign(Object.create(StatusLayer.prototype), {
        page: {
          evaluate(
            callback: (...args: unknown[]) => unknown,
            ...args: unknown[]
          ) {
            return runInNewContext(`(${callback.toString()})(...args)`, {
              WPP: {
                status: {
                  sendImageStatus: async () => ({
                    ack: 1,
                    id: 'true_status_123',
                    sendMsgResult: { circular: true },
                  }),
                },
              },
              args,
            });
          },
        },
      }) as StatusLayer;

      const result = await layer.sendImageStatus(validBase64Image);
      assert.deepStrictEqual(JSON.parse(JSON.stringify(result)), {
        ack: 1,
        id: 'true_status_123',
      });
    });

    it('sendTextStatus awaits and returns { ack, id }', async function () {
      const layer = Object.assign(Object.create(StatusLayer.prototype), {
        page: {
          evaluate(
            callback: (...args: unknown[]) => unknown,
            ...args: unknown[]
          ) {
            return runInNewContext(`(${callback.toString()})(...args)`, {
              WPP: {
                status: {
                  sendTextStatus: async () => ({
                    ack: 1,
                    id: 'true_status_text_123',
                  }),
                },
              },
              args,
            });
          },
        },
      }) as StatusLayer;

      const result = await layer.sendTextStatus('Hello status', {});
      assert.deepStrictEqual(JSON.parse(JSON.stringify(result)), {
        ack: 1,
        id: 'true_status_text_123',
      });
    });

    it('sendReadStatus awaits and returns result', async function () {
      const layer = Object.assign(Object.create(StatusLayer.prototype), {
        page: {
          evaluate(
            callback: (...args: unknown[]) => unknown,
            ...args: unknown[]
          ) {
            return runInNewContext(`(${callback.toString()})(...args)`, {
              WPP: {
                status: {
                  sendReadStatus: async (chatId: string, statusId: string) => ({
                    chatId,
                    statusId,
                    read: true,
                  }),
                },
              },
              args,
            });
          },
        },
      }) as StatusLayer;

      const result = await layer.sendReadStatus('123@c.us', 'status-id-1');
      assert.deepStrictEqual(JSON.parse(JSON.stringify(result)), {
        chatId: '123@c.us',
        statusId: 'status-id-1',
        read: true,
      });
    });
  });
});
