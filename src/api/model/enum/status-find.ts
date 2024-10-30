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
export enum StatusFind {
  /**
   * The browser was closed using the autoClose.
   */
  autocloseCalled = 'autocloseCalled',
  /**
   * If the browser is closed this parameter is returned.
   */
  browserClose = 'browserClose',
  /**
   * Client has disconnected to the mobile device.
   */
  disconnectedMobile = 'disconnectedMobile',
  /**
   * Client is ready to send and receive messages.
   */
  inChat = 'inChat',
  /**
   * When the user is already logged in to the browser.
   */
  isLogged = 'isLogged',
  /**
   * When the user is not connected to the browser, it is necessary to scan the QR code through the cell phone in the option WhatsApp Web.
   */
  notLogged = 'notLogged',
  /**
   * Client couldn't connect to phone.
   */
  phoneNotConnected = 'phoneNotConnected',
  /**
   * Failed to authenticate.
   */
  qrReadError = 'qrReadError',
  /**
   * If the browser stops when the QR code scan is in progress, this parameter is returned.
   */
  qrReadFail = 'qrReadFail',
  /**
   * If the user is not logged in, the QR code is passed on the terminal a callback is returned. After the correct reading by cell phone this parameter is returned.
   */
  qrReadSuccess = 'qrReadSuccess',
  /**
   *  Client has disconnected in to wss.
   */
  serverClose = 'serverClose',
}
