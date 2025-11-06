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
exports.isConnectingToPhone = exports.isInsideChat = exports.needsToScan = exports.isAuthenticated = exports.getInterfaceStatus = void 0;
exports.asciiQr = asciiQr;
var qrcode = __importStar(require("qrcode-terminal"));
var getInterfaceStatus = function (waPage) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, waPage
                    .waitForFunction(function () {
                    var _a, _b;
                    var elLoginWrapper = document.querySelector('body > div > div > .landing-wrapper');
                    var elQRCodeCanvas = document.querySelector('canvas');
                    if (elLoginWrapper && elQRCodeCanvas) {
                        return 'UNPAIRED';
                    }
                    var streamStatus = (_b = (_a = WPP === null || WPP === void 0 ? void 0 : WPP.whatsapp) === null || _a === void 0 ? void 0 : _a.Stream) === null || _b === void 0 ? void 0 : _b.displayInfo;
                    if (['PAIRING', 'RESUMING', 'SYNCING'].includes(streamStatus)) {
                        return 'PAIRING';
                    }
                    var elChat = document.querySelector('.app,.two');
                    if (elChat && elChat.attributes && elChat.tabIndex) {
                        return 'CONNECTED';
                    }
                    return false;
                }, {
                    timeout: 0,
                    polling: 100,
                })
                    .then(function (element) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, element.evaluate(function (a) { return a; })];
                            case 1: return [2 /*return*/, (_a.sent())];
                        }
                    });
                }); })
                    .catch(function () { return null; })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getInterfaceStatus = getInterfaceStatus;
/**
 * Validates if client is authenticated
 * @returns true if is authenticated, false otherwise
 * @param waPage
 */
var isAuthenticated = function (waPage) {
    return waPage.evaluate(function () { return WPP.conn.isRegistered(); });
};
exports.isAuthenticated = isAuthenticated;
var needsToScan = function (waPage) { return __awaiter(void 0, void 0, void 0, function () {
    var connected;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.isAuthenticated)(waPage)];
            case 1:
                connected = _a.sent();
                return [2 /*return*/, !connected];
        }
    });
}); };
exports.needsToScan = needsToScan;
var isInsideChat = function (waPage) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, waPage.evaluate(function () { return WPP.conn.isMainReady(); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.isInsideChat = isInsideChat;
var isConnectingToPhone = function (waPage) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, waPage.evaluate(function () { return WPP.conn.isMainLoaded() && !WPP.conn.isMainReady(); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.isConnectingToPhone = isConnectingToPhone;
function asciiQr(code) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    qrcode.generate(code, { small: true }, function (qrcode) {
                        resolve(qrcode);
                    });
                })];
        });
    });
}
