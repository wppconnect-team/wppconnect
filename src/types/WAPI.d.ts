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

import {
  Chat,
  Contact,
  ContactStatus,
  GetMessagesParam,
  GroupCreation,
  HostDevice,
  Id,
  Message,
  PartialMessage,
  PresenceEvent,
  ProfilePicThumbObj,
  SendFileResult,
  SendLinkResult,
  SendPttResult,
  SendStickerResult,
  WhatsappProfile,
} from '../api/model';
import { SessionToken } from '../token-store';

interface WAPI {
  allNewMessagesListener: (callback: Function) => void;
  archiveChat: (chatId: string, option: boolean) => boolean;
  arrayBufferToBase64: (buffer: ArrayBuffer) => string;
  checkNumberStatus: (contactId: string) => Promise<WhatsappProfile>;
  downloadFile: (data: string) => Promise<string | boolean>;
  forwardMessage: (
    toChatId: string | Wid,
    msgId: string | MsgKey,
    options?: {
      displayCaptionText?: boolean;
      multicast?: boolean;
    }
  ) => boolean;
  getAllChats: () => Chat[];
  getAllChatsWithMessages: (withNewMessageOnly?: boolean) => Chat[];
  getAllChatsWithNewMsg: () => Chat[];
  getAllContacts: () => Contact[];
  getAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) => Message[];
  getAllNewMessages: () => Message[];
  getAllUnreadMessages: () => PartialMessage[];
  getBatteryLevel: () => number;
  getBusinessProfilesProducts: (to: string) => any;
  getOrderbyMsg: (messageId: string) => any;
  getChat: (contactId: string) => Chat;
  getChatById: (contactId: string) => Chat;
  getChatIsOnline: (chatId: string) => Promise<boolean>;
  getLastSeen: (chatId: string) => Promise<number | boolean>;
  getContact: (contactId: string) => Contact;
  getGroupParticipantIDs: (groupId: string) => Id[];
  getHost: () => HostDevice;
  getWid: () => string;
  getListMute: (type?: string) => object;
  getMessageById: (messageId: string) => Promise<Message>;
  getMessages: (chatId: string, params: GetMessagesParam) => Promise<Message[]>;
  getNumberProfile: (contactId: string) => WhatsappProfile;
  getSessionTokenBrowser: (removePath?: boolean) => SessionToken;
  getTheme: () => string;
  getUnreadMessages: (
    includeMe: boolean,
    includeNotifications: boolean,
    useUnreadCount: boolean
  ) => any;
  getWAVersion: () => string;
  isConnected: () => boolean;
  isLoggedIn: () => boolean;
  isRegistered: () => boolean;
  joinGroup: (groupId: string) => Promise<string | boolean>;
  leaveGroup: (groupId: string) => any;
  loadAndGetAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) => Message[];
  loadEarlierMessages: (contactId: string) => Message[];
  logout: () => Promise<boolean>;
  onAddedToGroup: (callback: Function) => any;
  onIncomingCall: (callback: Function) => any;
  onInterfaceChange: (callback: Function) => void;
  onLiveLocation: (callback: Function) => any;
  onNotificationMessage: (callback: (message: Message) => void) => any;
  onParticipantsChanged: (groupId: string, callback: Function) => any;
  onStateChange: (callback: Function) => void;
  onStreamChange: (callback: Function) => void;
  onPresenceChanged: (callback: (presence: PresenceEvent) => void) => void;
  pinChat: (
    chatId: string,
    option: boolean,
    nonExistent?: boolean
  ) => Promise<object>;
  sendChatstate: (chatState: string, chatId: string) => void;
  sendFile: (
    base64: string,
    to: string,
    filename: string,
    caption: string,
    type?: string,
    quotedMessageId?: string,
    isViewOnce?: boolean
  ) => Promise<SendFileResult>;
  sendImage: (
    imgBase64: string,
    to: string,
    filename: string,
    caption?: string,
    quotedMessageId?: string,
    isViewOnce?: boolean
  ) => Promise<SendFileResult>;
  sendImageWithProduct: (
    base64: string,
    to: string,
    caption: string,
    bizNumber: string,
    productId: string
  ) => any;
  sendLinkPreview: (
    chatId: string,
    url: string,
    title: string
  ) => Promise<SendLinkResult>;
  sendLocation: (
    to: string,
    latitude: string,
    longitude: string,
    title: string
  ) => Promise<object>;
  sendMessage: (to: string, content: string) => Promise<string>;
  sendMessageOptions: (
    chat: any,
    content: any,
    options?: any
  ) => Promise<string>;
  sendMessageWithThumb: (
    thumb: string,
    url: string,
    title: string,
    description: string,
    chatId: string
  ) => void;
  sendMute: (id: string, time: number, type: string) => Promise<object>;
  sendPtt: (
    base64: string,
    to: string,
    filename: string,
    caption: string,
    done: () => void,
    quotedMessageId?: string
  ) => Promise<SendPttResult>;
  sendVideoAsGif: (
    base64: string,
    to: string,
    filename: string,
    caption: string
  ) => void;
  setMessagesAdminsOnly: (chatId: string, option: boolean) => boolean;
  setMyName: (name: string) => void;
  setOnlinePresence: (online: boolean) => void;
  setProfilePic: (path: string, to?: string) => Promise<boolean>;
  setTemporaryMessages: (chatId: string, value: string) => Promise<boolean>;
  setTheme: (theme?: string) => boolean;
  starMessages: (
    messagesId: string[] | string,
    star: boolean
  ) => Promise<number>;
  startPhoneWatchdog: (interval: number) => void;
  stopPhoneWatchdog: () => void;
  subscribePresence: (id: string | string[]) => Promise<number>;
  takeOver: () => boolean;
  unsubscribePresence: (id: string | string[]) => Promise<number>;
  waitNewAcknowledgements: (callback: Function) => void;
  waitNewMessages: (rmCallback: boolean, callback: Function) => void;
  _profilePicfunc: (contactId: string) => Promise<ProfilePicThumbObj>;
  _serializeChatObj: (chat: any) => any;
  processMessageObj: (
    messageObj: any,
    includeMe: boolean,
    includeNotifications: boolean
  ) => any;
}

declare global {
  interface Window {
    WAPI: WAPI;
  }
  const WAPI: WAPI;
}

interface PixParams {
  keyType: 'CNPJ' | 'CPF' | 'PHONE' | 'EMAIL' | 'EVP';
  name: string;
  key: string;
  instructions?: string;
}
