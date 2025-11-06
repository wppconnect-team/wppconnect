"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusFind = void 0;
/**
 * SocketState are the possible states of connection between WhatsApp page and phone.
 */
var StatusFind;
(function (StatusFind) {
    /**
     * The browser was closed using the autoClose.
     */
    StatusFind["autocloseCalled"] = "autocloseCalled";
    /**
     * If the browser is closed this parameter is returned.
     */
    StatusFind["browserClose"] = "browserClose";
    /**
     * Client has disconnected in to mobile.
     */
    StatusFind["desconnectedMobile"] = "desconnectedMobile";
    /**
     * Client is ready to send and receive messages.
     */
    StatusFind["inChat"] = "inChat";
    /**
     * When the user is already logged in to the browser.
     */
    StatusFind["isLogged"] = "isLogged";
    /**
     * When the user is not connected to the browser, it is necessary to scan the QR code through the cell phone in the option WhatsApp Web.
     */
    StatusFind["notLogged"] = "notLogged";
    /**
     * Client couldn't connect to phone.
     */
    StatusFind["phoneNotConnected"] = "phoneNotConnected";
    /**
     * Failed to authenticate.
     */
    StatusFind["qrReadError"] = "qrReadError";
    /**
     * If the browser stops when the QR code scan is in progress, this parameter is returned.
     */
    StatusFind["qrReadFail"] = "qrReadFail";
    /**
     * If the user is not logged in, the QR code is passed on the terminal a callback is returned. After the correct reading by cell phone this parameter is returned.
     */
    StatusFind["qrReadSuccess"] = "qrReadSuccess";
    /**
     *  Client has disconnected in to wss.
     */
    StatusFind["serverClose"] = "serverClose";
})(StatusFind || (exports.StatusFind = StatusFind = {}));
