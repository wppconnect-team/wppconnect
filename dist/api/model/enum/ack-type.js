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
exports.AckType = void 0;
var AckType;
(function (AckType) {
    AckType[AckType["MD_DOWNGRADE"] = -7] = "MD_DOWNGRADE";
    AckType[AckType["INACTIVE"] = -6] = "INACTIVE";
    AckType[AckType["CONTENT_UNUPLOADABLE"] = -5] = "CONTENT_UNUPLOADABLE";
    AckType[AckType["CONTENT_TOO_BIG"] = -4] = "CONTENT_TOO_BIG";
    AckType[AckType["CONTENT_GONE"] = -3] = "CONTENT_GONE";
    AckType[AckType["EXPIRED"] = -2] = "EXPIRED";
    AckType[AckType["FAILED"] = -1] = "FAILED";
    AckType[AckType["CLOCK"] = 0] = "CLOCK";
    AckType[AckType["SENT"] = 1] = "SENT";
    AckType[AckType["RECEIVED"] = 2] = "RECEIVED";
    AckType[AckType["READ"] = 3] = "READ";
    AckType[AckType["PLAYED"] = 4] = "PLAYED";
})(AckType || (exports.AckType = AckType = {}));
