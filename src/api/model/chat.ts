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
import { Id } from './id';

export interface Chat {
  id: Id;
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
  contact: Contact;
  groupMetadata: GroupMetadata;
  presence: Presence;
  /**
   * @deprecated This is unreliable. Use the method {@link Whatsapp.getChatIsOnline} instead.
   */
  isOnline: null | boolean;
  /**
   * @deprecated This is unreliable. Use the method {@link Whatsapp.getLastSeen} instead.
   */
  lastSeen: null | number | boolean;
}

export interface ProfilePicThumbObj {
  eurl: string;
  id: Id;
  img: string;
  imgFull: string;
  raw: null;
  tag: string;
}

export interface LastReceivedKey {
  fromMe: boolean;
  remote: Id;
  id: string;
  _serialized: string;
}

export interface Presence {
  id: Id;
  chatstates: any[];
}
