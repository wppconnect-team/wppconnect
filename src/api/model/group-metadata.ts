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
  id: Wid;
  creation: number;
  owner: Wid;
  desc: string;
  descId: string;
  descTime: number;
  descOwner: Wid;
  restrict: boolean;
  announce: boolean;
  noFrequentlyForwarded: boolean;
  ephemeralDuration: number;
  size: number;
  support: boolean;
  suspended: boolean;
  terminated: boolean;
  isParentGroup: boolean;
  defaultSubgroup: boolean;
  displayCadminPromotion: boolean;
  participants: any[];
  pendingParticipants: any[];
}
