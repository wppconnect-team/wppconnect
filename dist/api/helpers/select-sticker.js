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
exports.stickerSelect = stickerSelect;
exports.resizeImg = resizeImg;
var sharp_1 = __importDefault(require("sharp"));
function stickerSelect(_B, _t) {
    return __awaiter(this, void 0, void 0, function () {
        var _w, _ins, _a, metadata, obj;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = _t;
                    switch (_a) {
                        case 0: return [3 /*break*/, 1];
                        case 1: return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 4];
                case 1: return [4 /*yield*/, (0, sharp_1.default)(_B, { failOnError: false })
                        .resize({ width: 512, height: 512 })
                        .toBuffer()];
                case 2:
                    _ins = _c.sent();
                    _w = (0, sharp_1.default)(_ins, { failOnError: false }).webp();
                    return [3 /*break*/, 5];
                case 3:
                    _w = (0, sharp_1.default)(_B, { animated: true }).webp();
                    return [3 /*break*/, 5];
                case 4:
                    console.error('Enter a valid number 0 or 1');
                    return [2 /*return*/, false];
                case 5: return [4 /*yield*/, _w.metadata()];
                case 6:
                    metadata = _c.sent();
                    if (metadata.width > 512 || metadata.pageHeight > 512) {
                        console.error("Invalid image size (max 512x512):".concat(metadata.width, "x").concat(metadata.pageHeight));
                        return [2 /*return*/, false];
                    }
                    _b = {};
                    return [4 /*yield*/, _w.toBuffer()];
                case 7:
                    obj = (_b.webpBase64 = (_c.sent()).toString('base64'),
                        _b.metadata = {
                            width: metadata.width,
                            height: metadata.pageHeight,
                        },
                        _b);
                    return [2 /*return*/, obj];
            }
        });
    });
}
function resizeImg(buff, size) {
    return __awaiter(this, void 0, void 0, function () {
        var _ins, _w, _webb64;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sharp_1.default)(buff, { failOnError: false })
                        .resize({ width: size.width, height: size.height })
                        .toBuffer()];
                case 1:
                    _ins = _a.sent(), _w = (0, sharp_1.default)(_ins, { failOnError: false }).jpeg();
                    return [4 /*yield*/, _w.toBuffer()];
                case 2:
                    _webb64 = (_a.sent()).toString('base64');
                    return [2 /*return*/, _webb64];
            }
        });
    });
}
