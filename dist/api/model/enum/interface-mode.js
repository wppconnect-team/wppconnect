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
exports.InterfaceMode = void 0;
var InterfaceMode;
(function (InterfaceMode) {
    /**
     * QR code page.
     */
    InterfaceMode["QR"] = "QR";
    /**
     * Chat page.
     */
    InterfaceMode["MAIN"] = "MAIN";
    /**
     * Loading page, waiting data from smartphone.
     */
    InterfaceMode["SYNCING"] = "SYNCING";
    /**
     * Offline page, when there are no internet.
     */
    InterfaceMode["OFFLINE"] = "OFFLINE";
    /**
     * Conflic page, when there are another whatsapp web openned.
     */
    InterfaceMode["CONFLICT"] = "CONFLICT";
    /**
     * Blocked page, by proxy.
     */
    InterfaceMode["PROXYBLOCK"] = "PROXYBLOCK";
    /**
     * Blocked page.
     */
    InterfaceMode["TOS_BLOCK"] = "TOS_BLOCK";
    /**
     * Blocked page.
     */
    InterfaceMode["SMB_TOS_BLOCK"] = "SMB_TOS_BLOCK";
    /**
     * Deprecated page.
     */
    InterfaceMode["DEPRECATED_VERSION"] = "DEPRECATED_VERSION";
})(InterfaceMode || (exports.InterfaceMode = InterfaceMode = {}));
