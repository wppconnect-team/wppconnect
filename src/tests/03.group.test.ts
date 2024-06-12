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
