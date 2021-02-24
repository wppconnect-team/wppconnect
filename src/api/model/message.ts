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

export interface Message {
  id: string;
  body: string;
  type: string;
  t: number;
  notifyName: string;
  from: string;
  to: string;
  author: string;
  self: string;
  ack: number;
  invis: boolean;
  isNewMsg: boolean;
  star: boolean;
  recvFresh: boolean;
  interactiveAnnotations: any[];
  clientUrl: string;
  directPath: string;
  mimetype: string;
  filehash: string;
  uploadhash: string;
  size: number;
  mediaKey: string;
  mediaKeyTimestamp: number;
  width: number;
  height: number;
  broadcast: boolean;
  mentionedJidList: any[];
  isForwarded: boolean;
  labels: any[];
  sender: Sender;
  timestamp: number;
  content: string;
  isGroupMsg: boolean;
  isMMS: boolean;
  isMedia: boolean;
  isNotification: boolean;
  isPSA: boolean;
  chat: {
    id: string;
    pendingMsgs: boolean;
    lastReceivedKey: LastReceivedKey;
    t: number;
    unreadCount: number;
    archive: boolean;
    isReadOnly: boolean;
    muteExpiration: number;
    name: string;
    notSpam: boolean;
    pin: number;
    msgs: null;
    kind: string;
    isGroup: boolean;
    contact: Sender;
    groupMetadata: null;
    presence: Presence;
    /**
     * @deprecated This is unreliable. Use the method {@link Whatsapp.getChatIsOnline} instead.
     */
    isOnline: null | boolean;
    /**
     * @deprecated This is unreliable. Use the method {@link Whatsapp.getLastSeen} instead.
     */
    lastSeen: null | number | boolean;
  };
  /**
   * @deprecated This is unreliable. Use the method {@link Whatsapp.getChatIsOnline} instead.
   */
  isOnline: null | boolean;
  /**
   * @deprecated This is unreliable. Use the method {@link Whatsapp.getLastSeen} instead.
   */
  lastSeen: null | number | boolean;
  chatId: string;
  quotedMsgObj: null;
  mediaData: MediaData;
}

export interface Sender {
  id: string;
  name: string;
  shortName: string;
  pushname: string;
  type: string;
  isBusiness: boolean;
  isEnterprise: boolean;
  statusMute: boolean;
  labels: any[];
  formattedName: string;
  isMe: boolean;
  isMyContact: boolean;
  isPSA: boolean;
  isUser: boolean;
  isWAContact: boolean;
  profilePicThumbObj: ProfilePicThumbObj;
  msgs: null;
}

export interface ProfilePicThumbObj {
  eurl: string;
  id: string;
  img: string;
  imgFull: string;
  raw: null;
  tag: string;
}

export interface LastReceivedKey {
  fromMe: boolean;
  remote: string;
  id: string;
  _serialized: string;
}

export interface Presence {
  id: string;
  chatstates: any[];
}

export interface MediaData {
  type: string;
  mediaStage: string;
  animationDuration: number;
  animatedAsNewMsg: boolean;
  _swStreamingSupported: boolean;
  _listeningToSwSupport: boolean;
}
