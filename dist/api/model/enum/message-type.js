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
exports.MediaType = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["NOTIFICATION"] = "notification";
    MessageType["NOTIFICATION_TEMPLATE"] = "notification_template";
    MessageType["GROUP_NOTIFICATION"] = "group_notification";
    /**
     * Group data modification, like subtitle or description and group members (join, leave)
     * See {@link GroupNotificationType}
     */
    MessageType["GP2"] = "gp2";
    MessageType["BROADCAST_NOTIFICATION"] = "broadcast_notification";
    MessageType["E2E_NOTIFICATION"] = "e2e_notification";
    MessageType["CALL_LOG"] = "call_log";
    MessageType["PROTOCOL"] = "protocol";
    MessageType["CHAT"] = "chat";
    MessageType["LOCATION"] = "location";
    MessageType["PAYMENT"] = "payment";
    MessageType["VCARD"] = "vcard";
    MessageType["CIPHERTEXT"] = "ciphertext";
    MessageType["MULTI_VCARD"] = "multi_vcard";
    MessageType["REVOKED"] = "revoked";
    MessageType["OVERSIZED"] = "oversized";
    MessageType["GROUPS_V4_INVITE"] = "groups_v4_invite";
    MessageType["HSM"] = "hsm";
    MessageType["TEMPLATE_BUTTON_REPLY"] = "template_button_reply";
    MessageType["IMAGE"] = "image";
    MessageType["VIDEO"] = "video";
    MessageType["AUDIO"] = "audio";
    MessageType["PTT"] = "ptt";
    MessageType["STICKER"] = "sticker";
    MessageType["DOCUMENT"] = "document";
    MessageType["PRODUCT"] = "product";
    MessageType["ORDER"] = "order";
    MessageType["LIST"] = "list";
    MessageType["LIST_RESPONSE"] = "list_response";
    MessageType["BUTTONS_RESPONSE"] = "buttons_response";
    MessageType["POLL_CREATION"] = "poll_creation";
    MessageType["UNKNOWN"] = "unknown";
})(MessageType || (exports.MessageType = MessageType = {}));
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "Image";
    MediaType["VIDEO"] = "Video";
    MediaType["AUDIO"] = "Audio";
    MediaType["PTT"] = "Audio";
    MediaType["DOCUMENT"] = "Document";
    MediaType["STICKER"] = "Image";
})(MediaType || (exports.MediaType = MediaType = {}));
