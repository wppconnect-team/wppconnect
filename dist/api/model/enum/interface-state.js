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
exports.InterfaceState = void 0;
var InterfaceState;
(function (InterfaceState) {
    /**
     * When there are no internet.
     */
    InterfaceState["OFFLINE"] = "OFFLINE";
    /**
     * When the whatsapp web page is loading.
     */
    InterfaceState["OPENING"] = "OPENING";
    /**
     * When the whatsapp web is connecting to smartphone after QR code scan.
     */
    InterfaceState["PAIRING"] = "PAIRING";
    /**
     * When the whatsapp web is syncing messages with smartphone.
     */
    InterfaceState["SYNCING"] = "SYNCING";
    /**
     * When the whatsapp web is syncing messages with smartphone after a disconnection.
     */
    InterfaceState["RESUMING"] = "RESUMING";
    /**
     * When the whatsapp web is connecting to whatsapp server.
     */
    InterfaceState["CONNECTING"] = "CONNECTING";
    /**
     * When the whatsapp web is ready.
     */
    InterfaceState["NORMAL"] = "NORMAL";
    /**
     * When the whatsapp web couldn't connect to smartphone.
     */
    InterfaceState["TIMEOUT"] = "TIMEOUT";
})(InterfaceState || (exports.InterfaceState = InterfaceState = {}));
