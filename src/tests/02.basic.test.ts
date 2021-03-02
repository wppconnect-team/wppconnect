import * as assert from 'assert';
import { describeAuthenticatedTest, testUserId } from './common';
import * as wppconnect from '../';

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
