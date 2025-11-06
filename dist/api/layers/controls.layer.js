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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlsLayer = void 0;
var helpers_1 = require("../helpers");
var ui_layer_1 = require("./ui.layer");
var ControlsLayer = /** @class */ (function (_super) {
    __extends(ControlsLayer, _super);
    function ControlsLayer(page, session, options) {
        var _this = _super.call(this, page, session, options) || this;
        _this.page = page;
        return _this;
    }
    /**
     * Unblock contact
     * @category Blocklist
     * @param contactId {string} id '000000000000@c.us'
     * @returns boolean
     */
    ControlsLayer.prototype.unblockContact = function (contactId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (contactId) { return WPP.blocklist.unblockContact(contactId); }, contactId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Block contact
     * @category Blocklist
     * @param contactId {string} id '000000000000@c.us'
     * @returns boolean
     */
    ControlsLayer.prototype.blockContact = function (contactId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (contactId) { return WPP.blocklist.blockContact(contactId); }, contactId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * puts the chat as unread
     * @category Chat
     * @param contactId {string} id '000000000000@c.us'
     * @returns boolean
     */
    ControlsLayer.prototype.markUnseenMessage = function (contactId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (contactId) { return WPP.chat.markIsUnread(contactId); }, contactId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Deletes the given chat
     * @category Chat
     * @param chatId {string} id '000000000000@c.us'
     * @returns boolean
     */
    ControlsLayer.prototype.deleteChat = function (chatId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (chatId) { return WPP.chat.delete(chatId); }, chatId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.status === 200];
                }
            });
        });
    };
    /**
     * Archive and unarchive chat messages with true or false
     * @category Chat
     * @param chatId {string} id '000000000000@c.us'
     * @param option {boolean} true or false
     * @returns boolean
     */
    ControlsLayer.prototype.archiveChat = function (chatId_1) {
        return __awaiter(this, arguments, void 0, function (chatId, option) {
            if (option === void 0) { option = true; }
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var chatId = _a.chatId, option = _a.option;
                        return WPP.chat.archive(chatId, option);
                    }, { chatId: chatId, option: option })];
            });
        });
    };
    /**
     * Pin and Unpin chat messages with true or false
     * @category Chat
     * @param chatId {string} id '000000000000@c.us'
     * @param option {boolean} true or false
     * @param nonExistent {boolean} Pin chat, non-existent (optional)
     * @returns object
     */
    ControlsLayer.prototype.pinChat = function (chatId, option, nonExistent) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!nonExistent) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                                var chatId = _a.chatId;
                                return WPP.chat.find(chatId);
                            }, { chatId: chatId })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var chatId = _a.chatId, option = _a.option;
                            return WPP.chat.pin(chatId, option);
                        }, { chatId: chatId, option: option })];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Deletes all messages of given chat
     * @category Chat
     * @param chatId
     * @param keepStarred Keep starred messages
     * @returns boolean
     */
    ControlsLayer.prototype.clearChat = function (chatId_1) {
        return __awaiter(this, arguments, void 0, function (chatId, keepStarred) {
            var result;
            if (keepStarred === void 0) { keepStarred = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var chatId = _a.chatId, keepStarred = _a.keepStarred;
                            return WPP.chat.clear(chatId, keepStarred);
                        }, { chatId: chatId, keepStarred: keepStarred })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.status === 200];
                }
            });
        });
    };
    /**
     * Deletes message of given message id
     * @category Chat
     * @param chatId The chat id from which to delete the message.
     * @param messageId The specific message id of the message to be deleted
     * @param onlyLocal If it should only delete locally (message remains on the other recipienct's phone). Defaults to false.
     */
    ControlsLayer.prototype.deleteMessage = function (chatId_1, messageId_1) {
        return __awaiter(this, arguments, void 0, function (chatId, messageId, onlyLocal, deleteMediaInDevice) {
            if (onlyLocal === void 0) { onlyLocal = false; }
            if (deleteMediaInDevice === void 0) { deleteMediaInDevice = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var chatId = _a.chatId, messageId = _a.messageId, onlyLocal = _a.onlyLocal, deleteMediaInDevice = _a.deleteMediaInDevice;
                            return WPP.chat.deleteMessage(chatId, messageId, deleteMediaInDevice, !onlyLocal);
                        }, { chatId: chatId, messageId: messageId, onlyLocal: onlyLocal, deleteMediaInDevice: deleteMediaInDevice })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Edits message of given message id
     * @category Chat
     * @param msgId The specific message id of the message to be edited
     * @param newText New content of specified message
     * @param options Common message options
     *
     * @example
     * ```javascript
     * // Simple message
     * client.editMessage('true_<number>@c.us_messageId', 'new Text For Simple Message');
     * ```
     */
    ControlsLayer.prototype.editMessage = function (msgId_1, newText_1) {
        return __awaiter(this, arguments, void 0, function (msgId, newText, options) {
            var editResult, result;
            var _this = this;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var msgId = _a.msgId, newText = _a.newText, options = _a.options;
                            return WPP.chat.editMessage(msgId, newText, options);
                        }, { msgId: msgId, newText: newText, options: options })];
                    case 1:
                        editResult = _a.sent();
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                var _c, _d, _e, _f;
                                var messageId = _b.messageId;
                                return __generator(this, function (_g) {
                                    switch (_g.label) {
                                        case 0:
                                            _d = (_c = JSON).parse;
                                            _f = (_e = JSON).stringify;
                                            return [4 /*yield*/, WAPI.getMessageById(messageId)];
                                        case 1: return [2 /*return*/, _d.apply(_c, [_f.apply(_e, [_g.sent()])])];
                                    }
                                });
                            }); }, { messageId: editResult.id })];
                    case 2:
                        result = (_a.sent());
                        if (result.body !== newText)
                            throw editResult;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Stars message of given message id
     * @category Chat
     * @param messagesId The specific message id of the message to be starred
     * @param star Add or remove star of the message. Defaults to true.
     */
    ControlsLayer.prototype.starMessage = function (messagesId_1) {
        return __awaiter(this, arguments, void 0, function (messagesId, star) {
            if (star === void 0) { star = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var messagesId = _a.messagesId, star = _a.star;
                            return WAPI.starMessages(messagesId, star);
                        }, { messagesId: messagesId, star: star })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Allow only admin to send messages with true or false
     * @category Group
     * @param chatId {string} id '000000000000@c.us'
     * @param option {boolean} true or false
     * @returns boolean
     */
    ControlsLayer.prototype.setMessagesAdminsOnly = function (chatId, option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var chatId = _a.chatId, option = _a.option;
                        return WAPI.setMessagesAdminsOnly(chatId, option);
                    }, { chatId: chatId, option: option })];
            });
        });
    };
    /**
     * Enable or disable temporary messages with true or false
     * @category Chat
     * @param chatOrGroupId id '000000000000@c.us' or '000000-000000@g.us'
     * @param value true or false
     * @returns boolean
     */
    ControlsLayer.prototype.setTemporaryMessages = function (chatOrGroupId, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var chatOrGroupId = _a.chatOrGroupId, value = _a.value;
                            return WAPI.setTemporaryMessages(chatOrGroupId, value);
                        }, { chatOrGroupId: chatOrGroupId, value: value })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Change limits of whatsapp web
     *  * @example
     * ```javascript
     *  //Change the maximum size (bytes) for uploading media (max 70MB)
     *  WPP.conn.setLimit('maxMediaSize',16777216);
     *
     *  //Change the maximum size (bytes) for uploading files (max 1GB)
     *  WPP.conn.setLimit('maxFileSize',104857600);
     *
     *  //Change the maximum number of contacts that can be selected when sharing (Default 5)
     *  WPP.conn.setLimit('maxShare',100);
     *
     *  //Change the maximum time (seconds) of a video status
     *  WPP.conn.setLimit('statusVideoMaxDuration',120);
     *
     *  //Remove pinned conversation limit (only whatsapp web) (Default 3)
     *  WPP.conn.setLimit('unlimitedPin',true);
     * ```
     * @category Chat
     */
    ControlsLayer.prototype.setLimit = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var key = _a.key, value = _a.value;
                            return WPP.conn.setLimit(key, value);
                        }, { key: key, value: value })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ControlsLayer;
}(ui_layer_1.UILayer));
exports.ControlsLayer = ControlsLayer;
