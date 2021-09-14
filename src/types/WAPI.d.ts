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
  addParticipant: (groupId: string, contactId: string | string[]) => boolean;
  allNewMessagesListener: (callback: Function) => void;
  archiveChat: (chatId: string, option: boolean) => boolean;
  arrayBufferToBase64: (buffer: ArrayBuffer) => string;
  blockContact: (messageId: string) => boolean;
  checkNumberStatus: (contactId: string) => Promise<WhatsappProfile>;
  clearChat: (chatId: string, keepStarred: boolean) => void;
  createGroup: (
    groupName: string,
    contactId: string | string[]
  ) => GroupCreation;
  deleteConversation: (chatId: string) => boolean;
  deleteMessages: (
    contactId: string,
    messageId: string[] | string,
    onlyLocal: boolean
  ) => Promise<boolean>;
  demoteParticipant: (groupId: string, contactId: string | string[]) => void;
  downloadFile: (data: string) => Promise<string | boolean>;
  downloadMedia: (messageId: string) => Promise<string>;
  forwardMessages: (
    to: string,
    messages: string | string[],
    skipMyMessages: boolean
  ) => string[];
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
  getBlockList: () => Contact[];
  getBusinessProfilesProducts: (to: string) => any;
  getOrderbyMsg: (messageId: string) => any;
  getChat: (contactId: string) => Chat;
  getChatById: (contactId: string) => Chat;
  getChatIsOnline: (chatId: string) => Promise<boolean>;
  getLastSeen: (chatId: string) => Promise<number | boolean>;
  getContact: (contactId: string) => Contact;
  getGroupAdmins: (groupId: string) => Contact[];
  getGroupInfoFromInviteLink: (inviteCode: string) => Promise<string | boolean>;
  getGroupInviteLink: (chatId: string) => Promise<string>;
  getGroupParticipantIDs: (groupId: string) => Id[];
  getHost: () => HostDevice;
  getWid: () => string;
  getListMute: (type?: string) => object;
  getMessageById: (messageId: string) => Promise<Message>;
  getMessages: (chatId: string, params: GetMessagesParam) => Promise<Message[]>;
  getNumberProfile: (contactId: string) => WhatsappProfile;
  getSessionTokenBrowser: (removePath?: boolean) => SessionToken;
  getStatus: (contactId: string) => ContactStatus;
  getTheme: () => string;
  getUnreadMessages: (
    includeMe: boolean,
    includeNotifications: boolean,
    useUnreadCount: boolean
  ) => any;
  getWAVersion: () => string;
  isConnected: () => boolean;
  isLoggedIn: () => boolean;
  joinGroup: (groupId: string) => Promise<string | boolean>;
  killServiceWorker: () => boolean;
  leaveGroup: (groupId: string) => any;
  loadAndGetAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) => Message[];
  loadEarlierMessages: (contactId: string) => Message[];
  logout: () => Promise<boolean>;
  markUnseenMessage: (messageId: string) => boolean;
  onAddedToGroup: (callback: Function) => any;
  onIncomingCall: (callback: Function) => any;
  onInterfaceChange: (callback: Function) => void;
  onLiveLocation: (callback: Function) => any;
  onNotificationMessage: (callback: (message: Message) => void) => any;
  onParticipantsChanged: (groupId: string, callback: Function) => any;
  onStateChange: (callback: Function) => void;
  onStreamChange: (callback: Function) => void;
  onPresenceChanged: (callback: (presence: PresenceEvent) => void) => void;
  openChat: (chatId: string) => boolean;
  openChatAt: (
    chatId: string,
    messageId: string
  ) => { wasVisible: boolean; alignAt: string };
  pinChat: (
    chatId: string,
    option: boolean,
    nonExistent?: boolean
  ) => Promise<object>;
  promoteParticipant: (groupId: string, contactId: string | string[]) => void;
  removeParticipant: (groupId: string, contactId: string | string[]) => void;
  reply: (to: string, content: string, quotedMsg: string) => Promise<string>;
  rejectCall: (callId?: string) => Promise<number>;
  revokeGroupInviteLink: (chatId: string) => Promise<string>;
  restartService: () => boolean;
  sendChatstate: (chatState: string, chatId: string) => void;
  sendContactVcard: (
    to: string,
    contact: string,
    name?: string
  ) => Promise<object>;
  sendContactVcardList: (
    to: string,
    contacts: (string | { id: string; name: string })[]
  ) => Promise<object>;
  sendFile: (
    base64: string,
    to: string,
    filename: string,
    caption: string,
    type?: string
  ) => Promise<SendFileResult>;
  sendImage: (
    imgBase64: string,
    to: string,
    filename: string,
    caption?: string
  ) => Promise<SendFileResult>;
  sendImageAsSticker: (
    webpBase64: string,
    to: string,
    metadata?: any,
    type?: string
  ) => Promise<SendStickerResult>;
  sendImageAsStickerGif: (
    webpBase64: string,
    to: string,
    metadata?: any
  ) => Promise<SendStickerResult>;
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
  sendMessageMentioned: (...args: any) => any;
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
    caption: string
  ) => Promise<SendPttResult>;
  sendVideoAsGif: (
    base64: string,
    to: string,
    filename: string,
    caption: string
  ) => void;
  setGroupDescription: (
    groupId: string,
    description: string
  ) => Promise<object>;
  setGroupProperty: (
    groupId: string,
    property: string,
    value: boolean
  ) => Promise<object>;
  setGroupSubject: (groupId: string, title: string) => Promise<object>;
  setMessagesAdminsOnly: (chatId: string, option: boolean) => boolean;
  setMyName: (name: string) => void;
  setMyStatus: (to: string) => void;
  setOnlinePresence: (online: boolean) => void;
  setProfilePic: (path: string, to?: string) => Promise<boolean>;
  setTemporaryMessages: (chatId: string, value: string) => Promise<boolean>;
  setTheme: (theme?: string) => boolean;
  starMessages: (
    messagesId: string[] | string,
    star: boolean
  ) => Promise<number>;
  startPhoneWatchdog: (interval: number) => void;
  startTyping: (to: string) => void;
  stopPhoneWatchdog: () => void;
  stopTyping: (to: string) => void;
  subscribePresence: (id: string | string[]) => Promise<number>;
  takeOver: () => boolean;
  unsubscribePresence: (id: string | string[]) => Promise<number>;
  unblockContact: (messageId: string) => boolean;
  waitForStore: (store: string | string[], callback?: Function) => Promise<any>;
  waitNewAcknowledgements: (callback: Function) => void;
  waitNewMessages: (rmCallback: boolean, callback: Function) => void;
  sendSeen: (to: string) => void;
  _profilePicfunc: (contactId: string) => Promise<ProfilePicThumbObj>;
}

declare global {
  interface Window {
    WAPI: WAPI;
  }
  const WAPI: WAPI;
}
