"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLogger = exports.formatLabelSession = void 0;
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
var winston_1 = require("winston");
exports.formatLabelSession = (0, winston_1.format)(function (info, opts) {
    var parts = [];
    if (info.session) {
        parts.push(info.session);
        delete info.session;
    }
    if (info.type) {
        parts.push(info.type);
        delete info.type;
    }
    if (parts.length) {
        var prefix = parts.join(':');
        info.message = "[".concat(prefix, "] ").concat(info.message);
    }
    return info;
});
exports.defaultLogger = (0, winston_1.createLogger)({
    level: 'silly',
    levels: winston_1.config.npm.levels,
    format: winston_1.format.combine((0, exports.formatLabelSession)(), winston_1.format.colorize(), winston_1.format.padLevels(), winston_1.format.simple()),
    //   defaultMeta: { service: 'venon-bot' },
    transports: [new winston_1.transports.Console()],
});
