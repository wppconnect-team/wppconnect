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
import { UILayer } from './ui.layer';

export class ControlsLayer extends UILayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Unblock contact
   * @category Blocklist
   * @param contactId {string} id '000000000000@c.us'
   * @returns boolean
   */
  public async unblockContact(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.unblockContact(contactId),
      contactId
    );
  }

  /**
   * Block contact
   * @category Blocklist
   * @param contactId {string} id '000000000000@c.us'
   * @returns boolean
   */
  public async blockContact(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.blockContact(contactId),
      contactId
    );
  }

  /**
   * puts the chat as unread
   * @category Chat
   * @param contactId {string} id '000000000000@c.us'
   * @returns boolean
   */
  public async markUnseenMessage(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.markUnseenMessage(contactId),
      contactId
    );
  }

  /**
   * Deletes the given chat
   * @category Chat
   * @param chatId {string} id '000000000000@c.us'
   * @returns boolean
   */
  public async deleteChat(chatId: string) {
    return this.page.evaluate(
      (chatId) => WAPI.deleteConversation(chatId),
      chatId
    );
  }

  /**
   * Archive and unarchive chat messages with true or false
   * @category Chat
   * @param chatId {string} id '000000000000@c.us'
   * @param option {boolean} true or false
   * @returns boolean
   */
  public async archiveChat(chatId: string, option: boolean = true) {
    return this.page.evaluate(
      ({ chatId, option }) => WAPI.archiveChat(chatId, option),
      { chatId, option }
    );
  }

  /**
   * Pin and Unpin chat messages with true or false
   * @category Chat
   * @param chatId {string} id '000000000000@c.us'
   * @param option {boolean} true or false
   * @param nonExistent {boolean} Pin chat, non-existent (optional)
   * @returns object
   */
  public async pinChat(chatId: string, option: boolean, nonExistent?: boolean) {
    return new Promise(async (resolve, reject) => {
      const result = await this.page.evaluate(
        ({ chatId, option, nonExistent }) => {
          return WAPI.pinChat(chatId, option, nonExistent);
        },
        { chatId, option, nonExistent }
      );
      if (result['erro'] == true) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  }

  /**
   * Deletes all messages of given chat
   * @category Chat
   * @param chatId
   * @param keepStarred Keep starred messages
   * @returns boolean
   */
  public async clearChat(chatId: string, keepStarred = true) {
    return this.page.evaluate(
      ({ chatId, keepStarred }) => WAPI.clearChat(chatId, keepStarred),
      { chatId, keepStarred }
    );
  }

  /**
   * Deletes message of given message id
   * @category Chat
   * @param chatId The chat id from which to delete the message.
   * @param messageId The specific message id of the message to be deleted
   * @param onlyLocal If it should only delete locally (message remains on the other recipienct's phone). Defaults to false.
   */
  public async deleteMessage(
    chatId: string,
    messageId: string[] | string,
    onlyLocal = false
  ) {
    return await this.page.evaluate(
      ({ contactId, messageId, onlyLocal }) =>
        WAPI.deleteMessages(contactId, messageId, onlyLocal),
      { contactId: chatId, messageId, onlyLocal }
    );
  }

  /**
   * Allow only admin to send messages with true or false
   * @category Group
   * @param chatId {string} id '000000000000@c.us'
   * @param option {boolean} true or false
   * @returns boolean
   */
  public async setMessagesAdminsOnly(chatId: string, option: boolean) {
    return this.page.evaluate(
      ({ chatId, option }) => WAPI.setMessagesAdminsOnly(chatId, option),
      { chatId, option }
    );
  }

  /**
   * Enable or disable temporary messages with true or false
   * @category Chat
   * @param chatOrGroupId id '000000000000@c.us' or '000000-000000@g.us'
   * @param value true or false
   * @returns boolean
   */
  public async setTemporaryMessages(chatOrGroupId: string, value: boolean) {
    return await evaluateAndReturn(
      this.page,
      ({ chatOrGroupId, value }) =>
        WAPI.setTemporaryMessages(chatOrGroupId, value),
      { chatOrGroupId, value }
    );
  }
}
