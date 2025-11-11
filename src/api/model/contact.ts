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

import { ProfilePicThumbObj } from './profile-pic-thumb';

/**
 * Data info of contact
 */
export interface Contact {
  formattedName: string;
  id: string;
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

  /**
   * Name of the contact in your agenda
   */
  name?: string;
  plaintextDisabled: boolean;

  /**
   * @deprecated Deprecated in favor of the function `getProfilePicFromServer` {@link getProfilePicFromServer}
   */
  profilePicThumbObj: ProfilePicThumbObj;

  /**
   * Name defined by common contact
   */
  pushname?: string;
  sectionHeader: any;
  shortName: string;
  statusMute: boolean;
  type: string;
  verifiedLevel: any;

  /**
   * Name defined by business contact
   */
  verifiedName?: any;
}
