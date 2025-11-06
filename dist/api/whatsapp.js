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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whatsapp = void 0;
var axios_1 = __importDefault(require("axios"));
var WAuserAgente_1 = require("../config/WAuserAgente");
var helpers_1 = require("./helpers");
var decrypt_1 = require("./helpers/decrypt");
var business_layer_1 = require("./layers/business.layer");
var fs = __importStar(require("fs"));
var sleep_1 = require("../utils/sleep");
var Whatsapp = /** @class */ (function (_super) {
    __extends(Whatsapp, _super);
    function Whatsapp(page, session, options) {
        var _this = _super.call(this, page, session, options) || this;
        _this.page = page;
        _this.connected = null;
        _this.downloadEncryptedFile = function (url_1, outputPath_1) {
            var args_1 = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args_1[_i - 2] = arguments[_i];
            }
            return __awaiter(_this, __spreadArray([url_1, outputPath_1], args_1, true), void 0, function (url, outputPath, retries) {
                var _loop_1, attempt, state_1;
                if (retries === void 0) { retries = 3; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _loop_1 = function (attempt) {
                                var response_1, error_1;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 3, , 5]);
                                            return [4 /*yield*/, axios_1.default.get(url, (0, decrypt_1.makeOptions)(WAuserAgente_1.useragentOverride, 'stream'))];
                                        case 1:
                                            response_1 = _b.sent();
                                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                    var writer = fs.createWriteStream(outputPath);
                                                    response_1.data.pipe(writer);
                                                    writer.on('finish', resolve);
                                                    writer.on('error', reject);
                                                })];
                                        case 2:
                                            _b.sent();
                                            console.log("Encrypted file downloaded at ".concat(outputPath));
                                            return [2 /*return*/, { value: void 0 }];
                                        case 3:
                                            error_1 = _b.sent();
                                            console.error("Attempt ".concat(attempt, " failed: "), error_1.message);
                                            if (attempt === retries) {
                                                console.error("".concat(outputPath, " - All attempt failed to download the file: ").concat(url));
                                                throw error_1;
                                            }
                                            console.log("".concat(outputPath, " - Retrying to download the file: ").concat(url, " in 5 seconds..."));
                                            return [4 /*yield*/, (0, sleep_1.sleep)(5000)];
                                        case 4:
                                            _b.sent();
                                            return [3 /*break*/, 5];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            };
                            attempt = 1;
                            _a.label = 1;
                        case 1:
                            if (!(attempt <= retries)) return [3 /*break*/, 4];
                            return [5 /*yield**/, _loop_1(attempt)];
                        case 2:
                            state_1 = _a.sent();
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                            _a.label = 3;
                        case 3:
                            attempt++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        var interval = null;
        if (_this.page) {
            _this.page.on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    clearInterval(interval);
                    return [2 /*return*/];
                });
            }); });
        }
        interval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var newConnected;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page
                            .evaluate(function () { return WPP.conn.isRegistered(); })
                            .catch(function () { return null; })];
                    case 1:
                        newConnected = _a.sent();
                        if (newConnected === null || newConnected === this.connected) {
                            return [2 /*return*/];
                        }
                        this.connected = newConnected;
                        if (!newConnected) {
                            this.log('info', 'Session Unpaired', { type: 'session' });
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (this.statusFind) {
                                        try {
                                            this.statusFind('desconnectedMobile', session);
                                        }
                                        catch (error) { }
                                    }
                                    return [2 /*return*/];
                                });
                            }); }, 1000);
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 1000);
        return _this;
    }
    Whatsapp.prototype.afterPageScriptInjected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.afterPageScriptInjected.call(this)];
                    case 1:
                        _a.sent();
                        this.page
                            .evaluate(function () { return WPP.conn.isRegistered(); })
                            .then(function (isAuthenticated) {
                            _this.connected = isAuthenticated;
                        })
                            .catch(function () { return null; });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Decrypts message file
     * @param data Message object
     * @returns Decrypted file buffer (null otherwise)
     */
    Whatsapp.prototype.downloadFile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (data) { return WAPI.downloadFile(data); }, data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Download and returns the media content in base64 format
     * @param messageId Message or id
     * @returns Base64 of media
     */
    Whatsapp.prototype.downloadMedia = function (messageId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof messageId !== 'string') {
                            messageId = messageId.id;
                        }
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (messageId) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _b = (_a = WPP.util).blobToBase64;
                                        return [4 /*yield*/, WPP.chat.downloadMedia(messageId)];
                                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                                }
                            }); }); }, messageId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Object.defineProperty(Whatsapp.prototype, "waPage", {
        /**
         * Get the puppeteer page instance
         * @returns The Whatsapp page
         */
        get: function () {
            return this.page;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the puppeteer page screenshot
     * @returns The Whatsapp page screenshot as a PNG encoded in base64 (not the full data URI, just the base64 section)
     */
    Whatsapp.prototype.takeScreenshot = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.page) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.page.screenshot({ encoding: 'base64' })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clicks on 'use here' button (When it gets unlaunched)
     * This method tracks the class of the button
     * WhatsApp Web might change this class name over time
     * Don't rely on this method
     */
    Whatsapp.prototype.useHere = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WAPI.takeOver(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Log out of WhatsApp
     * @returns boolean
     */
    Whatsapp.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WPP.conn.logout(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Closes page and browser
     * @internal
     */
    Whatsapp.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var browser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        browser = this.page.browser();
                        if (!!this.page.isClosed()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.page.close().catch(function () { return null; })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.close().catch(function () { return null; })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Return PID process
     * @internal
     */
    Whatsapp.prototype.getPID = function () {
        var browser = this.page.browser();
        var process = browser.process();
        return process.pid;
    };
    /**
     * Get a message by its ID
     * @param messageId string
     * @returns Message object
     */
    Whatsapp.prototype.getMessageById = function (messageId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (messageId) { return WAPI.getMessageById(messageId); }, messageId)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /**
     * Returns a list of messages from a chat
     * @param chatId string ID of the conversation or group
     * @param params GetMessagesParam Result filtering options (count, id, direction) see {@link GetMessagesParam}.
     * @returns Message object
     */
    Whatsapp.prototype.getMessages = function (chatId_1) {
        return __awaiter(this, arguments, void 0, function (chatId, params) {
            if (params === void 0) { params = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var chatId = _a.chatId, params = _a.params;
                            return WAPI.getMessages(chatId, params);
                        }, { chatId: chatId, params: params })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Decrypts message file
     * @param message Message object
     * @returns Decrypted file buffer (`null` otherwise)
     */
    Whatsapp.prototype.decryptFile = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaUrl, options, haventGottenImageYet, res, error_2, buff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mediaUrl = message.clientUrl || message.deprecatedMms3Url;
                        options = (0, decrypt_1.makeOptions)(WAuserAgente_1.useragentOverride);
                        if (!mediaUrl)
                            throw new Error('message is missing critical data (`mediaUrl`) needed to download the file.');
                        haventGottenImageYet = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        _a.label = 2;
                    case 2:
                        if (!haventGottenImageYet) return [3 /*break*/, 7];
                        return [4 /*yield*/, axios_1.default.get(mediaUrl.trim(), options)];
                    case 3:
                        res = _a.sent();
                        if (!(res.status == 200)) return [3 /*break*/, 4];
                        haventGottenImageYet = false;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, (0, decrypt_1.timeout)(2000)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_2 = _a.sent();
                        throw 'Error trying to download the file.';
                    case 9:
                        buff = Buffer.from(res.data, 'binary');
                        return [2 /*return*/, (0, decrypt_1.magix)(buff, message.mediaKey, message.type, message.size)];
                }
            });
        });
    };
    Whatsapp.prototype.decryptAndSaveFile = function (message, savePath) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaUrl, tempSavePath_1, inputReadStream, outputWriteStream_1, decryptedStream_1, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mediaUrl = message.clientUrl || message.deprecatedMms3Url;
                        if (!mediaUrl) {
                            throw new Error('Message is missing critical data needed to download the file.');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        tempSavePath_1 = savePath + '.encrypted';
                        return [4 /*yield*/, this.downloadEncryptedFile(mediaUrl.trim(), tempSavePath_1)];
                    case 2:
                        _a.sent();
                        inputReadStream = fs.createReadStream(tempSavePath_1);
                        outputWriteStream_1 = fs.createWriteStream(savePath);
                        decryptedStream_1 = (0, decrypt_1.newMagix)(message.mediaKey, message.type, message.size);
                        inputReadStream.pipe(decryptedStream_1).pipe(outputWriteStream_1);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                outputWriteStream_1.on('finish', function () {
                                    console.log("Deciphering complete. Deleting the encrypted file: ".concat(tempSavePath_1));
                                    fs.unlink(tempSavePath_1, function (error) {
                                        if (error) {
                                            console.error("Error deleting the input file: ".concat(tempSavePath_1), error);
                                            reject(error);
                                        }
                                        else {
                                            console.log('Encrypted file deleted successfully');
                                            resolve();
                                        }
                                    });
                                });
                                outputWriteStream_1.on('error', function (error) {
                                    console.error("Error during writing file: ".concat(savePath), error);
                                    reject(error);
                                });
                                decryptedStream_1.on('error', function (error) {
                                    console.error('An error occurred while decrypting the file', error);
                                    reject(error);
                                });
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Rejects a call received via WhatsApp
     * @param callId string Call ID, if not passed, all calls will be rejected
     * @returns Number of rejected calls
     */
    Whatsapp.prototype.rejectCall = function (callId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                            var callId = _a.callId;
                            return WPP.call.rejectCall(callId);
                        }, {
                            callId: callId,
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Whatsapp;
}(business_layer_1.BusinessLayer));
exports.Whatsapp = Whatsapp;
