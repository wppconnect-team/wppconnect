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
exports.GroupProperty = void 0;
/**
 * Group properties
 */
var GroupProperty;
(function (GroupProperty) {
    /**
     * Define how can send message in the group
     * `true` only admins
     * `false` everyone
     */
    GroupProperty["ANNOUNCEMENT"] = "announcement";
    /**
     * Define how can edit the group data
     * `true` only admins
     * `false` everyone
     */
    GroupProperty["RESTRICT"] = "restrict";
    /**
     * Non-Documented
     */
    GroupProperty["NO_FREQUENTLY_FORWARDED"] = "no_frequently_forwarded";
    /**
     * Enable or disable temporary messages
     * `true` to enable
     * `false` to disable
     */
    GroupProperty["EPHEMERAL"] = "ephemeral";
})(GroupProperty || (exports.GroupProperty = GroupProperty = {}));
