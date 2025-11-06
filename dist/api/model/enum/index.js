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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaType = exports.MessageType = exports.SocketStream = exports.SocketState = exports.GroupNotificationType = exports.ChatState = exports.AckType = void 0;
var ack_type_1 = require("./ack-type");
Object.defineProperty(exports, "AckType", { enumerable: true, get: function () { return ack_type_1.AckType; } });
var chat_state_1 = require("./chat-state");
Object.defineProperty(exports, "ChatState", { enumerable: true, get: function () { return chat_state_1.ChatState; } });
var group_notification_type_1 = require("./group-notification-type");
Object.defineProperty(exports, "GroupNotificationType", { enumerable: true, get: function () { return group_notification_type_1.GroupNotificationType; } });
var socket_state_1 = require("./socket-state");
Object.defineProperty(exports, "SocketState", { enumerable: true, get: function () { return socket_state_1.SocketState; } });
Object.defineProperty(exports, "SocketStream", { enumerable: true, get: function () { return socket_state_1.SocketStream; } });
var message_type_1 = require("./message-type");
Object.defineProperty(exports, "MessageType", { enumerable: true, get: function () { return message_type_1.MessageType; } });
Object.defineProperty(exports, "MediaType", { enumerable: true, get: function () { return message_type_1.MediaType; } });
__exportStar(require("./group-property"), exports);
__exportStar(require("./interface-mode"), exports);
__exportStar(require("./interface-state"), exports);
__exportStar(require("./status-find"), exports);
