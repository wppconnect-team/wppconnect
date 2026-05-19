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

import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { evaluateAndReturn } from '../helpers';
import { CatalogLayer } from './catalog.layer';

export class ListsLayer extends CatalogLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Create a new list and optionally add chats to it.
   * Works for both personal and business accounts.
   * @category Lists
   *
   * @example
   * ```javascript
   * const id = await client.createList('Family', ['number@c.us', 'number2@c.us']);
   * console.log(id); // '42'
   * ```
   * @param name List name
   * @param chatIds Chat IDs to add to the list
   * @param colorIndex Optional color index
   */
  public async createList(
    name: string,
    chatIds: string[] = [],
    colorIndex?: number
  ) {
    return await evaluateAndReturn(
      this.page,
      ({ name, chatIds, colorIndex }) =>
        WPP.lists.create(name, chatIds, colorIndex),
      { name, chatIds, colorIndex }
    );
  }

  /**
   * Return all custom lists
   * @category Lists
   *
   * @example
   * ```javascript
   * const lists = await client.getAllLists();
   * ```
   */
  public async getAllLists() {
    return await evaluateAndReturn(this.page, () => WPP.lists.list());
  }

  /**
   * Add chats to an existing list
   * @category Lists
   *
   * @example
   * ```javascript
   * await client.addChatsToList('42', ['number@c.us', 'number2@c.us']);
   * ```
   * @param listId List ID
   * @param chatIds Chat IDs to add
   */
  public async addChatsToList(listId: string, chatIds: string[]) {
    return await evaluateAndReturn(
      this.page,
      ({ listId, chatIds }) => WPP.lists.addChats(listId, chatIds),
      { listId, chatIds }
    );
  }

  /**
   * Remove chats from a list
   * @category Lists
   *
   * @example
   * ```javascript
   * await client.removeChatsFromList('42', ['number@c.us']);
   * ```
   * @param listId List ID
   * @param chatIds Chat IDs to remove
   */
  public async removeChatsFromList(listId: string, chatIds: string[]) {
    return await evaluateAndReturn(
      this.page,
      ({ listId, chatIds }) => WPP.lists.removeChats(listId, chatIds),
      { listId, chatIds }
    );
  }

  /**
   * Rename a list
   * @category Lists
   *
   * @example
   * ```javascript
   * await client.renameList('42', 'Close Friends');
   * ```
   * @param listId List ID
   * @param newName New name
   */
  public async renameList(listId: string, newName: string) {
    return await evaluateAndReturn(
      this.page,
      ({ listId, newName }) => WPP.lists.rename(listId, newName),
      { listId, newName }
    );
  }

  /**
   * Delete a list
   * @category Lists
   *
   * @example
   * ```javascript
   * await client.deleteList('42');
   * ```
   * @param listId List ID
   */
  public async deleteList(listId: string) {
    return await evaluateAndReturn(
      this.page,
      ({ listId }) => WPP.lists.remove(listId),
      { listId }
    );
  }
}
