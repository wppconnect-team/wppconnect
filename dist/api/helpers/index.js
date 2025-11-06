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
exports.evaluateAndReturn = exports.scrapeLogin = exports.scrapeImg = exports.resizeImg = exports.stickerSelect = exports.downloadFileToBase64 = exports.base64MimeType = exports.fileToBase64 = void 0;
var file_to_base64_1 = require("./file-to-base64");
Object.defineProperty(exports, "fileToBase64", { enumerable: true, get: function () { return file_to_base64_1.fileToBase64; } });
var base64_mimetype_1 = require("./base64-mimetype");
Object.defineProperty(exports, "base64MimeType", { enumerable: true, get: function () { return base64_mimetype_1.base64MimeType; } });
var download_file_1 = require("./download-file");
Object.defineProperty(exports, "downloadFileToBase64", { enumerable: true, get: function () { return download_file_1.downloadFileToBase64; } });
var select_sticker_1 = require("./select-sticker");
Object.defineProperty(exports, "stickerSelect", { enumerable: true, get: function () { return select_sticker_1.stickerSelect; } });
Object.defineProperty(exports, "resizeImg", { enumerable: true, get: function () { return select_sticker_1.resizeImg; } });
var scrape_img_qr_1 = require("./scrape-img-qr");
Object.defineProperty(exports, "scrapeImg", { enumerable: true, get: function () { return scrape_img_qr_1.scrapeImg; } });
var scrape_login_1 = require("./scrape-login");
Object.defineProperty(exports, "scrapeLogin", { enumerable: true, get: function () { return scrape_login_1.scrapeLogin; } });
var evaluate_and_return_1 = require("./evaluate-and-return");
Object.defineProperty(exports, "evaluateAndReturn", { enumerable: true, get: function () { return evaluate_and_return_1.evaluateAndReturn; } });
