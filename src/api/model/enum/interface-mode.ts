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

export enum InterfaceMode {
  /**
   * QR code page.
   */
  QR = 'QR',
  /**
   * Chat page.
   */
  MAIN = 'MAIN',
  /**
   * Loading page, waiting data from smartphone.
   */
  SYNCING = 'SYNCING',
  /**
   * Offline page, when there are no internet.
   */
  OFFLINE = 'OFFLINE',
  /**
   * Conflic page, when there are another whatsapp web openned.
   */
  CONFLICT = 'CONFLICT',
  /**
   * Blocked page, by proxy.
   */
  PROXYBLOCK = 'PROXYBLOCK',
  /**
   * Blocked page.
   */
  TOS_BLOCK = 'TOS_BLOCK',
  /**
   * Blocked page.
   */
  SMB_TOS_BLOCK = 'SMB_TOS_BLOCK',
  /**
   * Deprecated page.
   */
  DEPRECATED_VERSION = 'DEPRECATED_VERSION',
}
