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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
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
exports.SenderLayer = void 0;
var path = __importStar(require("path"));
var ffmpeg_1 = require("../../utils/ffmpeg");
var helpers_1 = require("../helpers");
var filename_from_mimetype_1 = require("../helpers/filename-from-mimetype");
var listener_layer_1 = require("./listener.layer");
var SenderLayer = /** @class */ (function (_super) {
    __extends(SenderLayer, _super);
    function SenderLayer(page, session, options) {
        var _this = _super.call(this, page, session, options) || this;
        _this.page = page;
        return _this;
    }
    /**
     * Automatically sends a link with the auto generated link preview. You can also add a custom message to be added.
     *
     * Deprecated: please use {@link sendText}
     *
     * @category Chat
     * @deprecated
     * @param chatId
     * @param url string A link, for example for youtube. e.g https://www.youtube.com/watch?v=Zi_XLOBDo_Y&list=RDEMe12_MlgO8mGFdeeftZ2nOQ&start_radio=1
     * @param text custom text as the message body, this includes the link or will be attached after the link
     */
    SenderLayer.prototype.sendLinkPreview = function (chatId_1, url_1) {
        return __awaiter(this, arguments, void 0, function (chatId, url, text) {
            var message, result;
            if (text === void 0) { text = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = text.includes(url) ? text : "".concat(url, "\n").concat(text);
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                                var chatId = _a.chatId, message = _a.message;
                                return WPP.chat.sendTextMessage(chatId, message, { linkPreview: true });
                            }, { chatId: chatId, message: message })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Sends a text message to given chat
     * @category Chat
     * @param to chat id: xxxxx@us.c
     * @param content text message
     *
     * @example
     * ```javascript
     * // Simple message
     * client.sendText('<number>@c.us', 'A simple message');
     *
     * // A message with reply
     * client.sendText('<number>@c.us', 'A simple message', {
     *  quotedMsg: 'true_...@c.us_3EB01DE65ACC6_out'
     * });
     *
     * // With buttons
     * client.sendText('<number>@c.us', 'WPPConnect message with buttons', {
     *    useTemplateButtons: true, // False for legacy
     *    buttons: [
     *      {
     *        url: 'https://wppconnect.io/',
     *        text: 'WPPConnect Site'
     *      },
     *      {
     *        phoneNumber: '+55 11 22334455',
     *        text: 'Call me'
     *      },
     *      {
     *        id: 'your custom id 1',
     *        text: 'Some text'
     *      },
     *      {
     *        id: 'another id 2',
     *        text: 'Another text'
     *      }
     *    ],
     *    title: 'Title text' // Optional
     *    footer: 'Footer text' // Optional
     * });
     * ```
     */
    SenderLayer.prototype.sendText = function (to, content, options) {
        return __awaiter(this, void 0, void 0, function () {
            var sendResult, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var to = _a.to, content = _a.content, options = _a.options;
                            return WPP.chat.sendTextMessage(to, content, __assign(__assign({}, options), { waitForAck: true }));
                        }, { to: to, content: content, options: options })];
                    case 1:
                        sendResult = _a.sent();
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
                            }); }, { messageId: sendResult.id })];
                    case 2:
                        result = (_a.sent());
                        if (result['erro'] == true) {
                            throw result;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Sends a pix message to given chat
     * @category Chat
     * @param to chat id: xxxxx@us.c
     * @param content pix message
     *
     * @example
     * ```javascript
     * // Simple message
     * client.sendPix('<number>@c.us', {
            keyType: 'PHONE',
            name: 'WPPCONNECT-TEAM',
            key: '+5567123456789',
            instructions: 'teste',
          });
     * ```
     */
    SenderLayer.prototype.sendPixKey = function (to, params, options) {
        return __awaiter(this, void 0, void 0, function () {
            var sendResult, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var to = _a.to, params = _a.params, options = _a.options;
                            return WPP.chat.sendPixKeyMessage(to, params, __assign(__assign({}, options), { waitForAck: true }));
                        }, { to: to, params: params, options: options })];
                    case 1:
                        sendResult = _a.sent();
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
                            }); }, { messageId: sendResult.id })];
                    case 2:
                        result = (_a.sent());
                        if (result['erro'] == true) {
                            throw result;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     *
     * @category Chat
     * @param chat
     * @param content
     * @param options
     * @returns
     */
    SenderLayer.prototype.sendMessageOptions = function (chat, content, options) {
        return __awaiter(this, void 0, void 0, function () {
            var messageId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var chat = _a.chat, content = _a.content, options = _a.options;
                            return WAPI.sendMessageOptions(chat, content, options);
                        }, { chat: chat, content: content, options: options })];
                    case 1:
                        messageId = _a.sent();
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (messageId) { return WAPI.getMessageById(messageId); }, messageId)];
                    case 2:
                        result = (_a.sent());
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Sends image message
     * @category Chat
     * @param to Chat id
     * @param filePath File path or http link
     * @param filename
     * @param caption
     * @param quotedMessageId Quoted message id
     * @param isViewOnce Enable single view
     */
    SenderLayer.prototype.sendImage = function (to, filePath, filename, caption, quotedMessageId, isViewOnce, options) {
        return __awaiter(this, void 0, void 0, function () {
            var base64, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.downloadFileToBase64)(filePath, [
                            'image/gif',
                            'image/png',
                            'image/jpg',
                            'image/jpeg',
                            'image/webp',
                        ])];
                    case 1:
                        base64 = _a.sent();
                        if (!!base64) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, helpers_1.fileToBase64)(filePath)];
                    case 2:
                        base64 = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!base64) {
                            obj = {
                                erro: true,
                                to: to,
                                text: 'No such file or directory, open "' + filePath + '"',
                            };
                            throw obj;
                        }
                        if (!filename) {
                            filename = path.basename(filePath);
                        }
                        return [4 /*yield*/, this.sendImageFromBase64(to, base64, filename, caption, quotedMessageId, isViewOnce, options === null || options === void 0 ? void 0 : options.mentionedList, options || {})];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Sends image message
     * @category Chat
     * @param to ID of the chat to send the image to
     * @param base64 A base64-encoded data URI (with mime type)
     * @param filename
     * @param caption
     * @param quotedMessageId Quoted message id
     * @param isViewOnce Enable single view
     * @param mentionedList
     * @example
     * ```javascript
     * const base64picture = "/9j/4AA[...]VZoCn9Lp//Z"
     * await client.sendImageFromBase64("120[...]381@g.us'", "data:image/png;base64," + base64picture, "picture.png")
     * ```
     */
    SenderLayer.prototype.sendImageFromBase64 = function (to, base64, filename, caption, quotedMessageId, isViewOnce, mentionedList, options) {
        return __awaiter(this, void 0, void 0, function () {
            var mimeType, obj, obj, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mimeType = (0, helpers_1.base64MimeType)(base64);
                        if (!mimeType) {
                            obj = {
                                erro: true,
                                to: to,
                                text: 'Invalid base64!',
                            };
                            throw obj;
                        }
                        if (!mimeType.includes('image')) {
                            obj = {
                                erro: true,
                                to: to,
                                text: 'Not an image, allowed formats png, jpeg and webp',
                            };
                            throw obj;
                        }
                        filename = (0, filename_from_mimetype_1.filenameFromMimeType)(filename, mimeType);
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                var result;
                                var _c;
                                var to = _b.to, base64 = _b.base64, filename = _b.filename, caption = _b.caption, quotedMessageId = _b.quotedMessageId, isViewOnce = _b.isViewOnce, mentionedList = _b.mentionedList, options = _b.options;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0: return [4 /*yield*/, WPP.chat.sendFileMessage(to, base64, {
                                                type: 'image',
                                                isViewOnce: isViewOnce,
                                                messageId: options === null || options === void 0 ? void 0 : options.msgId,
                                                filename: filename,
                                                caption: caption,
                                                quotedMsg: quotedMessageId,
                                                waitForAck: true,
                                                detectMentioned: true,
                                                mentionedList: mentionedList,
                                            })];
                                        case 1:
                                            result = _d.sent();
                                            _c = {
                                                ack: result.ack,
                                                id: result.id
                                            };
                                            return [4 /*yield*/, result.sendMsgResult];
                                        case 2: return [2 /*return*/, (_c.sendMsgResult = _d.sent(),
                                                _c)];
                                    }
                                });
                            }); }, {
                                to: to,
                                base64: base64,
                                filename: filename,
                                caption: caption,
                                quotedMessageId: quotedMessageId,
                                isViewOnce: isViewOnce,
                                mentionedList: mentionedList,
                                options: options,
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Sends message with thumbnail
     *
     * @deprecated: please use {@link sendText} with options
     *
     * @deprecated
     * @category Chat
     * @param pathOrBase64
     * @param url
     * @param title
     * @param description
     * @param chatId
     */
    SenderLayer.prototype.sendMessageWithThumb = function (pathOrBase64, url, title, description, chatId) {
        return __awaiter(this, void 0, void 0, function () {
            var base64, fileContent, error, mimeInfo, error, thumbnail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        base64 = '';
                        if (!pathOrBase64.startsWith('data:')) return [3 /*break*/, 1];
                        base64 = pathOrBase64;
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, (0, helpers_1.downloadFileToBase64)(pathOrBase64, [
                            'image/gif',
                            'image/png',
                            'image/jpg',
                            'image/jpeg',
                            'image/webp',
                        ])];
                    case 2:
                        fileContent = _a.sent();
                        if (!!fileContent) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, helpers_1.fileToBase64)(pathOrBase64)];
                    case 3:
                        fileContent = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (fileContent) {
                            base64 = fileContent;
                        }
                        _a.label = 5;
                    case 5:
                        if (!base64) {
                            error = new Error('Empty or invalid file or base64');
                            Object.assign(error, {
                                code: 'empty_file',
                            });
                            throw error;
                        }
                        mimeInfo = (0, helpers_1.base64MimeType)(base64);
                        if (!mimeInfo || !mimeInfo.includes('image')) {
                            error = new Error('Not an image, allowed formats png, jpeg, webp and gif');
                            Object.assign(error, {
                                code: 'invalid_image',
                            });
                            throw error;
                        }
                        thumbnail = base64.replace(/^data:image\/(png|jpe?g|webp|gif);base64,/, '');
                        return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                                var thumbnail = _a.thumbnail, url = _a.url, title = _a.title, description = _a.description, chatId = _a.chatId;
                                return WPP.chat.sendTextMessage(chatId, url, {
                                    linkPreview: {
                                        thumbnail: thumbnail,
                                        canonicalUrl: url,
                                        description: description,
                                        matchedText: url,
                                        title: title,
                                        richPreviewType: 0,
                                        doNotPlayInline: true,
                                    },
                                });
                            }, {
                                thumbnail: thumbnail,
                                url: url,
                                title: title,
                                description: description,
                                chatId: chatId,
                            })];
                }
            });
        });
    };
    /**
     * Replies to given mesage id of given chat id
     *
     * Deprecated: Please, use sendText with quotedMsg option
     *
     * @deprecated
     *
     * @category Chat
     * @param to Chat id
     * @param content Message body
     * @param quotedMsg Message id to reply to.
     */
    SenderLayer.prototype.reply = function (to, content, quotedMsg) {
        return __awaiter(this, void 0, void 0, function () {
            var result, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var to = _a.to, content = _a.content, quotedMsg = _a.quotedMsg;
                            return WPP.chat.sendTextMessage(to, content, { quotedMsg: quotedMsg });
                        }, { to: to, content: content, quotedMsg: quotedMsg })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (messageId) { return WAPI.getMessageById(messageId); }, result.id)];
                    case 2:
                        message = (_a.sent());
                        if (message['erro'] == true) {
                            throw message;
                        }
                        return [2 /*return*/, message];
                }
            });
        });
    };
    /**
     * Sends ptt audio
     * base64 parameter should have mime type already defined
     * @category Chat
     * @param to Chat id
     * @param base64 base64 data
     * @param filename
     * @param caption
     * @param quotedMessageId Quoted message id
     * @param messageId Set the id for this message
     * @param isPtt Set as ptt audio
     */
    SenderLayer.prototype.sendPttFromBase64 = function (to_1, base64_1, filename_1, caption_1, quotedMessageId_1, messageId_1) {
        return __awaiter(this, arguments, void 0, function (to, base64, filename, caption, quotedMessageId, messageId, isPtt) {
            var result;
            var _this = this;
            if (isPtt === void 0) { isPtt = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var result;
                            var _c;
                            var to = _b.to, base64 = _b.base64, filename = _b.filename, caption = _b.caption, quotedMessageId = _b.quotedMessageId, messageId = _b.messageId, isPtt = _b.isPtt;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, WPP.chat.sendFileMessage(to, base64, {
                                            type: 'audio',
                                            isPtt: isPtt,
                                            filename: filename,
                                            caption: caption,
                                            quotedMsg: quotedMessageId,
                                            waitForAck: true,
                                            messageId: messageId,
                                        })];
                                    case 1:
                                        result = _d.sent();
                                        _c = {
                                            ack: result.ack,
                                            id: result.id
                                        };
                                        return [4 /*yield*/, result.sendMsgResult];
                                    case 2: return [2 /*return*/, (_c.sendMsgResult = _d.sent(),
                                            _c)];
                                }
                            });
                        }); }, { to: to, base64: base64, filename: filename, caption: caption, quotedMessageId: quotedMessageId, messageId: messageId, isPtt: isPtt })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Sends ptt audio from path
     * @category Chat
     * @param to Chat id
     * @param filePath File path
     * @param filename
     * @param caption
     * @param quotedMessageId Quoted message id
     * @param messageId Set the id for this message
     * @param isPtt Set as ptt audio
     */
    SenderLayer.prototype.sendPtt = function (to_1, filePath_1, filename_1, caption_1, quotedMessageId_1, messageId_1) {
        return __awaiter(this, arguments, void 0, function (to, filePath, filename, caption, quotedMessageId, messageId, isPtt) {
            var _this = this;
            if (isPtt === void 0) { isPtt = true; }
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var base64, obj;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, helpers_1.downloadFileToBase64)(filePath, [/^audio/])];
                                case 1:
                                    base64 = _a.sent();
                                    if (!!base64) return [3 /*break*/, 3];
                                    return [4 /*yield*/, (0, helpers_1.fileToBase64)(filePath)];
                                case 2:
                                    base64 = _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (!base64) {
                                        obj = {
                                            erro: true,
                                            to: to,
                                            text: 'No such file or directory, open "' + filePath + '"',
                                        };
                                        return [2 /*return*/, reject(obj)];
                                    }
                                    if (!filename) {
                                        filename = path.basename(filePath);
                                    }
                                    return [2 /*return*/, this.sendPttFromBase64(to, base64, filename, caption, quotedMessageId, messageId, isPtt)
                                            .then(resolve)
                                            .catch(reject)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Sends file
     * base64 parameter should have mime type already defined
     *
     * Deprecated: please use sendFile with options: sendFile(to, content, options)
     *
     * @deprecated
     *
     * @category Chat
     * @param chatId Chat id
     * @param base64 base64 data
     * @param filename
     * @param caption
     */
    SenderLayer.prototype.sendFileFromBase64 = function (chatId, base64, filename, caption) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sendFile(chatId, base64, filename, caption)];
            });
        });
    };
    SenderLayer.prototype.sendFile = function (to, pathOrBase64, nameOrOptions, caption) {
        return __awaiter(this, void 0, void 0, function () {
            var options, base64, fileContent, error;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = { type: 'auto-detect' };
                        if (typeof nameOrOptions === 'string') {
                            options.filename = nameOrOptions;
                            options.caption = caption;
                        }
                        else if (typeof nameOrOptions === 'object') {
                            options = nameOrOptions;
                        }
                        base64 = '';
                        if (!pathOrBase64.startsWith('data:')) return [3 /*break*/, 1];
                        base64 = pathOrBase64;
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, (0, helpers_1.downloadFileToBase64)(pathOrBase64)];
                    case 2:
                        fileContent = _a.sent();
                        if (!!fileContent) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, helpers_1.fileToBase64)(pathOrBase64)];
                    case 3:
                        fileContent = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (fileContent) {
                            base64 = fileContent;
                        }
                        if (!options.filename) {
                            options.filename = path.basename(pathOrBase64);
                        }
                        _a.label = 5;
                    case 5:
                        if (!base64) {
                            error = new Error('Empty or invalid file or base64');
                            Object.assign(error, {
                                code: 'empty_file',
                            });
                            throw error;
                        }
                        return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                var result;
                                var _c;
                                var to = _b.to, base64 = _b.base64, options = _b.options;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0: return [4 /*yield*/, WPP.chat.sendFileMessage(to, base64, options)];
                                        case 1:
                                            result = _d.sent();
                                            _c = {
                                                ack: result.ack,
                                                id: result.id
                                            };
                                            return [4 /*yield*/, result.sendMsgResult];
                                        case 2: return [2 /*return*/, (_c.sendMsgResult = _d.sent(),
                                                _c)];
                                    }
                                });
                            }); }, { to: to, base64: base64, options: options })];
                }
            });
        });
    };
    /**
     * Sends a video to given chat as a gif, with caption or not
     * @category Chat
     * @param to Chat id
     * @param filePath File path
     * @param filename
     * @param caption
     */
    SenderLayer.prototype.sendVideoAsGif = function (to, filePath, filename, caption) {
        return __awaiter(this, void 0, void 0, function () {
            var base64, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.downloadFileToBase64)(filePath)];
                    case 1:
                        base64 = _a.sent();
                        if (!!base64) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, helpers_1.fileToBase64)(filePath)];
                    case 2:
                        base64 = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!base64) {
                            obj = {
                                erro: true,
                                to: to,
                                text: 'No such file or directory, open "' + filePath + '"',
                            };
                            throw obj;
                        }
                        if (!filename) {
                            filename = path.basename(filePath);
                        }
                        return [2 /*return*/, this.sendVideoAsGifFromBase64(to, base64, filename, caption)];
                }
            });
        });
    };
    /**
     * Sends a video to given chat as a gif, with caption or not, using base64
     * @category Chat
     * @param to chat id xxxxx@us.c
     * @param base64 base64 data:video/xxx;base64,xxx
     * @param filename string xxxxx
     * @param caption string xxxxx
     */
    SenderLayer.prototype.sendVideoAsGifFromBase64 = function (to, base64, filename, caption, quotedMessageId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var result;
                            var _c;
                            var to = _b.to, base64 = _b.base64, filename = _b.filename, caption = _b.caption, quotedMessageId = _b.quotedMessageId;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, WPP.chat.sendFileMessage(to, base64, {
                                            type: 'video',
                                            isGif: true,
                                            filename: filename,
                                            caption: caption,
                                            quotedMsg: quotedMessageId,
                                            waitForAck: true,
                                        })];
                                    case 1:
                                        result = _d.sent();
                                        _c = {
                                            ack: result.ack,
                                            id: result.id
                                        };
                                        return [4 /*yield*/, result.sendMsgResult];
                                    case 2: return [2 /*return*/, (_c.sendMsgResult = _d.sent(),
                                            _c)];
                                }
                            });
                        }); }, { to: to, base64: base64, filename: filename, caption: caption, quotedMessageId: quotedMessageId })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Sends a video to given chat as a gif, with caption or not, using base64
     * @category Chat
     * @param to Chat id
     * @param filePath File path
     * @param filename
     * @param caption
     */
    SenderLayer.prototype.sendGif = function (to, filePath, filename, caption) {
        return __awaiter(this, void 0, void 0, function () {
            var base64, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.downloadFileToBase64)(filePath)];
                    case 1:
                        base64 = _a.sent();
                        if (!!base64) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, helpers_1.fileToBase64)(filePath)];
                    case 2:
                        base64 = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!base64) {
                            obj = {
                                erro: true,
                                to: to,
                                text: 'No such file or directory, open "' + filePath + '"',
                            };
                            throw obj;
                        }
                        if (!filename) {
                            filename = path.basename(filePath);
                        }
                        return [2 /*return*/, this.sendGifFromBase64(to, base64, filename, caption)];
                }
            });
        });
    };
    /**
     * Sends a video to given chat as a gif, with caption or not, using base64
     * @category Chat
     * @param to chat id xxxxx@us.c
     * @param base64 base64 data:video/xxx;base64,xxx
     * @param filename string xxxxx
     * @param caption string xxxxx
     */
    SenderLayer.prototype.sendGifFromBase64 = function (to, base64, filename, caption) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, ffmpeg_1.convertToMP4GIF)(base64)];
                    case 1:
                        base64 = _a.sent();
                        return [4 /*yield*/, this.sendVideoAsGifFromBase64(to, base64, filename, caption)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Sends contact card to iven chat id
     * @category Chat
     * @param to Chat id
     * @param contactsId Example: 0000@c.us | [000@c.us, 1111@c.us]
     */
    SenderLayer.prototype.sendContactVcard = function (to, contactsId, name) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var to = _a.to, contactsId = _a.contactsId, name = _a.name;
                            return WPP.chat.sendVCardContactMessage(to, {
                                id: contactsId,
                                name: name,
                            });
                        }, { to: to, contactsId: contactsId, name: name })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Send a list of contact cards
     * @category Chat
     * @param to Chat id
     * @param contacts Example: | ['000@c.us', '1111@c.us', {id: '2222@c.us', name: 'Test'}]
     */
    SenderLayer.prototype.sendContactVcardList = function (to, contacts) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var to = _a.to, contacts = _a.contacts;
                            return WPP.chat.sendVCardContactMessage(to, contacts);
                        }, { to: to, contacts: contacts })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Forwards array of messages (could be ids or message objects)
     * @category Chat
     * @param to Chat id
     * @param messages Array of messages ids to be forwarded
     * @param skipMyMessages
     * @returns array of messages ID
     */
    SenderLayer.prototype.forwardMessage = function (toChatId, msgId, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var toChatId = _a.toChatId, msgId = _a.msgId, options = _a.options;
                        return WPP.chat.forwardMessage(toChatId, msgId, options);
                    }, { toChatId: toChatId, msgId: msgId, options: options })];
            });
        });
    };
    /**
     * Forwards array of messages (could be ids or message objects)
     * What is the difference between forwardMessage and forwardMessagesV2?
     * forwardMessage was used to forward a single message
     * forwardMessagesV2 is used to forward multiple messages
     * Also, it fixes how we pass the arguments to the whatsapp original function
     * From positional args to named args (object)
     * @category Chat
     * @param to Chat id
     * @param messages Array of messages ids to be forwarded
     * @param options
     * @returns array of messages ID
     */
    SenderLayer.prototype.forwardMessagesV2 = function (toChatId, messages, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var toChatId = _a.toChatId, messages = _a.messages, options = _a.options;
                        return WPP.chat.forwardMessages(toChatId, messages, options);
                    }, { toChatId: toChatId, messages: messages, options: options })];
            });
        });
    };
    /**
     * Generates sticker from the provided animated gif image and sends it (Send image as animated sticker)
     *
     * @example
     * ```javascript
     * client.sendImageAsStickerGif('000000000000@c.us', 'base64....');
     * ```
     *
     * @example
     * Send Sticker with reply
     * ```javascript
     * client.sendImageAsStickerGif('000000000000@c.us', 'base64....', {
     *     quotedMsg: 'msgId',
     * });
     * ```
     * @category Chat
     * @param pathOrBase64 image path imageBase64 A valid gif image is required. You can also send via http/https (http://www.website.com/img.gif)
     * @param to chatId '000000000000@c.us'
     */
    SenderLayer.prototype.sendImageAsStickerGif = function (to, pathOrBase64, options) {
        return __awaiter(this, void 0, void 0, function () {
            var base64, fileContent, error, mimeInfo, error, buff, obj, error, webpBase64;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        base64 = '';
                        if (!pathOrBase64.startsWith('data:')) return [3 /*break*/, 1];
                        base64 = pathOrBase64;
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, (0, helpers_1.downloadFileToBase64)(pathOrBase64, [
                            'image/gif',
                            'image/webp',
                        ])];
                    case 2:
                        fileContent = _a.sent();
                        if (!!fileContent) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, helpers_1.fileToBase64)(pathOrBase64)];
                    case 3:
                        fileContent = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (fileContent) {
                            base64 = fileContent;
                        }
                        _a.label = 5;
                    case 5:
                        if (!base64) {
                            error = new Error('Empty or invalid file or base64');
                            Object.assign(error, {
                                code: 'empty_file',
                            });
                            throw error;
                        }
                        mimeInfo = (0, helpers_1.base64MimeType)(base64);
                        if (!mimeInfo || !mimeInfo.includes('image')) {
                            error = new Error('Not an image, allowed formats gig and webp');
                            Object.assign(error, {
                                code: 'invalid_image',
                            });
                            throw error;
                        }
                        buff = Buffer.from(base64.replace(/^data:image\/(gif|webp);base64,/, ''), 'base64');
                        return [4 /*yield*/, (0, helpers_1.stickerSelect)(buff, 1)];
                    case 6:
                        obj = _a.sent();
                        if (!obj) {
                            error = new Error('Error with sharp library, check the console log');
                            Object.assign(error, {
                                code: 'sharp_error',
                            });
                            throw error;
                        }
                        webpBase64 = obj.webpBase64;
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                                var to = _a.to, webpBase64 = _a.webpBase64, options = _a.options;
                                return WPP.chat.sendFileMessage(to, webpBase64, __assign({ type: 'sticker' }, options));
                            }, { to: to, webpBase64: webpBase64, options: options })];
                    case 7: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Generates sticker from given image and sends it (Send Image As Sticker)
     *
     * @example
     * ```javascript
     * client.sendImageAsSticker('000000000000@c.us', 'base64....');
     * ```
     *
     * @example
     * Send Sticker with reply
     * ```javascript
     * client.sendImageAsSticker('000000000000@c.us', 'base64....', {
     *     quotedMsg: 'msgId',
     * });
     * ```
     *
     * @category Chat
     * @param pathOrBase64 image path imageBase64 A valid png, jpg and webp image is required. You can also send via http/https (http://www.website.com/img.gif)
     * @param to chatId '000000000000@c.us'
     */
    SenderLayer.prototype.sendImageAsSticker = function (to, pathOrBase64, options) {
        return __awaiter(this, void 0, void 0, function () {
            var base64, fileContent, error, mimeInfo, error, buff, obj, error, webpBase64;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        base64 = '';
                        if (!pathOrBase64.startsWith('data:')) return [3 /*break*/, 1];
                        base64 = pathOrBase64;
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, (0, helpers_1.downloadFileToBase64)(pathOrBase64, [
                            'image/gif',
                            'image/png',
                            'image/jpg',
                            'image/jpeg',
                            'image/webp',
                        ])];
                    case 2:
                        fileContent = _a.sent();
                        if (!!fileContent) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, helpers_1.fileToBase64)(pathOrBase64)];
                    case 3:
                        fileContent = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (fileContent) {
                            base64 = fileContent;
                        }
                        _a.label = 5;
                    case 5:
                        if (!base64) {
                            error = new Error('Empty or invalid file or base64');
                            Object.assign(error, {
                                code: 'empty_file',
                            });
                            throw error;
                        }
                        mimeInfo = (0, helpers_1.base64MimeType)(base64);
                        if (!mimeInfo || !mimeInfo.includes('image')) {
                            error = new Error('Not an image, allowed formats png, jpeg, webp and gif');
                            Object.assign(error, {
                                code: 'invalid_image',
                            });
                            throw error;
                        }
                        buff = Buffer.from(base64.replace(/^data:image\/(png|jpe?g|webp|gif);base64,/, ''), 'base64');
                        return [4 /*yield*/, (0, helpers_1.stickerSelect)(buff, 0)];
                    case 6:
                        obj = _a.sent();
                        if (!obj) {
                            error = new Error('Error with sharp library, check the console log');
                            Object.assign(error, {
                                code: 'sharp_error',
                            });
                            throw error;
                        }
                        webpBase64 = obj.webpBase64;
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                                var to = _a.to, webpBase64 = _a.webpBase64, options = _a.options;
                                return WPP.chat.sendFileMessage(to, webpBase64, __assign({ type: 'sticker' }, options));
                            }, { to: to, webpBase64: webpBase64, options: options })];
                    case 7: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SenderLayer.prototype.sendLocation = function (to, latitudeOrOptions, longitude, title) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = typeof latitudeOrOptions === 'string'
                            ? {
                                lat: latitudeOrOptions,
                                lng: longitude,
                                title: title,
                            }
                            : latitudeOrOptions;
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                var result;
                                var _c;
                                var to = _b.to, options = _b.options;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0: return [4 /*yield*/, WPP.chat.sendLocationMessage(to, options)];
                                        case 1:
                                            result = _d.sent();
                                            _c = {
                                                ack: result.ack,
                                                id: result.id
                                            };
                                            return [4 /*yield*/, result.sendMsgResult];
                                        case 2: return [2 /*return*/, (_c.sendMsgResult = _d.sent(),
                                                _c)];
                                    }
                                });
                            }); }, { to: to, options: options })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Sets a chat status to seen. Marks all messages as ack: 3
     * @category Chat
     * @param chatId chat id: xxxxx@us.c
     */
    SenderLayer.prototype.sendSeen = function (chatId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (chatId) { return WPP.chat.markIsRead(chatId); }, chatId)];
            });
        });
    };
    /**
     * Sets a audio or image view once. Marks message as played
     * @category Chat
     * @param msgId Message id: xxxxx@us.c
     */
    SenderLayer.prototype.markPlayed = function (msgId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (msgId) { return WPP.chat.markPlayed(msgId); }, msgId)];
            });
        });
    };
    /**
     * Starts typing ('Typing...' state)
     *
     * @example
     * ```javascript
     * // Keep sending typing state, use stopTyping to finish
     * await client.startTyping('[number]@c.us');
     *
     * // Keep sending typing state for 5 seconds
     * await client.startTyping('[number]@c.us', 5000);
     * ```
     * @category Chat
     * @param to Chat Id
     * @param duration Duration um miliseconds
     */
    SenderLayer.prototype.startTyping = function (to, duration) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var to = _a.to, duration = _a.duration;
                        return WPP.chat.markIsComposing(to, duration);
                    }, {
                        to: to,
                        duration: duration,
                    })];
            });
        });
    };
    /**
     * Stops typing ('Typing...' state)
     * @category Chat
     * @param to Chat Id
     */
    SenderLayer.prototype.stopTyping = function (to) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var to = _a.to;
                        return WPP.chat.markIsPaused(to);
                    }, {
                        to: to,
                    })];
            });
        });
    };
    /**
     * Starts recording ('Recording...' state)
     * @example
     * ```javascript
     * // Keep sending recording state, use stopRecoring to finish
     * await client.startRecording('[number]@c.us');
     *
     * // Keep sending typing state for 5 seconds
     * await client.startRecording('[number]@c.us', 5000);
     * ```
     * @category Chat
     * @param to Chat Id
     * @param duration Duration um miliseconds
     */
    SenderLayer.prototype.startRecording = function (to, duration) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var to = _a.to, duration = _a.duration;
                        return WPP.chat.markIsRecording(to, duration);
                    }, {
                        to: to,
                        duration: duration,
                    })];
            });
        });
    };
    /**
     * Stops recording ('Recording...' state)
     * @category Chat
     * @param to Chat Id
     */
    SenderLayer.prototype.stopRecoring = function (to) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var to = _a.to;
                        return WPP.chat.markIsPaused(to);
                    }, {
                        to: to,
                    })];
            });
        });
    };
    /**
     * Update your online presence
     * @category Chat
     * @param online true for available presence and false for unavailable
     */
    SenderLayer.prototype.setOnlinePresence = function () {
        return __awaiter(this, arguments, void 0, function (online) {
            if (online === void 0) { online = true; }
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var online = _a.online;
                        return WPP.conn.markAvailable(online);
                    }, {
                        online: online,
                    })];
            });
        });
    };
    /**
     * Sends text with tags
     * @category Chat
     */
    SenderLayer.prototype.sendMentioned = function (to, message, mentioned) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var to = _a.to, message = _a.message, mentioned = _a.mentioned;
                            return WPP.chat.sendTextMessage(to, message, {
                                detectMentioned: true,
                                mentionedList: mentioned,
                            });
                        }, { to: to, message: message, mentioned: mentioned })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Sends a list message
     *
     * ```typescript
     *   // Example
     *   client.sendListMessage('<number>@c.us', {
     *     buttonText: 'Click here',
     *     description: 'Choose one option',
     *     sections: [
     *       {
     *         title: 'Section 1',
     *         rows: [
     *           {
     *             rowId: 'my_custom_id',
     *             title: 'Test 1',
     *             description: 'Description 1',
     *           },
     *           {
     *             rowId: '2',
     *             title: 'Test 2',
     *             description: 'Description 2',
     *           },
     *         ],
     *       },
     *     ],
     *   });
     * ```
     *
     * @category Chat
     */
    SenderLayer.prototype.sendListMessage = function (to, options) {
        return __awaiter(this, void 0, void 0, function () {
            var sendResult, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var to = _a.to, options = _a.options;
                            return WPP.chat.sendListMessage(to, options);
                        }, {
                            to: to,
                            options: options,
                        })];
                    case 1:
                        sendResult = _a.sent();
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
                            }); }, { messageId: sendResult.id })];
                    case 2:
                        result = (_a.sent());
                        if (result['erro'] == true) {
                            throw result;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Send a create poll message
     *
     * @example
     * ```javascript
     * // Single pool
     * client.sendPollMessage(
     *  '[number]@g.us',
     *  'A poll name',
     *  ['Option 1', 'Option 2', 'Option 3']
     * );
     * ```
     * // Selectable Count
     * ```javascript
     * // Single pool
     * client.sendPollMessage(
     *  '[number]@g.us',
     *  'A poll name',
     *  ['Option 1', 'Option 2', 'Option 3'],
     *  {
     *    selectableCount: 1,
     *  }
     * );
     * ```
     *
     * @category Chat
     */
    SenderLayer.prototype.sendPollMessage = function (chatId, name, choices, options) {
        return __awaiter(this, void 0, void 0, function () {
            var sendResult, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var chatId = _a.chatId, name = _a.name, choices = _a.choices, options = _a.options;
                            return WPP.chat.sendCreatePollMessage(chatId, name, choices, options);
                        }, {
                            chatId: chatId,
                            name: name,
                            choices: choices,
                            options: options,
                        })];
                    case 1:
                        sendResult = _a.sent();
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
                            }); }, { messageId: sendResult.id })];
                    case 2:
                        result = (_a.sent());
                        if (result['erro'] == true) {
                            throw result;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Sets the chat state
     * Deprecated in favor of Use startTyping or startRecording functions
     * @category Chat
     * @param chatState
     * @param chatId
     * @deprecated Deprecated in favor of Use startTyping or startRecording functions
     */
    SenderLayer.prototype.setChatState = function (chatId, chatState) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var chatState = _a.chatState, chatId = _a.chatId;
                            WAPI.sendChatstate(chatState, chatId);
                        }, { chatState: chatState, chatId: chatId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Send reaction to message
     * @example
     * ```javascript
     * // For send Reaction, just to send emoji
     * await client.sendReactionToMessage('[number]@c.us', '🤯');
     *
     * // to remove reacition
     * await client.startRecording('[number]@c.us', false);
     * ```
     * @category Chat
     * @param to Chat Id
     * @param duration Duration um miliseconds
     */
    SenderLayer.prototype.sendReactionToMessage = function (msgId, reaction) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var msgId = _a.msgId, reaction = _a.reaction;
                        return WPP.chat.sendReactionToMessage(msgId, reaction);
                    }, {
                        msgId: msgId,
                        reaction: reaction,
                    })];
            });
        });
    };
    /**
     * Send a order message
     * To send (prices, tax, shipping or discount), for example: USD 12.90, send them without dots or commas, like: 12900
     *
     * @example
     * ```javascript
     * // Send Order with a product
     * client.sendOrderMessage('[number]@c.us', [
     *   { type: 'product', id: '67689897878', qnt: 2 },
     *   { type: 'product', id: '37878774457', qnt: 1 },
     * ]
     *
     * // Send Order with a custom item
     * client.sendOrderMessage('[number]@c.us', [
     *   { type: 'custom', name: 'Item de cost test', price: 120000, qnt: 2 },
     * ]
     *
     * // Send Order with custom options
     * client.sendOrderMessage('[number]@c.us', [
     *   { type: 'product', id: '37878774457', qnt: 1 },
     *   { type: 'custom', name: 'Item de cost test', price: 120000, qnt: 2 },
     * ],
     * { tax: 10000, shipping: 4000, discount: 10000 }
     * ```
     *
     * @category Chat
     */
    SenderLayer.prototype.sendOrderMessage = function (to, items, options) {
        return __awaiter(this, void 0, void 0, function () {
            var sendResult, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var to = _a.to, items = _a.items, options = _a.options;
                            return WPP.chat.sendChargeMessage(to, items, options);
                        }, {
                            to: to,
                            items: items,
                            options: options,
                        })];
                    case 1:
                        sendResult = _a.sent();
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
                            }); }, { messageId: sendResult.id })];
                    case 2:
                        result = (_a.sent());
                        if (result['erro'] == true) {
                            throw result;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return SenderLayer;
}(listener_layer_1.ListenerLayer));
exports.SenderLayer = SenderLayer;
