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
exports.StatusLayer = void 0;
var labels_layer_1 = require("./labels.layer");
var helpers_1 = require("../helpers");
var StatusLayer = /** @class */ (function (_super) {
    __extends(StatusLayer, _super);
    function StatusLayer(page, session, options) {
        var _this = _super.call(this, page, session, options) || this;
        _this.page = page;
        return _this;
    }
    /**
     * Send a image message to status stories
     * @category Status
     *
     * @example
     * ```javascript
     * client.sendImageStatus('data:image/jpeg;base64,<a long base64 file...>');
     * ```
     *
     * @example
     * ```javascript
     * // Send with caption
     * client.sendImageStatus('data:image/jpeg;base64,<a long base64 file...>', { caption: 'example test' } );
     * ```
     * @param pathOrBase64 Path or base 64 image
     */
    StatusLayer.prototype.sendImageStatus = function (pathOrBase64, options) {
        return __awaiter(this, void 0, void 0, function () {
            var base64, fileContent, error, mimeInfo, error;
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
                            error = new Error('Not an image, allowed formats png, jpeg and webp');
                            Object.assign(error, {
                                code: 'invalid_image',
                            });
                            throw error;
                        }
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                                var base64 = _a.base64, options = _a.options;
                                WPP.status.sendImageStatus(base64, options);
                            }, { base64: base64, options: options })];
                    case 6: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Send a video message to status stories
     * @category Status
     *
     * @example
     * ```javascript
     * client.sendVideoStatus('data:video/mp4;base64,<a long base64 file...>');
     * ```
     * @example
     * ```javascript
     * // Send with caption
     * client.sendVideoStatus('data:video/mp4;base64,<a long base64 file...>', { caption: 'example test' } );
     * ```
     * @param pathOrBase64 Path or base 64 image
     */
    StatusLayer.prototype.sendVideoStatus = function (pathOrBase64, options) {
        return __awaiter(this, void 0, void 0, function () {
            var base64, fileContent, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        _a.label = 5;
                    case 5:
                        if (!base64) {
                            error = new Error('Empty or invalid file or base64');
                            Object.assign(error, {
                                code: 'empty_file',
                            });
                            throw error;
                        }
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                                var base64 = _a.base64, options = _a.options;
                                WPP.status.sendVideoStatus(base64, options);
                            }, { base64: base64, options: options })];
                    case 6: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Send a text to status stories
     * @category Status
     *
     * @example
     * ```javascript
     * client.sendTextStatus(`Bootstrap primary color: #0275d8`, { backgroundColor: '#0275d8', font: 2});
     * ```
     * @param pathOrBase64 Path or base 64 image
     */
    StatusLayer.prototype.sendTextStatus = function (text, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var text = _a.text, options = _a.options;
                            WPP.status.sendTextStatus(text, options);
                        }, { text: text, options: options })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Mark status as read/seen
     * @category Status
     *
     * @example
     * ```javascript
     * client.sendReadStatus('[phone_number]@c.us', 'false_status@broadcast_3A169E0FD4BC6E92212F_[]@c.us');
     * ```
     * @param chatId Chat ID of contact
     * @param statusId ID of status msg
     */
    StatusLayer.prototype.sendReadStatus = function (chatId, statusId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var chatId = _a.chatId, statusId = _a.statusId;
                            WPP.status.sendReadStatus(chatId, statusId);
                        }, { chatId: chatId, statusId: statusId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return StatusLayer;
}(labels_layer_1.LabelsLayer));
exports.StatusLayer = StatusLayer;
