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
import {
  Chat,
  Contact,
  ContactStatus,
  ProfilePicThumbObj,
  WhatsappProfile,
  Wid,
} from '../model';
import { SenderLayer } from './sender.layer';
import { ChatListOptions } from '@wppconnect/wa-js/dist/chat';

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
      return await this.page
        .evaluate(() => {
          if (window.localStorage) {
            return {
              WABrowserId:
                window.localStorage.getItem('WABrowserId') || 'MultiDevice',
              WASecretBundle: 'MultiDevice',
              WAToken1: 'MultiDevice',
              WAToken2: 'MultiDevice',
            };
          }
          return null;
        })
        .catch(() => null);
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
   * Deprecated in favor of {@link listChats}
   *
   * @category Chat
   * @returns array of [Chat]
   * @deprecated Deprecated in favor of listChats.
   */
  public async getAllChats(withNewMessageOnly = false) {
    this.logger.warn(
      'Deprecated: This function [getAllChats] is deprecated in favor of the listChats function. Please update your code accordingly.'
    );
    if (withNewMessageOnly) {
      return evaluateAndReturn(this.page, () => WAPI.getAllChatsWithNewMsg());
    } else {
      return evaluateAndReturn(this.page, () => WAPI.getAllChats());
    }
  }

  /**
   * Return list of chats
   *  * @example
   * ```javascript
   * // All chats
   * const chats = await client.listChats();
   *
   * // Some chats
   * const chats = client.listChats({count: 20});
   *
   * // 20 chats before specific chat
   * const chats = client.listChats({count: 20, direction: 'before', id: '[number]@c.us'});
   *
   * // Only users chats
   * const chats = await client.listChats({onlyUsers: true});
   *
   * // Only groups chats
   * const chats = await client.listChats({onlyGroups: true});
   *
   * // Only with label Text
   * const chats = await client.listChats({withLabels: ['Test']});
   *
   * // Only with label id
   * const chats = await client.listChats({withLabels: ['1']});
   *
   * // Only with label with one of text or id
   * const chats = await client.listChats({withLabels: ['Alfa','5']});
   * ```
   * @category Chat
   * @returns array of [Chat]
   */
  public async listChats(options?: ChatListOptions): Promise<Chat[]> {
    return await evaluateAndReturn(
      this.page,
      async ({ options }) => {
        const chats = await WPP.chat.list(options);

        const serialized = chats.map((c) => WAPI._serializeChatObj(c));
        return serialized;
      },
      { options }
    );
  }

  /**
   * Checks if a number is a valid WA number
   * @category Contact
   * @param contactId, you need to include the @c.us at the end.
   * @returns contact details as promise
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
   * Deprecated in favor of {@link listChats}
   *
   * @category Chat
   * @returns array of [Chat]
   * @deprecated Deprecated in favor of listChats.
   */
  public async getAllChatsWithMessages(withNewMessageOnly = false) {
    this.logger.warn(
      'Deprecated: This function [getAllChatsWithMessages] is deprecated in favor of the listChats function. Please update your code accordingly.'
    );
    return evaluateAndReturn(
      this.page,
      (withNewMessageOnly: boolean) =>
        WAPI.getAllChatsWithMessages(withNewMessageOnly),
      withNewMessageOnly
    );
  }

  /**
   * Retrieve all groups
   * Deprecated in favor of {@link listChats}
   *
   * @category Group
   * @returns array of groups
   * @deprecated Deprecated in favor of listChats.
   */
  public async getAllGroups(withNewMessagesOnly = false): Promise<Chat[]> {
    this.logger.warn(
      'Deprecated: This function [getAllGroups] is deprecated in favor of the listChats function. Please update your code accordingly.'
    );
    return await evaluateAndReturn(
      this.page,
      async ({ withNewMessagesOnly }) => {
        const chats = await WPP.chat.list({
          onlyGroups: true,
          onlyWithUnreadMessage: withNewMessagesOnly,
        });

        const groups = await Promise.all(
          chats.map((c) => WPP.group.ensureGroup(c.id))
        );

        return groups.map((g) => WAPI._serializeChatObj(g));
      },
      { withNewMessagesOnly }
    );
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
   * @returns contact details as promise
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
   * @returns chat details as promise
   */
  public async getChatById(contactId: string | Wid): Promise<Chat> {
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
   * @returns chat details as promise
   * @deprecated
   */
  public async getChat(contactId: string | Wid) {
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
   * @returns contact details as promise
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
  public async getStatus(contactId: string): Promise<ContactStatus> {
    return await evaluateAndReturn(
      this.page,
      async (contactId) => {
        const status = await WPP.contact.getStatus(contactId);

        return {
          id: contactId,
          status: (status as any)?.status || status,
        };
      },
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
   * @returns contact details as promise
   */
  public async getNumberProfile(contactId: string) {
    this.log(
      'warn',
      'The getNumberProfile function is deprecated, please use checkNumberStatus'
    );
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

  /**
   * Get the platform message from message ID
   *
   * The platform can be:
   * android
   * iphone
   * web
   * unknown
   * @category Chat
   * @param chatId chat id: xxxxx@c.us
   */
  public async getPlatformFromMessage(msgId: string): Promise<string> {
    return await evaluateAndReturn(
      this.page,
      (msgId: string) => WPP.chat.getPlatformFromMessage(msgId),
      msgId
    );
  }

  /**
   * Get the reactions of a message
   *
   * @category Chat
   */
  public async getReactions(msgId: string): Promise<{
    reactionByMe: {
      id: any;
      orphan: number;
      msgId: any;
      reactionText: string;
      read: boolean;
      senderUserJid: string;
      timestamp: number;
    };
    reactions: {
      aggregateEmoji: string;
      hasReactionByMe: boolean;
      senders: {
        id: any;
        orphan: number;
        msgId: any;
        reactionText: string;
        read: boolean;
        senderUserJid: string;
        timestamp: number;
      }[];
    }[];
  }> {
    return await evaluateAndReturn(
      this.page,
      (msgId: string) => WPP.chat.getReactions(msgId),
      msgId
    );
  }

  /**
   * Get the votes of a poll message
   *
   * @category Chat
   */
  public async getVotes(msgId: string): Promise<{
    msgId: any;
    chatId: Wid;
    votes: {
      selectedOptions: number[];
      timestamp: number;
      sender: Wid;
    }[];
  }> {
    return await evaluateAndReturn(
      this.page,
      (msgId: string) => WPP.chat.getVotes(msgId),
      msgId
    );
  }

  /**
   * Get the max number of participants for a group
   *
   * @category Group
   */
  public async getGroupSizeLimit(): Promise<number> {
    return await evaluateAndReturn(this.page, () =>
      WPP.group.getGroupSizeLimit()
    );
  }

  /**
   * Get info of your sended order
   *
   * @example
   * ```javascript
   * const orderInfo = await client.getOrder('<orderId>');
   * ```
   * @category Order
   * @return Your order
   */
  public async getOrder(msgId: string) {
    return evaluateAndReturn(this.page, (msgId) => WPP.order.get(msgId), msgId);
  }

  /**
   * Get all commons groups for the contact
   *
   * @example
   * ```javascript
   * const groups_ids = await client.getCommonGroups('[number]@c.us');
   * ```
   *
   * @category Group
   * @param groupId Group ID ('000000-000000@g.us')
   * @returns Promise
   */
  public async getCommonGroups(wid: string) {
    return await evaluateAndReturn(
      this.page,
      ({ wid }) => WPP.contact.getCommonGroups(wid),
      { wid }
    );
  }
}
