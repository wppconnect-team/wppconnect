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

export interface GroupMetadata {
  /** unique identifier for the group */
  id: Wid;
  /** timestamp of when the group was created */
  creation: number;
  owner: Wid;
  /** title/name of the group */
  subject: string;
  subjectTime: number;
  /** description of the group */
  desc: string;
  descId: string;
  descTime: number;
  descOwner: Wid;
  restrict: boolean;
  /** whether it is an announcement channel of a community */
  announce: boolean;
  noFrequentlyForwarded: boolean;
  ephemeralDuration: number;
  membershipApprovalMode: boolean;
  memberAddMode: 'admin_add' | string; //TODO: complete the union type and then remove `strong`
  reportToAdminMode: boolean;
  /** current amount of members including admins */
  size: number;
  support: boolean;
  suspended: boolean;
  terminated: boolean;
  uniqueShortNameMap: Object; //TODO: type is too generic
  isLidAddressingMode: boolean;
  isParentGroup: boolean;
  isParentGroupClosed: boolean;
  /** serialized chat ID of the parent group (community) */
  parentGroup: string | undefined;
  defaultSubgroup: boolean;
  generalSubgroup: boolean;
  generalChatAutoAddDisabled: boolean;
  allowNonAdminSubGroupCreation: boolean;
  lastActivityTimestamp: number;
  lastSeenActivityTimestamp: number;
  incognito: boolean;
  hasCapi: boolean;
  displayCadminPromotion: boolean;
  /** Current members of the group. See `pastParticipants` for former members. */
  participants: {
    id: Wid;
    isAdmin: boolean;
    isSuperAdmin: boolean;
  }[];
  /** members who applied for membership but still need admin approval */
  pendingParticipants: any[];
  /** former members who left the group or were kicked out */
  pastParticipants: {
    id: Wid;
    /** UNIX timestamp in seconds of when the leaving occurred */
    leaveTs: number;
    /** was leaving volumtary (`"Left"`) or forceful (`"Removed"`) */
    leaveReason: 'Left' | 'Removed';
  }[];
  membershipApprovalRequests: any[];
  subgroupSuggestions: any[];
}
