"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTokenStore = exports.defaultFileTokenStoreOptions = void 0;
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
/// <reference types="node" />
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var sanitize_filename_1 = __importDefault(require("sanitize-filename"));
var logger_1 = require("../utils/logger");
var isValidSessionToken_1 = require("./isValidSessionToken");
exports.defaultFileTokenStoreOptions = {
    decodeFunction: JSON.parse,
    encodeFunction: JSON.stringify,
    encoding: 'utf8',
    fileExtension: '.data.json',
    path: './tokens',
};
/**
 * Token Store using file
 *
 * ```typescript
 * // Example of typescript with FileTokenStore
 * import * as wppconnect from '@wppconnect-team/wppconnect';
 *
 * const myTokenStore = new wppconnect.tokenStore.FileTokenStore({
 * // decodeFunction: JSON.parse,
 * // encodeFunction: JSON.stringify,
 * // encoding: 'utf8',
 * // fileExtension: '.my.ext',
 * // path: './a_custom_path',
 * });
 *
 * wppconnect.create({
 *   session: 'mySession',
 *   tokenStore: myTokenStore,
 * });
 *
 * wppconnect.create({
 *   session: 'otherSession',
 *   tokenStore: myTokenStore,
 * });
 * ```
 */
var FileTokenStore = /** @class */ (function () {
    function FileTokenStore(options) {
        if (options === void 0) { options = {}; }
        this.options = Object.assign({}, exports.defaultFileTokenStoreOptions, options);
    }
    /**
     * Resolve the path of file
     * @param sessionName Name of session
     * @returns Full path of token file
     */
    FileTokenStore.prototype.resolverPath = function (sessionName) {
        var filename = (0, sanitize_filename_1.default)(sessionName) + this.options.fileExtension;
        return path.resolve(process.cwd(), path.join(this.options.path, filename));
    };
    FileTokenStore.prototype.getToken = function (sessionName) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = this.resolverPath(sessionName);
                        if (!fs.existsSync(filePath)) {
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, fs.promises
                                .readFile(filePath, {
                                encoding: this.options.encoding,
                            })
                                .catch(function () { return null; })];
                    case 1:
                        text = _a.sent();
                        if (!text) {
                            return [2 /*return*/, undefined];
                        }
                        try {
                            return [2 /*return*/, this.options.decodeFunction(text)];
                        }
                        catch (error) {
                            logger_1.defaultLogger.debug(error);
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FileTokenStore.prototype.setToken = function (sessionName, tokenData) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, text, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tokenData || !(0, isValidSessionToken_1.isValidSessionToken)(tokenData)) {
                            return [2 /*return*/, false];
                        }
                        if (!!fs.existsSync(this.options.path)) return [3 /*break*/, 2];
                        return [4 /*yield*/, fs.promises.mkdir(this.options.path, { recursive: true })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        filePath = this.resolverPath(sessionName);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        text = this.options.encodeFunction(tokenData);
                        return [4 /*yield*/, fs.promises.writeFile(filePath, text, {
                                encoding: this.options.encoding,
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 5:
                        error_1 = _a.sent();
                        logger_1.defaultLogger.debug(error_1);
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FileTokenStore.prototype.removeToken = function (sessionName) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = this.resolverPath(sessionName);
                        if (!fs.existsSync(filePath)) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs.promises.unlink(filePath)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_2 = _a.sent();
                        logger_1.defaultLogger.debug(error_2);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FileTokenStore.prototype.listTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fs.existsSync(this.options.path)) {
                            return [2 /*return*/, []];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs.promises.readdir(this.options.path)];
                    case 2:
                        files = _a.sent();
                        // Only sessions with same fileExtension
                        files = files.filter(function (file) { return file.endsWith(_this.options.fileExtension); });
                        // Return name only
                        files = files.map(function (file) {
                            return path.basename(file, _this.options.fileExtension);
                        });
                        return [2 /*return*/, files];
                    case 3:
                        error_3 = _a.sent();
                        logger_1.defaultLogger.debug(error_3);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return FileTokenStore;
}());
exports.FileTokenStore = FileTokenStore;
