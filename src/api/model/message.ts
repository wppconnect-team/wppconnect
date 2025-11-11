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

import { Wid } from './wid';
import { Chat } from './chat';
import { Contact } from './contact';
import { MessageType } from './enum';

/** available during the `onMessage` event */
export interface Message {
  id: string;
  /** exists when it is a displayable message (i.e. `MessageType.CHAT` / `"chat"`); the body is not included in notifications like group removal, etc. (`gp2`) */
  body?: string;
  type: MessageType;
  /**
   * When type is GP2: {@link GroupNotificationType}
   */
  subtype: string;
  t: number;
  /** profile alias chosen by the sender */
  notifyName: string;
  from: string;
  to: string;
  author: string;
  self: string;
  ack: number;
  invis: boolean;
  isNewMsg: boolean;
  star: boolean;
  kicNotified: boolean;
  recvFresh: boolean;
  interactiveAnnotations: any[];
  clientUrl: string;
  deprecatedMms3Url: string;
  directPath: string;
  mimetype: string;
  filehash: string;
  uploadhash: string;
  size: number;
  mediaKey: string;
  mediaKeyTimestamp: number;
  width: number;
  height: number;
  /** exists when `type` is set to {@link MessageType.VIDEO} || {@link MessageType.IMAGE} */
  isViewOnce?: boolean;
  broadcast: boolean;
  /** array of the users who were mentioned in this message; given in the serialized format: "xxxxxxxxxx@c.us" / "xxxxxxxxxx@g.us" */
  mentionedJidList: string[];
  isVcardOverMmsDocument: boolean;
  /** exists when `type` is set to {@link MessageType.VCARD}; it is the name of the sent contact */
  vcardFormattedName?: string;
  isForwarded: boolean;
  hasReaction: boolean;
  productHeaderImageRejected: boolean;
  lastPlaybackProgress: number;
  isDynamicReplyButtonsMsg: boolean;
  isCarouselCard: boolean;
  parentMsgId: any; //TODO: specify the type, `null` spotted often
  isMdHistoryMsg: boolean;
  stickerSentTs: number;
  isAvatar: boolean;
  lastUpdateFromServerTs: number;
  invokedBotWid: null | Wid;
  bizBotType: null; //TODO: amend this type definition
  botResponseTargetId: null; //TODO: amend this type definition
  botPluginType: null; //TODO: amend this type definition
  botPluginReferenceIndex: null; //TODO: amend this type definition
  botPluginSearchProvider: null; //TODO: amend this type definition
  botPluginSearchUrl: null; //TODO: amend this type definition
  botPluginSearchQuery: null; //TODO: amend this type definition
  botPluginMaybeParent: boolean;
  botReelPluginThumbnailCdnUrl: null; //TODO: amend this type definition
  botMsgBodyType: null; //TODO: amend this type definition
  requiresDirectConnection: null; //TODO: amend this type definition
  bizContentPlaceholderType: null; //TODO: amend this type definition
  hostedBizEncStateMismatch: boolean;
  senderOrRecipientAccountTypeHosted: boolean;
  placeholderCreatedWhenAccountIsHosted: boolean;
  labels?: any[];
  sender: Contact;
  timestamp: number;
  content: string;
  isGroupMsg: boolean;
  isMMS: boolean;
  isMedia: boolean;
  isNotification: boolean;
  isPSA: boolean;
  /**
   * @deprecated Use `getChat` to get chat details
   */
  chat: Chat;
  lastSeen: null | number | boolean;
  /** if `string`, it is serialized: `"user@server"` */
  chatId: string | Wid;
  fromMe: boolean;
  /**
   * @deprecated Use the `quotedMsgId` attribute in `getMessageById` to get the message details
   */
  quotedMsgObj: null;
  quotedMsgId: null;
  mediaData: MediaData;
  recipients?: string[];
  /** exists for image and video types {@link GroupNotificationType} */
  caption?: string;
}

export interface MediaData {
  type: string;
  mediaStage: string;
  animationDuration: number;
  animatedAsNewMsg: boolean;
  _swStreamingSupported: boolean;
  _listeningToSwSupport: boolean;
}
