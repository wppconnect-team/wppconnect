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

/**
 * SocketState are the possible states of connection between WhatsApp page and phone.
 */
export enum SocketState {
  /**
   * Conflic page, when there are another whatsapp web openned.
   */
  CONFLICT = 'CONFLICT',
  /**
   * When the whatsapp web is ready.
   */
  CONNECTED = 'CONNECTED',
  /**
   * Deprecated page.
   */
  DEPRECATED_VERSION = 'DEPRECATED_VERSION',
  /**
   * When the whatsapp web page is loading.
   */
  OPENING = 'OPENING',
  /**
   * When the whatsapp web is connecting to smartphone after QR code scan.
   */
  PAIRING = 'PAIRING',
  /**
   * Blocked page, by proxy.
   */
  PROXYBLOCK = 'PROXYBLOCK',
  /**
   * Blocked page.
   */
  SMB_TOS_BLOCK = 'SMB_TOS_BLOCK',
  /**
   * When the whatsapp web couldn't connect to smartphone.
   */
  TIMEOUT = 'TIMEOUT',
  /**
   * Blocked page.
   */
  TOS_BLOCK = 'TOS_BLOCK',
  /**
   * When the whatsapp web page is initialized yet.
   */
  UNLAUNCHED = 'UNLAUNCHED',
  /**
   * Disconnected page, waiting for QRCode scan
   */
  UNPAIRED = 'UNPAIRED',
  /**
   * Disconnected page with expired QRCode
   */
  UNPAIRED_IDLE = 'UNPAIRED_IDLE',
}

/**
 * SocketStream are the possible states of connection between WhatsApp page and WhatsApp servers.
 */
export enum SocketStream {
  /**
   * Connected with WhatsApp servers
   */
  CONNECTED = 'CONNECTED',
  /**
   * Disconnected from WhatsApp servers
   */
  DISCONNECTED = 'DISCONNECTED',
  /**
   * Reconnecting to WhatsApp servers
   */
  RESUMING = 'RESUMING',
  /**
   * Receiving data from WhatsApp servers
   */
  SYNCING = 'SYNCING',
}
