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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
var whatsapp_1 = require("../api/whatsapp");
var create_config_1 = require("../config/create-config");
var browser_1 = require("./browser");
var welcome_1 = require("./welcome");
var logger_1 = require("../utils/logger");
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var sanitize_filename_1 = __importDefault(require("sanitize-filename"));
var sleep_1 = require("../utils/sleep");
process.on('unhandledRejection', function (reason, promise) {
    var message = 'Unhandled Rejection: ';
    if (reason instanceof Error) {
        if (reason.stack) {
            message += reason.stack;
        }
        else {
            message += reason.toString();
        }
    }
    else {
        message += JSON.stringify(reason);
    }
    logger_1.defaultLogger.error(message);
});
function create(sessionOrOption, catchQR, statusFind, onLoadingScreen, catchLinkCode, options, browserSessionToken) {
    return __awaiter(this, void 0, void 0, function () {
        var session, usingDeprecatedCreate, mergedOptions, logger, browser, page, client_1, isLogged, waitLoginPromise_1;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    session = 'session';
                    usingDeprecatedCreate = false;
                    if (typeof sessionOrOption === 'string' &&
                        sessionOrOption.replace(/\s/g, '').length) {
                        session = sessionOrOption.replace(/\s/g, '');
                        usingDeprecatedCreate =
                            typeof sessionOrOption === 'string' ||
                                typeof catchQR !== 'undefined' ||
                                typeof statusFind !== 'undefined' ||
                                typeof options !== 'undefined' ||
                                typeof browserSessionToken !== 'undefined';
                    }
                    else if (typeof sessionOrOption === 'object') {
                        options = sessionOrOption;
                        if (sessionOrOption.session)
                            session = sessionOrOption.session;
                        catchQR = sessionOrOption.catchQR || catchQR;
                        statusFind = sessionOrOption.statusFind || statusFind;
                        onLoadingScreen = sessionOrOption.onLoadingScreen || onLoadingScreen;
                        catchLinkCode = sessionOrOption.catchLinkCode || catchLinkCode;
                        if (!options.sessionToken) {
                            options.sessionToken =
                                sessionOrOption.browserSessionToken || browserSessionToken;
                        }
                    }
                    mergedOptions = __assign(__assign({}, create_config_1.defaultOptions), options);
                    logger = mergedOptions.logger;
                    if (usingDeprecatedCreate) {
                        logger.warn('You are using deprecated create method, please use create({options}) See: https://wppconnect.io/wppconnect/pages/Getting%20Started/creating-client.html#passing-options-on-create');
                    }
                    if (!mergedOptions.disableWelcome) {
                        (0, welcome_1.welcomeScreen)();
                    }
                    if (!mergedOptions.updatesLog) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, welcome_1.checkUpdates)()];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    browser = mergedOptions.browser;
                    page = mergedOptions.page;
                    if (!(!browser && page)) return [3 /*break*/, 3];
                    // Get browser from page
                    browser = page.browser();
                    return [3 /*break*/, 5];
                case 3:
                    if (!(!browser && !page)) return [3 /*break*/, 5];
                    if (!mergedOptions.browserWS &&
                        !((_a = mergedOptions.puppeteerOptions) === null || _a === void 0 ? void 0 : _a.userDataDir)) {
                        mergedOptions.puppeteerOptions.userDataDir = path.resolve(process.cwd(), path.join(mergedOptions.folderNameToken, (0, sanitize_filename_1.default)(session)));
                        if (!fs.existsSync(mergedOptions.puppeteerOptions.userDataDir)) {
                            fs.mkdirSync(mergedOptions.puppeteerOptions.userDataDir, {
                                recursive: true,
                            });
                        }
                    }
                    if (!mergedOptions.browserWS) {
                        logger.info("Using browser folder '".concat(mergedOptions.puppeteerOptions.userDataDir, "'"), {
                            session: session,
                            type: 'browser',
                        });
                    }
                    // Initialize new browser
                    logger.info('Initializing browser...', { session: session, type: 'browser' });
                    return [4 /*yield*/, (0, browser_1.initBrowser)(session, mergedOptions, logger).catch(function (e) {
                            if (mergedOptions.browserWS && mergedOptions.browserWS != '') {
                                logger.error("Error when try to connect ".concat(mergedOptions.browserWS), {
                                    session: session,
                                    type: 'browser',
                                });
                            }
                            else {
                                logger.error("Error no open browser", {
                                    session: session,
                                    type: 'browser',
                                });
                            }
                            logger.error(e.message, {
                                session: session,
                                type: 'browser',
                            });
                            throw e;
                        })];
                case 4:
                    browser = _b.sent();
                    logger.http('checking headless...', {
                        session: session,
                        type: 'browser',
                    });
                    if (mergedOptions.headless) {
                        logger.http('headless option is active, browser hidden', {
                            session: session,
                            type: 'browser',
                        });
                    }
                    else {
                        logger.http('headless option is disabled, browser visible', {
                            session: session,
                            type: 'browser',
                        });
                    }
                    _b.label = 5;
                case 5:
                    if (!mergedOptions.browserWS && browser['_process']) {
                        browser['_process'].once('close', function () {
                            browser['isClose'] = true;
                        });
                    }
                    browser.on('targetdestroyed', function (target) { return __awaiter(_this, void 0, void 0, function () {
                        var pages;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (typeof browser.isConnected === 'function' &&
                                        !browser.isConnected()) {
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, browser.pages()];
                                case 1:
                                    pages = _a.sent();
                                    if (!pages.length) {
                                        browser.close().catch(function () { return null; });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    browser.on('disconnected', function () {
                        if (mergedOptions.browserWS) {
                            statusFind && statusFind('serverClose', session);
                        }
                        else {
                            statusFind && statusFind('browserClose', session);
                        }
                    });
                    if (!!page) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, browser_1.getOrCreatePage)(browser)];
                case 6:
                    // Initialize a page
                    page = _b.sent();
                    _b.label = 7;
                case 7:
                    if (!page) return [3 /*break*/, 12];
                    return [4 /*yield*/, page.setBypassCSP(true)];
                case 8:
                    _b.sent();
                    client_1 = new whatsapp_1.Whatsapp(page, session, mergedOptions);
                    client_1.catchQR = catchQR;
                    client_1.statusFind = statusFind;
                    client_1.onLoadingScreen = onLoadingScreen;
                    client_1.catchLinkCode = catchLinkCode;
                    return [4 /*yield*/, client_1.start()];
                case 9:
                    _b.sent();
                    if (!mergedOptions.waitForLogin) return [3 /*break*/, 11];
                    return [4 /*yield*/, client_1.waitForLogin()];
                case 10:
                    isLogged = _b.sent();
                    if (!isLogged) {
                        throw 'Not Logged';
                    }
                    waitLoginPromise_1 = null;
                    client_1.onStateChange(function (state) { return __awaiter(_this, void 0, void 0, function () {
                        var connected;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, page.evaluate(function () { return WPP.conn.isRegistered(); })];
                                case 1:
                                    connected = _a.sent();
                                    if (!!connected) return [3 /*break*/, 4];
                                    return [4 /*yield*/, (0, sleep_1.sleep)(2000)];
                                case 2:
                                    _a.sent();
                                    if (!waitLoginPromise_1) {
                                        waitLoginPromise_1 = client_1
                                            .waitForLogin()
                                            .catch(function () { })
                                            .finally(function () {
                                            waitLoginPromise_1 = null;
                                        });
                                    }
                                    return [4 /*yield*/, waitLoginPromise_1];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    _b.label = 11;
                case 11: return [2 /*return*/, client_1];
                case 12: return [2 /*return*/];
            }
        });
    });
}
