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

  it('forward a single message', async function () {
    const client = getClient();

    const host = await client.getHostDevice();

    assert.ok(host);

    const msg = await client.sendText(
      host.wid._serialized,
      'Message to forward'
    );

    const r = await client.forwardMessages(testUserId, msg.id, false);

    assert.strictEqual(r.length, 1);

    const fmsg = await client.getMessageById(r[0]);

    assert.strictEqual(fmsg.body, 'Message to forward');
  });

  it('forward multiple messages', async function () {
    const client = getClient();

    const host = await client.getHostDevice();

    assert.ok(host);

    const msg1 = await client.sendText(
      host.wid._serialized,
      'Message 1 to forward'
    );
    const msg2 = await client.sendText(
      host.wid._serialized,
      'Message 2 to forward'
    );

    const r = await client.forwardMessages(
      testUserId,
      [msg1.id, msg2.id],
      false
    );

    assert.strictEqual(r.length, 2);

    const fmsg1 = await client.getMessageById(r[0]);
    const fmsg2 = await client.getMessageById(r[1]);

    assert.strictEqual(fmsg1.body, 'Message 1 to forward');
    assert.strictEqual(fmsg2.body, 'Message 2 to forward');
  });
});
