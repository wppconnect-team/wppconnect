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
import { SessionToken } from '../../token-store';
import { Chat, WhatsappProfile } from '../model';
import { SenderLayer } from './sender.layer';

export class RetrieverLayer extends SenderLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Returns a list of mute and non-mute users
   * @category Chat
   * @param type return type: all, toMute and noMute.
   * @returns obj
   */
  public async getListMutes(type?: string): Promise<object> {
    return await this.page.evaluate(
      (type: string) => WAPI.getListMute(type),
      type
    );
  }

  /**
   * Returns browser session token
   * @category Host
   * @returns obj [token]
   */
  public async getSessionTokenBrowser(
    removePath?: boolean
  ): Promise<SessionToken> {
    if (removePath === true) {
      await this.page.evaluate(() => {
        window['pathSession'] = true;
      });
    }

    return await this.page
      .evaluate(() => {
        if (window.localStorage) {
          return {
            WABrowserId: window.localStorage.getItem('WABrowserId'),
            WASecretBundle: window.localStorage.getItem('WASecretBundle'),
            WAToken1: window.localStorage.getItem('WAToken1'),
            WAToken2: window.localStorage.getItem('WAToken2'),
          };
        }
        return null;
      })
      .catch(() => null);
  }

  /**
   * Receive the current theme
   * @category Host
   * @returns string light or dark
   */
  public async getTheme() {
    return await this.page.evaluate(() => WAPI.getTheme());
  }

  /**
   * Receive all blocked contacts
   * @category Blocklist
   * @returns array of [0,1,2,3....]
   */
  public async getBlockList() {
    return await this.page.evaluate(() => WAPI.getBlockList());
  }

  /**
   * Retrieves all chats
   * @category Chat
   * @returns array of [Chat]
   */
  public async getAllChats(withNewMessageOnly = false) {
    if (withNewMessageOnly) {
      return this.page.evaluate(() => WAPI.getAllChatsWithNewMsg());
    } else {
      return this.page.evaluate(() => WAPI.getAllChats());
    }
  }

  /**
   * Checks if a number is a valid WA number
   * @category Contact
   * @param contactId, you need to include the @c.us at the end.
   * @returns contact detial as promise
   */
  public async checkNumberStatus(contactId: string): Promise<WhatsappProfile> {
    return await this.page.evaluate(
      (contactId) => WAPI.checkNumberStatus(contactId),
      contactId
    );
  }

  /**
   * Retrieves all chats with messages
   * @category Chat
   * @returns array of [Chat]
   */
  public async getAllChatsWithMessages(withNewMessageOnly = false) {
    return this.page.evaluate(
      (withNewMessageOnly: boolean) =>
        WAPI.getAllChatsWithMessages(withNewMessageOnly),
      withNewMessageOnly
    );
  }

  /**
   * Retrieve all groups
   * @category Group
   * @returns array of groups
   */
  public async getAllGroups(withNewMessagesOnly = false) {
    if (withNewMessagesOnly) {
      // prettier-ignore
      const chats = await this.page.evaluate(() => WAPI.getAllChatsWithNewMsg());
      return chats.filter((chat) => chat.isGroup);
    } else {
      const chats = await this.page.evaluate(() => WAPI.getAllChats());
      return chats.filter((chat) => chat.isGroup);
    }
  }

  /**
   * Retrieve all broadcast list
   * @category Group
   * @returns array of broadcast list
   */
  public async getAllBroadcastList() {
    const chats = await this.page.evaluate(() => WAPI.getAllChats());
    return chats.filter(
      (chat) => chat.isBroadcast && chat.id._serialized !== 'status@broadcast'
    );
  }

  /**
   * Retrieves contact detail object of given contact id
   * @category Contact
   * @param contactId
   * @returns contact detial as promise
   */
  public async getContact(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.getContact(contactId),
      contactId
    );
  }

  /**
   * Retrieves all contacts
   * @category Contact
   * @returns array of [Contact]
   */
  public async getAllContacts() {
    return await this.page.evaluate(() => WAPI.getAllContacts());
  }

  /**
   * Retrieves chat object of given contact id
   * @category Chat
   * @param contactId
   * @returns contact detial as promise
   */
  public async getChatById(contactId: string): Promise<Chat> {
    return this.page.evaluate(
      (contactId) => WAPI.getChatById(contactId),
      contactId
    );
  }

  /**
   * Retrieves chat object of given contact id
   * @category Chat
   * @param contactId
   * @returns contact detial as promise
   * @deprecated
   */
  public async getChat(contactId: string) {
    return this.getChatById(contactId);
  }

  /**
   * Retrieves chat picture
   * @category Contact
   * @param chatId Chat id
   * @returns url of the chat picture or undefined if there is no picture for the chat.
   */
  public async getProfilePicFromServer(chatId: string) {
    return this.page.evaluate((chatId) => WAPI._profilePicfunc(chatId), chatId);
  }

  /**
   * Load more messages in chat object from server. Use this in a while loop
   * @category Chat
   * @param contactId
   * @returns contact detial as promise
   * @deprecated
   */
  public async loadEarlierMessages(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.loadEarlierMessages(contactId),
      contactId
    );
  }

  /**
   * Retrieves status of given contact
   * @category Contact
   * @param contactId
   */
  public async getStatus(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.getStatus(contactId),
      contactId
    );
  }

  /**
   * Checks if a number is a valid whatsapp number
   * @category Contact
   * @param contactId, you need to include the @c.us at the end.
   * @returns contact detial as promise
   */
  public async getNumberProfile(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.getNumberProfile(contactId),
      contactId
    );
  }

  /**
   * Retrieves all undread Messages
   * @category Chat
   * @param includeMe
   * @param includeNotifications
   * @param useUnreadCount
   * @returns any
   * @deprecated
   */
  public async getUnreadMessages(
    includeMe: boolean,
    includeNotifications: boolean,
    useUnreadCount: boolean
  ) {
    return await this.page.evaluate(
      ({ includeMe, includeNotifications, useUnreadCount }) =>
        WAPI.getUnreadMessages(includeMe, includeNotifications, useUnreadCount),
      { includeMe, includeNotifications, useUnreadCount }
    );
  }

  /**
   * Retrieves all unread messages (where ack is -1)
   * @category Chat
   * @returns list of messages
   */
  public async getAllUnreadMessages() {
    return this.page.evaluate(() => WAPI.getAllUnreadMessages());
  }

  /**
   * Retrieves all new messages (where isNewMsg is true)
   * @category Chat
   * @returns List of messages
   * @deprecated Use getAllUnreadMessages
   */
  public async getAllNewMessages() {
    return await this.page.evaluate(() => WAPI.getAllNewMessages());
  }

  /**
   * Retrieves all messages already loaded in a chat
   * For loading every message use loadAndGetAllMessagesInChat
   * @category Chat
   * @param chatId, the chat to get the messages from
   * @param includeMe, include my own messages? boolean
   * @param includeNotifications
   * @returns any
   */
  public async getAllMessagesInChat(
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) {
    return await this.page.evaluate(
      ({ chatId, includeMe, includeNotifications }) =>
        WAPI.getAllMessagesInChat(chatId, includeMe, includeNotifications),
      { chatId, includeMe, includeNotifications }
    );
  }

  /**
   * Loads and Retrieves all Messages in a chat
   * @category Chat
   * @param chatId, the chat to get the messages from
   * @param includeMe, include my own messages? boolean
   * @param includeNotifications
   * @returns any
   */
  public async loadAndGetAllMessagesInChat(
    chatId: string,
    includeMe = false,
    includeNotifications = false
  ) {
    return await this.page.evaluate(
      ({ chatId, includeMe, includeNotifications }) =>
        WAPI.loadAndGetAllMessagesInChat(
          chatId,
          includeMe,
          includeNotifications
        ),
      { chatId, includeMe, includeNotifications }
    );
  }

  /**
   * Checks if a CHAT contact is online.
   * @category Chat
   * @param chatId chat id: xxxxx@c.us
   */
  public async getChatIsOnline(chatId: string): Promise<boolean> {
    return await this.page.evaluate(
      (chatId: string) => WAPI.getChatIsOnline(chatId),
      chatId
    );
  }

  /**
   * Retrieves the last seen of a CHAT.
   * @category Chat
   * @param chatId chat id: xxxxx@c.us
   */
  public async getLastSeen(chatId: string): Promise<number | boolean> {
    return await this.page.evaluate(
      (chatId: string) => WAPI.getLastSeen(chatId),
      chatId
    );
  }
}
