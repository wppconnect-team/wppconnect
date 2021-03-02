import * as assert from 'assert';
import { describeAuthenticatedTest, testGroupID } from './common';

describeAuthenticatedTest('Group functions', function (getClient) {
  before(function () {
    if (!testGroupID) {
      this.skip();
    }
  });

  it('getGroupAdmins', async function () {
    const result = await getClient().getGroupAdmins(testGroupID);
    assert.ok(result);
  });

  it('getGroupInfoFromInviteLink', async function () {
    const result = await getClient().getGroupInfoFromInviteLink(testGroupID);
    assert.ok(result);
  });

  it('getGroupInviteLink', async function () {
    const result = await getClient().getGroupInviteLink(testGroupID);
    assert.ok(result);
  });

  it('getGroupMembers', async function () {
    const result = await getClient().getGroupMembers(testGroupID);
    assert.ok(result);
  });

  it('getGroupMembersIds', async function () {
    const result = await getClient().getGroupMembersIds(testGroupID);
    assert.ok(result);
  });

  // it('joinGroup', async function () {
  //   const result = await getClient().joinGroup();
  //   assert.ok(result);
  // });
});
