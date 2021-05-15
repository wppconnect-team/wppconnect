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
  it('star message', async function () {
    const client = getClient();

    await client.sendText(testUserId, 'Message 1');
    const msg2 = await client.sendText(testUserId, 'Message 2');
    await client.sendText(testUserId, 'Message 3');

    let msg = await client.getMessageById(msg2.id);
    assert.strictEqual(msg.star, false);

    let result = await client.starMessage(msg2.id, true);
    assert.strictEqual(result, 1);

    // Star a starred message
    result = await client.starMessage(msg2.id, true);
    assert.strictEqual(result, 0);

    msg = await client.getMessageById(msg2.id);
    assert.strictEqual(msg.star, true);

    result = await client.starMessage(msg2.id, false);
    assert.strictEqual(result, 1);

    // Unstar a unstarred message
    result = await client.starMessage(msg2.id, false);
    assert.strictEqual(result, 0);

    msg = await client.getMessageById(msg2.id);
    assert.strictEqual(msg.star, false);
  });

  it('clear chat', async function () {
    const client = getClient();

    const host = await client.getHostDevice();

    const chatId = host.wid._serialized;

    const msgs1 = await client.getAllMessagesInChat(chatId, true, false);

    await client.sendText(chatId, 'Message 1');
    const msg2 = await client.sendText(chatId, 'Message 2');
    await client.sendText(chatId, 'Message 3');

    await sleep(2000);

    await client.starMessage(msg2.id, true);

    await sleep(2000);

    const msgs2 = await client.getAllMessagesInChat(chatId, true, false);

    assert.ok(msgs2.length > msgs1.length);

    await sleep(2000);

    await client.clearChat(chatId, true);

    await sleep(2000);

    const msgs3 = await client.getAllMessagesInChat(chatId, true, false);
    assert.strictEqual(msgs3.length, 1);

    await client.clearChat(chatId, false);

    await sleep(2000);

    const msgs4 = await client.getAllMessagesInChat(chatId, true, false);
    assert.strictEqual(msgs4.length, 0);
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

  it('archive chat', async function () {
    const client = getClient();

    // Ensure chat is not archived
    await client.sendText(testUserId, 'unarchive chat');

    await sleep(1000);
    let chat = await client.getChatById(testUserId);

    assert.strictEqual(chat.archive, false);

    // ensure the first archive is OK
    let result = await client.archiveChat(testUserId, true);

    assert.strictEqual(result, true);

    await sleep(1000);
    // ensure the second archive is not OK
    result = await client.archiveChat(testUserId, true);

    assert.strictEqual(result, false);

    await sleep(1000);
    chat = await client.getChatById(testUserId);

    assert.strictEqual(chat.archive, true);

    // ensure the first unarchive is OK
    result = await client.archiveChat(testUserId, false);

    assert.strictEqual(result, true);

    await sleep(1000);
    chat = await client.getChatById(testUserId);

    assert.strictEqual(chat.archive, false);

    // ensure the second unarchive is not OK
    result = await client.archiveChat(testUserId, false);

    assert.strictEqual(result, false);
  });
});
