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
import { describeAuthenticatedTest, testUserId } from './common';

describeAuthenticatedTest('Basic functions', function (getClient) {
  it('getAllChats', function (done) {
    getClient()
      .getAllChats()
      .then((result) => {
        assert.ok(result);
        done();
      });
  });

  it('getAllGroups', function (done) {
    getClient()
      .getAllGroups()
      .then((result) => {
        assert.ok(result);
        done();
      });
  });

  it('getNumberProfile', async function () {
    const result = await getClient().getNumberProfile(testUserId);
    assert.ok(result);
  });

  it('getAllUnreadMessages', async function () {
    const result = await getClient().getAllUnreadMessages();
    assert.ok(result);
  });

  it('getAllContacts', async function () {
    const result = await getClient().getAllContacts();
    assert.ok(result);
  });

  it('getAllChatsWithMessages', async function () {
    const result = await getClient().getAllChatsWithMessages();
    assert.ok(result);
  });

  it('getAllMessagesInChat', async function () {
    const result = await getClient().getAllMessagesInChat(
      testUserId,
      true,
      false
    );
    assert.ok(result);
  });

  it('getAllUnreadMessages', async function () {
    const result = await getClient().getAllUnreadMessages();
    assert.ok(result);
  });

  it('getBatteryLevel', async function () {
    const result = await getClient().getBatteryLevel();
    assert.ok(result);
  });

  it('getBlockList', async function () {
    const result = await getClient().getBlockList();
    assert.ok(result);
  });

  it('getChatById', async function () {
    const result = await getClient().getChatById(testUserId);
    assert.ok(result);
  });

  it('getChatIsOnline', async function () {
    const result = await getClient().getChatIsOnline(testUserId);
    assert.ok(typeof result === 'boolean');
  });

  it('getConnectionState', async function () {
    const result = await getClient().getConnectionState();
    assert.ok(result);
  });

  it('getContact', async function () {
    const result = await getClient().getContact(testUserId);
    assert.ok(result);
  });

  it('getHostDevice', async function () {
    const result = await getClient().getHostDevice();
    assert.ok(result);
  });

  it('getLastSeen', async function () {
    const result = await getClient().getLastSeen(testUserId);
    assert.ok(result);
  });

  it('getListMutes', async function () {
    const result = await getClient().getListMutes();
    assert.ok(result);
  });

  // it('getMessageById', async function () {
  //   const result = await getClient().getMessageById();
  //   assert.ok(result);
  // });

  it('getProfilePicFromServer', async function () {
    const result = await getClient().getProfilePicFromServer(testUserId);
    assert.ok(result);
  });

  it('getStatus', async function () {
    const result = await getClient().getStatus(testUserId);
    assert.ok(result);
  });

  it('getTheme', async function () {
    const result = await getClient().getTheme();
    assert.ok(result);
  });

  it('getWAVersion', async function () {
    const result = await getClient().getWAVersion();
    assert.ok(result);
  });

  it('loadAndGetAllMessagesInChat', async function () {
    const result = await getClient().loadAndGetAllMessagesInChat(
      testUserId,
      true,
      true
    );
    assert.ok(result);
  });

  it('sendText', async function () {
    const result = await getClient().sendText(testUserId, 'Send Text');
    assert.ok(result);
  });
});
