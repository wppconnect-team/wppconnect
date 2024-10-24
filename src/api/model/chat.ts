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

import { Contact } from './contact';
import { GroupMetadata } from './group-metadata';
import { MessageId } from './message-id';
import { Presence } from './presence';
import { Wid } from './wid';

export interface Chat {
  id: Wid;
  pendingMsgs: boolean;
  lastReceivedKey: MessageId;
  t: number;
  unreadCount: number;
  /** whether the message was archived */
  archive: boolean;
  muteExpiration: number;
  name: string;
  /** Whatsapp provides us with built-in spam detection and this is its indicator */
  notSpam: boolean;
  pin: number;
  msgs: null;
  kind: string;
  isAnnounceGrpRestrict: boolean;
  ephemeralDuration: number;
  /** whether the chat is visually open in WhatsApp Web (see `UILayer.openChat()`) */
  hasChatBeenOpened: boolean;
  unreadMentionCount: number;
  hasUnreadMention: boolean;
  archiveAtMentionViewedInDrawer: boolean;
  isBroadcast: boolean;
  isGroup: boolean;
  isReadOnly: boolean;
  isUser: boolean;
  contact: Contact;
  groupMetadata: GroupMetadata;
  presence: Presence;
  restricted: boolean;
  /** if you can send messages into the chat without having to be an admin (refers to group chats, see the `isGroup` attribute) */
  hasOpened: boolean;
}
