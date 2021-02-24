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

import { Id } from './id';

export interface Contact {
  formattedName: string;
  id: Id;
  isBusiness: boolean;
  isEnterprise: boolean;
  isHighLevelVerified: any;
  isMe: boolean;
  isMyContact: boolean;
  isPSA: boolean;
  isUser: boolean;
  isVerified: any;
  isWAContact: boolean;
  labels: any[];
  msgs: any;
  name: string;
  plaintextDisabled: boolean;
  profilePicThumbObj: {
    eurl: string;
    id: Id;
    img: string;
    imgFull: string;
    raw: any;
    tag: string;
  };
  pushname: string;
  sectionHeader: any;
  shortName: string;
  statusMute: boolean;
  type: string;
  verifiedLevel: any;
  verifiedName: any;
  /**
   * @deprecated This is unreliable. Use the method {@link Whatsapp.getChatIsOnline} instead.
   */
  isOnline: null | boolean;
  /**
   * @deprecated This is unreliable. Use the method {@link Whatsapp.getLastSeen} instead.
   */
  lastSeen: null | number | boolean;
}
