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
import { sleep } from '../utils/sleep';
import { describeAuthenticatedTest, testUserId } from './common';

describeAuthenticatedTest('Chat functions', function (getClient) {
  it('clearChat', async function () {
    const client = getClient();
    const msgs1 = await client.getAllMessagesInChat(testUserId, true, false);

    await client.sendText(testUserId, 'Message 1');
    await client.sendText(testUserId, 'Message 2');
    await client.sendText(testUserId, 'Message 3');

    const msgs2 = await client.getAllMessagesInChat(testUserId, true, false);

    assert.ok(msgs2.length > msgs1.length);

    await sleep(2000);

    await client.clearChat(testUserId, true);

    await sleep(2000);

    const msgs3 = await client.getAllMessagesInChat(testUserId, true, false);
    assert.strictEqual(msgs3.length, 0);
  });
});
