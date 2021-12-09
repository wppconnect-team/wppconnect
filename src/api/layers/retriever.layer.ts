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
import { evaluateAndReturn } from '../helpers';
import { Chat, ProfilePicThumbObj, WhatsappProfile } from '../model';
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
    return await evaluateAndReturn(
      this.page,
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
      await evaluateAndReturn(this.page, () => {
        window['pathSession'] = true;
      });
    }
    if (await this.isMultiDevice()) {
      return {
        WABrowserId: 'MultiDevice',
        WASecretBundle: 'MultiDevice',
        WAToken1: 'MultiDevice',
        WAToken2: 'MultiDevice',
      };
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
    return await evaluateAndReturn(this.page, () => WAPI.getTheme());
  }

  /**
   * Receive all blocked contacts
   * @category Blocklist
   * @returns array of [0,1,2,3....]
   */
  public async getBlockList() {
    return await evaluateAndReturn(this.page, () =>
      WPP.blocklist.all().map((b) => b.toString())
    );
  }

  /**
   * Retrieves all chats
   * @category Chat
   * @returns array of [Chat]
   */
  public async getAllChats(withNewMessageOnly = false) {
    if (withNewMessageOnly) {
      return evaluateAndReturn(this.page, () => WAPI.getAllChatsWithNewMsg());
    } else {
      return evaluateAndReturn(this.page, () => WAPI.getAllChats());
    }
  }

  /**
   * Checks if a number is a valid WA number
   * @category Contact
   * @param contactId, you need to include the @c.us at the end.
   * @returns contact detial as promise
   */
  public async checkNumberStatus(contactId: string): Promise<WhatsappProfile> {
    return await evaluateAndReturn(
      this.page,
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
    return evaluateAndReturn(
      this.page,
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
      const chats = await evaluateAndReturn(this.page,() => WAPI.getAllChatsWithNewMsg());
      return chats.filter((chat) => chat.isGroup);
    } else {
      const chats = await evaluateAndReturn(this.page, () =>
        WAPI.getAllChats()
      );
      return chats.filter((chat) => chat.isGroup);
    }
  }

  /**
   * Retrieve all broadcast list
   * @category Group
   * @returns array of broadcast list
   */
  public async getAllBroadcastList() {
    const chats = await evaluateAndReturn(this.page, () => WAPI.getAllChats());
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
    return evaluateAndReturn(
      this.page,
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
    return await evaluateAndReturn(this.page, () => WAPI.getAllContacts());
  }

  /**
   * Retrieves chat object of given contact id
   * @category Chat
   * @param contactId
   * @returns contact detial as promise
   */
  public async getChatById(contactId: string): Promise<Chat> {
    return evaluateAndReturn(
      this.page,
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
   * Retorna dados da imagem do contato
   * @category Contact
   * @param chatId Chat id
   * @returns url of the chat picture or undefined if there is no picture for the chat.
   */
  public async getProfilePicFromServer(
    chatId: string
  ): Promise<ProfilePicThumbObj> {
    return evaluateAndReturn(
      this.page,
      (chatId) => WAPI._profilePicfunc(chatId),
      chatId
    );
  }

  /**
   * Load more messages in chat object from server. Use this in a while loop
   * Depreciado em favor de {@link getMessages}
   *
   * @deprecated Depreciado em favor de getMessages
   * @category Chat
   * @param contactId
   * @returns contact detial as promise
   */
  public async loadEarlierMessages(contactId: string) {
    return evaluateAndReturn(
      this.page,
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
    return evaluateAndReturn(
      this.page,
      (contactId) => WAPI.getStatus(contactId),
      contactId
    );
  }

  /**
   * Checks if a number is a valid whatsapp number
   *
   * Deprecated in favor of checkNumberStatus
   * @deprecated Deprecated in favor of checkNumberStatus
   * @category Contact
   * @param contactId, you need to include the @c.us at the end.
   * @returns contact detial as promise
   */
  public async getNumberProfile(contactId: string) {
    return evaluateAndReturn(
      this.page,
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
    return await evaluateAndReturn(
      this.page,
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
    return evaluateAndReturn(this.page, () => WAPI.getAllUnreadMessages());
  }

  /**
   * Retrieves all new messages (where isNewMsg is true)
   * @category Chat
   * @returns List of messages
   * @deprecated Use getAllUnreadMessages
   */
  public async getAllNewMessages() {
    return await evaluateAndReturn(this.page, () => WAPI.getAllNewMessages());
  }

  /**
   * Retrieves all messages already loaded in a chat
   * For loading every message use loadAndGetAllMessagesInChat
   * Depreciado em favor de {@link getMessages}
   *
   * @deprecated Depreciado em favor de getMessages
   *
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
    return await evaluateAndReturn(
      this.page,
      ({ chatId, includeMe, includeNotifications }) =>
        WAPI.getAllMessagesInChat(chatId, includeMe, includeNotifications),
      { chatId, includeMe, includeNotifications }
    );
  }

  /**
   * Loads and Retrieves all Messages in a chat
   * Depreciado em favor de {@link getMessages}
   *
   * @deprecated Depreciado em favor de getMessages
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
    return await evaluateAndReturn(
      this.page,
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
    return await evaluateAndReturn(
      this.page,
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
    return await evaluateAndReturn(
      this.page,
      (chatId: string) => WAPI.getLastSeen(chatId),
      chatId
    );
  }
}
