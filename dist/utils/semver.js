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
exports.upToDate = upToDate;
var VPAT = /^\d+(\.\d+){0,2}$/;
/**
 * Compares two versions
 * @return true if local is up to date, false otherwise
 * @param local
 * @param remote
 */
function upToDate(local, remote) {
    if (!local || !remote || local.length === 0 || remote.length === 0)
        return false;
    if (local == remote)
        return true;
    if (VPAT.test(local) && VPAT.test(remote)) {
        var lparts = local.split('.');
        while (lparts.length < 3)
            lparts.push('0');
        var rparts = remote.split('.');
        while (rparts.length < 3)
            rparts.push('0');
        for (var i = 0; i < 3; i++) {
            var l = parseInt(lparts[i], 10);
            var r = parseInt(rparts[i], 10);
            if (l === r)
                continue;
            return l > r;
        }
        return true;
    }
    else {
        return local >= remote;
    }
}
