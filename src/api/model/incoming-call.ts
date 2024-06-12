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

export interface IncomingCall {
  /** alphanumeric ID of the call, can e.g. usable for hanging up */
  id: string;
  /** ID of the caller, can be used to message them directly */
  peerJid: string;
  /** Epoch timestamp (seconds) */
  offerTime: number;
  isVideo: boolean;
  isGroup: boolean;
  groupJid: string | null;
  canHandleLocally: boolean;
  outgoing: boolean;
  isSilenced: boolean;
  offerReceivedWhileOffline: boolean;
  webClientShouldHandle: boolean;
  participants: any[];
}
