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

export enum SocketState {
  CONFLICT = 'CONFLICT',
  CONNECTED = 'CONNECTED',
  DEPRECATED_VERSION = 'DEPRECATED_VERSION',
  OPENING = 'OPENING',
  PAIRING = 'PAIRING',
  PROXYBLOCK = 'PROXYBLOCK',
  SMB_TOS_BLOCK = 'SMB_TOS_BLOCK',
  TIMEOUT = 'TIMEOUT',
  TOS_BLOCK = 'TOS_BLOCK',
  UNLAUNCHED = 'UNLAUNCHED',
  UNPAIRED = 'UNPAIRED',
  UNPAIRED_IDLE = 'UNPAIRED_IDLE',
}
export enum SocketStream {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RESUMING = 'RESUMING',
  SYNCING = 'SYNCING',
}
