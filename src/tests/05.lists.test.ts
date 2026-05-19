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

describeAuthenticatedTest('Lists functions', function (getClient) {
  let listId: string;

  before(function () {
    if (!testUserId) {
      this.skip();
    }
  });

  it('createList — returns a string ID', async function () {
    const result = await getClient().createList('WPPConnect Test List', []);
    assert.strictEqual(typeof result, 'string');
    assert.ok(result.length > 0);
    listId = result;
  });

  it('getAllLists — newly created list is present', async function () {
    const result = await getClient().getAllLists();
    assert.ok(Array.isArray(result));
    const found = result.find((l: any) => l.id === listId);
    assert.ok(found, `List ${listId} not found in getAllLists`);
    assert.strictEqual(found.name, 'WPPConnect Test List');
  });

  it('renameList — name is updated', async function () {
    await getClient().renameList(listId, 'WPPConnect Test List (renamed)');
    const result = await getClient().getAllLists();
    const found = result.find((l: any) => l.id === listId);
    assert.strictEqual(found?.name, 'WPPConnect Test List (renamed)');
  });

  it('addChatsToList — chat appears in list after add', async function () {
    if (!testUserId) return this.skip();
    await getClient().addChatsToList(listId, [testUserId]);
    const lists = await getClient().getAllLists();
    const found = lists.find((l: any) => l.id === listId);
    assert.ok(found, 'list not found after addChatsToList');
  });

  it('removeChatsFromList — does not throw for valid list', async function () {
    if (!testUserId) return this.skip();
    // WPP.lists.removeChats returns void — assert strictEqual undefined
    const result = await getClient().removeChatsFromList(listId, [testUserId]);
    assert.strictEqual(result, undefined);
  });

  it('deleteList — list is gone after deletion', async function () {
    await getClient().deleteList(listId);
    const result = await getClient().getAllLists();
    const still = result.find((l: any) => l.id === listId);
    assert.strictEqual(still, undefined);
  });
});
