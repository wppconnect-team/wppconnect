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
exports.SocketStream = exports.SocketState = void 0;
/**
 * SocketState are the possible states of connection between WhatsApp page and phone.
 */
var SocketState;
(function (SocketState) {
    /**
     * Conflic page, when there are another whatsapp web openned.
     */
    SocketState["CONFLICT"] = "CONFLICT";
    /**
     * When the whatsapp web is ready.
     */
    SocketState["CONNECTED"] = "CONNECTED";
    /**
     * Deprecated page.
     */
    SocketState["DEPRECATED_VERSION"] = "DEPRECATED_VERSION";
    /**
     * When the whatsapp web page is loading.
     */
    SocketState["OPENING"] = "OPENING";
    /**
     * When the whatsapp web is connecting to smartphone after QR code scan.
     */
    SocketState["PAIRING"] = "PAIRING";
    /**
     * Blocked page, by proxy.
     */
    SocketState["PROXYBLOCK"] = "PROXYBLOCK";
    /**
     * Blocked page.
     */
    SocketState["SMB_TOS_BLOCK"] = "SMB_TOS_BLOCK";
    /**
     * When the whatsapp web couldn't connect to smartphone.
     */
    SocketState["TIMEOUT"] = "TIMEOUT";
    /**
     * Blocked page.
     */
    SocketState["TOS_BLOCK"] = "TOS_BLOCK";
    /**
     * When the whatsapp web page is initialized yet.
     */
    SocketState["UNLAUNCHED"] = "UNLAUNCHED";
    /**
     * Disconnected page, waiting for QRCode scan
     */
    SocketState["UNPAIRED"] = "UNPAIRED";
    /**
     * Disconnected page with expired QRCode
     */
    SocketState["UNPAIRED_IDLE"] = "UNPAIRED_IDLE";
})(SocketState || (exports.SocketState = SocketState = {}));
/**
 * SocketStream are the possible states of connection between WhatsApp page and WhatsApp servers.
 */
var SocketStream;
(function (SocketStream) {
    /**
     * Connected with WhatsApp servers
     */
    SocketStream["CONNECTED"] = "CONNECTED";
    /**
     * Disconnected from WhatsApp servers
     */
    SocketStream["DISCONNECTED"] = "DISCONNECTED";
    /**
     * Reconnecting to WhatsApp servers
     */
    SocketStream["RESUMING"] = "RESUMING";
    /**
     * Receiving data from WhatsApp servers
     */
    SocketStream["SYNCING"] = "SYNCING";
})(SocketStream || (exports.SocketStream = SocketStream = {}));
