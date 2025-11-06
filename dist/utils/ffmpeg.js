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
exports.getFfmpegPath = getFfmpegPath;
exports.convertToMP4GIF = convertToMP4GIF;
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
var execa_1 = __importDefault(require("execa"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var rimraf_1 = __importDefault(require("rimraf"));
var tmp = __importStar(require("tmp"));
var lookpath_1 = require("lookpath");
var tmpDir = tmp.dirSync({});
var i = 0;
process.on('exit', function () {
    // Remove only on exit signal
    try {
        // Use rimraf because it is synchronous
        rimraf_1.default.sync(tmpDir.name);
    }
    catch (error) { }
});
function getFfmpegPath() {
    return __awaiter(this, void 0, void 0, function () {
        var ffmpegPath, isExecutable;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ffmpegPath = process.env['FFMPEG_PATH'];
                    if (!ffmpegPath) return [3 /*break*/, 2];
                    return [4 /*yield*/, fs.promises
                            .access(ffmpegPath, fs.constants.X_OK)
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 1:
                    isExecutable = _a.sent();
                    if (isExecutable) {
                        return [2 /*return*/, ffmpegPath];
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, (0, lookpath_1.lookpath)('ffmpeg', {
                        include: [
                            'C:\\FFmpeg\\bin',
                            'C:\\FFmpeg\\FFmpeg\\bin',
                            'C:\\Program Files\\ffmpeg\\bin',
                            'C:\\Program Files (x86)\\ffmpeg\\bin',
                        ],
                    })];
                case 3:
                    ffmpegPath = _a.sent();
                    if (!ffmpegPath) {
                        try {
                            ffmpegPath = require('ffmpeg-static');
                        }
                        catch (error) { }
                    }
                    if (!ffmpegPath) {
                        throw new Error('Error: FFMPEG not found. Please install ffmpeg or define the env FFMPEG_PATH or install ffmpeg-static');
                    }
                    return [2 /*return*/, ffmpegPath];
            }
        });
    });
}
/**
 * Convert a file to a compatible MP4-GIF for WhatsApp
 * @param inputBase64 Gif in base64 format
 * @returns base64 of a MP4-GIF for WhatsApp
 */
function convertToMP4GIF(inputBase64) {
    return __awaiter(this, void 0, void 0, function () {
        var inputPath, outputPath, ffmpegPath, out, outputBase64;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputPath = path.join(tmpDir.name, "".concat(i++));
                    outputPath = path.join(tmpDir.name, "".concat(i++, ".mp4"));
                    if (inputBase64.includes(',')) {
                        inputBase64 = inputBase64.split(',')[1];
                    }
                    fs.writeFileSync(inputPath, Buffer.from(inputBase64, 'base64'));
                    return [4 /*yield*/, getFfmpegPath()];
                case 1:
                    ffmpegPath = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    return [4 /*yield*/, (0, execa_1.default)(ffmpegPath, [
                            '-i',
                            inputPath,
                            '-movflags',
                            'faststart',
                            '-pix_fmt',
                            'yuv420p',
                            '-vf',
                            'scale=trunc(iw/2)*2:trunc(ih/2)*2',
                            '-f',
                            'mp4',
                            outputPath,
                        ])];
                case 3:
                    out = _a.sent();
                    if (out.exitCode === 0) {
                        outputBase64 = fs.readFileSync(outputPath);
                        return [2 /*return*/, 'data:video/mp4;base64,' + outputBase64.toString('base64')];
                    }
                    throw out.stderr;
                case 4:
                    (0, rimraf_1.default)(inputPath, function () { return null; });
                    (0, rimraf_1.default)(outputPath, function () { return null; });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, ''];
            }
        });
    });
}
