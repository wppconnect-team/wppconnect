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
exports.HostLayer = void 0;
var create_config_1 = require("../../config/create-config");
var auth_1 = require("../../controllers/auth");
var browser_1 = require("../../controllers/browser");
var logger_1 = require("../../utils/logger");
var sleep_1 = require("../../utils/sleep");
var helpers_1 = require("../helpers");
var HostLayer = /** @class */ (function () {
    function HostLayer(page, session, options) {
        this.page = page;
        this.autoCloseInterval = null;
        this.autoCloseCalled = false;
        this.isInitialized = false;
        this.isInjected = false;
        this.isStarted = false;
        this.isLogged = false;
        this.isInChat = false;
        this.checkStartInterval = null;
        this.urlCode = '';
        this.attempt = 0;
        this.catchQR = null;
        this.statusFind = null;
        this.onLoadingScreen = null;
        this.catchLinkCode = null;
        this.session = session;
        this.options = __assign(__assign({}, create_config_1.defaultOptions), options);
        this.logger = this.options.logger || logger_1.defaultLogger;
        this.log('info', 'Initializing...');
        this.initialize();
    }
    HostLayer.prototype.log = function (level, message, meta) {
        if (meta === void 0) { meta = {}; }
        this.logger.log(__assign({ level: level, message: message, session: this.session, type: 'client' }, meta));
    };
    HostLayer.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.page.on('close', function () {
                    _this.cancelAutoClose();
                    _this.log('verbose', 'Page Closed', { type: 'page' });
                });
                this.page.on('load', function () {
                    _this.log('verbose', 'Page loaded', { type: 'page' });
                    _this.afterPageLoad();
                });
                this.isInitialized = true;
                return [2 /*return*/];
            });
        });
    };
    HostLayer.prototype.afterPageLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log('verbose', 'Injecting wapi.js');
                        options = {
                            deviceName: this.options.deviceName,
                            disableGoogleAnalytics: this.options.disableGoogleAnalytics,
                            googleAnalyticsId: this.options.googleAnalyticsId,
                            linkPreviewApiServers: this.options.linkPreviewApiServers,
                            poweredBy: this.options.poweredBy,
                        };
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (options) {
                                window.WPPConfig = options;
                            }, options)];
                    case 1:
                        _a.sent();
                        this.isInjected = false;
                        return [4 /*yield*/, (0, browser_1.injectApi)(this.page, this.onLoadingScreen)
                                .then(function () {
                                _this.isInjected = true;
                                _this.log('verbose', 'wapi.js injected');
                                _this.afterPageScriptInjected();
                            })
                                .catch(function (e) {
                                console.log(e);
                                _this.log('verbose', 'wapi.js failed');
                                _this.log('error', e);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HostLayer.prototype.afterPageScriptInjected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.getWAVersion()
                    .then(function (version) {
                    _this.log('info', "WhatsApp WEB version: ".concat(version));
                })
                    .catch(function () { return null; });
                this.getWAJSVersion()
                    .then(function (version) {
                    _this.log('info', "WA-JS version: ".concat(version));
                })
                    .catch(function () { return null; });
                (0, helpers_1.evaluateAndReturn)(this.page, function () {
                    WPP.on('conn.auth_code_change', window.checkQrCode);
                }).catch(function () { return null; });
                (0, helpers_1.evaluateAndReturn)(this.page, function () {
                    WPP.on('conn.main_ready', window.checkInChat);
                }).catch(function () { return null; });
                this.checkInChat();
                this.checkQrCode();
                return [2 /*return*/];
            });
        });
    };
    HostLayer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isStarted) {
                            return [2 /*return*/];
                        }
                        this.isStarted = true;
                        return [4 /*yield*/, (0, browser_1.initWhatsapp)(this.page, null, false, this.options.whatsappVersion, this.options.proxy, this.log.bind(this))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.exposeFunction('checkQrCode', function () { return _this.checkQrCode(); })];
                    case 2:
                        _a.sent();
                        /*await this.page.exposeFunction('loginByCode', (phone: string) =>
                          this.loginByCode(phone)
                        );*/
                        return [4 /*yield*/, this.page.exposeFunction('checkInChat', function () { return _this.checkInChat(); })];
                    case 3:
                        /*await this.page.exposeFunction('loginByCode', (phone: string) =>
                          this.loginByCode(phone)
                        );*/
                        _a.sent();
                        this.checkStartInterval = setInterval(function () { return _this.checkStart(); }, 5000);
                        this.page.on('close', function () {
                            clearInterval(_this.checkStartInterval);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    HostLayer.prototype.checkStart = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, auth_1.needsToScan)(this.page)
                    .then(function (need) { })
                    .catch(function () { return null; });
                return [2 /*return*/];
            });
        });
    };
    HostLayer.prototype.checkQrCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var needScan, result, qr;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, auth_1.needsToScan)(this.page).catch(function () { return null; })];
                    case 1:
                        needScan = _b.sent();
                        this.isLogged = !needScan;
                        if (!needScan) {
                            this.attempt = 0;
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getQrCode()];
                    case 2:
                        result = _b.sent();
                        if (!(result === null || result === void 0 ? void 0 : result.urlCode) || this.urlCode === result.urlCode) {
                            return [2 /*return*/];
                        }
                        if (typeof this.options.phoneNumber === 'string') {
                            return [2 /*return*/, this.loginByCode(this.options.phoneNumber)];
                        }
                        this.urlCode = result.urlCode;
                        this.attempt++;
                        qr = '';
                        if (!(this.options.logQR || this.catchQR)) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, auth_1.asciiQr)(this.urlCode)];
                    case 3:
                        qr = _b.sent();
                        _b.label = 4;
                    case 4:
                        if (this.options.logQR) {
                            this.log('info', "Waiting for QRCode Scan (Attempt ".concat(this.attempt, ")...:\n").concat(qr), { code: this.urlCode });
                        }
                        else {
                            this.log('verbose', "Waiting for QRCode Scan: Attempt ".concat(this.attempt));
                        }
                        (_a = this.catchQR) === null || _a === void 0 ? void 0 : _a.call(this, result.base64Image, qr, this.attempt, result.urlCode);
                        return [2 /*return*/];
                }
            });
        });
    };
    HostLayer.prototype.loginByCode = function (phone) {
        return __awaiter(this, void 0, void 0, function () {
            var code;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var _c, _d, _e, _f;
                            var phone = _b.phone;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        _d = (_c = JSON).parse;
                                        _f = (_e = JSON).stringify;
                                        return [4 /*yield*/, WPP.conn.genLinkDeviceCodeForPhoneNumber(phone)];
                                    case 1: return [2 /*return*/, _d.apply(_c, [_f.apply(_e, [_g.sent()])])];
                                }
                            });
                        }); }, { phone: phone })];
                    case 1:
                        code = _b.sent();
                        if (this.options.logQR) {
                            this.log('info', "Waiting for Login By Code (Code: ".concat(code, ")\n"));
                        }
                        else {
                            this.log('verbose', "Waiting for Login By Code");
                        }
                        (_a = this.catchLinkCode) === null || _a === void 0 ? void 0 : _a.call(this, code);
                        return [2 /*return*/];
                }
            });
        });
    };
    HostLayer.prototype.checkInChat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var inChat;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, auth_1.isInsideChat)(this.page).catch(function () { return null; })];
                    case 1:
                        inChat = _b.sent();
                        this.isInChat = !!inChat;
                        if (!inChat) {
                            return [2 /*return*/];
                        }
                        this.log('http', 'Connected');
                        (_a = this.statusFind) === null || _a === void 0 ? void 0 : _a.call(this, 'inChat', this.session);
                        return [2 /*return*/];
                }
            });
        });
    };
    HostLayer.prototype.tryAutoClose = function () {
        if (this.autoCloseInterval) {
            this.cancelAutoClose();
        }
        if ((this.options.autoClose > 0 || this.options.deviceSyncTimeout > 0) &&
            !this.autoCloseInterval &&
            !this.page.isClosed()) {
            this.log('info', 'Closing the page');
            this.autoCloseCalled = true;
            this.statusFind && this.statusFind('autocloseCalled', this.session);
            try {
                this.page.close();
            }
            catch (error) { }
        }
    };
    HostLayer.prototype.startAutoClose = function (time) {
        var _this = this;
        if (time === void 0) { time = null; }
        if (time === null || time === undefined) {
            time = this.options.autoClose;
        }
        if (time > 0 && !this.autoCloseInterval) {
            var seconds = Math.round(time / 1000);
            this.log('info', "Auto close configured to ".concat(seconds, "s"));
            var remain_1 = seconds;
            this.autoCloseInterval = setInterval(function () {
                if (_this.page.isClosed()) {
                    _this.cancelAutoClose();
                    return;
                }
                remain_1 -= 1;
                if (remain_1 % 10 === 0 || remain_1 <= 5) {
                    _this.log('http', "Auto close remain: ".concat(remain_1, "s"));
                }
                if (remain_1 <= 0) {
                    _this.tryAutoClose();
                }
            }, 1000);
        }
    };
    HostLayer.prototype.cancelAutoClose = function () {
        clearInterval(this.autoCloseInterval);
        this.autoCloseInterval = null;
    };
    HostLayer.prototype.getQrCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var qrResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.scrapeImg)(this.page).catch(function () { return undefined; })];
                    case 1:
                        qrResult = _a.sent();
                        return [2 /*return*/, qrResult];
                }
            });
        });
    };
    HostLayer.prototype.waitForQrCodeScan = function () {
        return __awaiter(this, void 0, void 0, function () {
            var needScan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isStarted) {
                            throw new Error('waitForQrCodeScan error: Session not started');
                        }
                        _a.label = 1;
                    case 1:
                        if (!(!this.page.isClosed() && !this.isLogged)) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, sleep_1.sleep)(200)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, auth_1.needsToScan)(this.page).catch(function () { return null; })];
                    case 3:
                        needScan = _a.sent();
                        this.isLogged = !needScan;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    HostLayer.prototype.waitForInChat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var start, inChat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isStarted) {
                            throw new Error('waitForInChat error: Session not started');
                        }
                        if (!this.isLogged) {
                            return [2 /*return*/, false];
                        }
                        start = Date.now();
                        _a.label = 1;
                    case 1:
                        if (!(!this.page.isClosed() && this.isLogged && !this.isInChat)) return [3 /*break*/, 3];
                        if (this.options.deviceSyncTimeout > 0 &&
                            Date.now() - start >= this.options.deviceSyncTimeout) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, (0, sleep_1.sleep)(1000)];
                    case 2:
                        _a.sent();
                        inChat = (0, auth_1.isInsideChat)(this.page).catch(function () { return null; });
                        this.isInChat = !!inChat;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, this.isInChat];
                }
            });
        });
    };
    HostLayer.prototype.waitForPageLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isInjected) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, sleep_1.sleep)(200)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2: return [4 /*yield*/, this.page.waitForFunction(function () { return WPP.isReady; }).catch(function () { })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HostLayer.prototype.waitForLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authenticated, inChat;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        this.log('http', 'Waiting page load');
                        return [4 /*yield*/, this.waitForPageLoad()];
                    case 1:
                        _g.sent();
                        this.log('http', 'Checking is logged...');
                        return [4 /*yield*/, (0, auth_1.isAuthenticated)(this.page).catch(function () { return null; })];
                    case 2:
                        authenticated = _g.sent();
                        this.startAutoClose();
                        if (!(authenticated === false)) return [3 /*break*/, 6];
                        this.log('http', typeof this.options.phoneNumber === 'string'
                            ? 'Waiting for Login by Code...'
                            : 'Waiting for QRCode Scan...');
                        (_a = this.statusFind) === null || _a === void 0 ? void 0 : _a.call(this, 'notLogged', this.session);
                        return [4 /*yield*/, this.waitForQrCodeScan()];
                    case 3:
                        _g.sent();
                        this.log('http', typeof this.options.phoneNumber === 'string'
                            ? 'Checking Login by Code status...'
                            : 'Checking QRCode status...');
                        // Wait for interface update
                        return [4 /*yield*/, (0, sleep_1.sleep)(200)];
                    case 4:
                        // Wait for interface update
                        _g.sent();
                        return [4 /*yield*/, (0, auth_1.isAuthenticated)(this.page).catch(function () { return null; })];
                    case 5:
                        authenticated = _g.sent();
                        if (authenticated === null) {
                            this.log('warn', 'Failed to authenticate');
                            (_b = this.statusFind) === null || _b === void 0 ? void 0 : _b.call(this, 'qrReadError', this.session);
                        }
                        else if (authenticated) {
                            this.log('http', 'Login with success');
                            (_c = this.statusFind) === null || _c === void 0 ? void 0 : _c.call(this, 'qrReadSuccess', this.session);
                        }
                        else {
                            this.log('warn', 'Login Fail');
                            (_d = this.statusFind) === null || _d === void 0 ? void 0 : _d.call(this, 'qrReadFail', this.session);
                            this.tryAutoClose();
                            throw 'Failed to read the QRCode';
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        if (authenticated === true) {
                            this.log('http', 'Authenticated');
                            (_e = this.statusFind) === null || _e === void 0 ? void 0 : _e.call(this, 'isLogged', this.session);
                        }
                        _g.label = 7;
                    case 7:
                        if (!(authenticated === true)) return [3 /*break*/, 10];
                        // Reinicia o contador do autoclose
                        this.cancelAutoClose();
                        // Wait for interface update
                        return [4 /*yield*/, (0, sleep_1.sleep)(200)];
                    case 8:
                        // Wait for interface update
                        _g.sent();
                        this.startAutoClose(this.options.deviceSyncTimeout);
                        this.log('http', 'Checking phone is connected...');
                        return [4 /*yield*/, this.waitForInChat()];
                    case 9:
                        inChat = _g.sent();
                        if (!inChat) {
                            this.log('warn', 'Phone not connected');
                            (_f = this.statusFind) === null || _f === void 0 ? void 0 : _f.call(this, 'phoneNotConnected', this.session);
                            this.tryAutoClose();
                            throw 'Phone not connected';
                        }
                        this.cancelAutoClose();
                        return [2 /*return*/, true];
                    case 10:
                        if (authenticated === false) {
                            this.tryAutoClose();
                            this.log('warn', 'Not logged');
                            throw 'Not logged';
                        }
                        this.tryAutoClose();
                        if (this.autoCloseCalled) {
                            this.log('error', 'Auto Close Called');
                            throw 'Auto Close Called';
                        }
                        if (this.page.isClosed()) {
                            this.log('error', 'Page Closed');
                            throw 'Page Closed';
                        }
                        this.log('error', 'Unknow error');
                        throw 'Unknow error';
                }
            });
        });
    };
    /**
     * @category Host
     * @returns Current host device details
     */
    HostLayer.prototype.getHostDevice = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WAPI.getHost(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @category Host
     * @returns Current wid connected
     */
    HostLayer.prototype.getWid = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WAPI.getWid(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieves WA version
     * @category Host
     */
    HostLayer.prototype.getWAVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page
                            .waitForFunction(function () { return WAPI.getWAVersion(); })
                            .catch(function () { return null; })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WAPI.getWAVersion(); })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieves WA-JS version
     * @category Host
     */
    HostLayer.prototype.getWAJSVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.waitForFunction(function () { return WPP.version; }).catch(function () { return null; })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WPP.version; })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieves the connection state
     * @category Host
     */
    HostLayer.prototype.getConnectionState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () {
                            return WPP.whatsapp.Socket.state;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieves if the phone is online. Please note that this may not be real time.
     * @category Host
     */
    HostLayer.prototype.isConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WAPI.isConnected(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Check is online
     * @category Host
     */
    HostLayer.prototype.isOnline = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WPP.conn.isOnline(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieves if the phone is online. Please note that this may not be real time.
     * @category Host
     */
    HostLayer.prototype.isLoggedIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WAPI.isLoggedIn(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieves Battery Level
     * @category Host
     */
    HostLayer.prototype.getBatteryLevel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WAPI.getBatteryLevel(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Start phone Watchdog, forcing the phone connection verification.
     *
     * @category Host
     * @param interval interval number in miliseconds
     */
    HostLayer.prototype.startPhoneWatchdog = function () {
        return __awaiter(this, arguments, void 0, function (interval) {
            if (interval === void 0) { interval = 15000; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (interval) { return WAPI.startPhoneWatchdog(interval); }, interval)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Stop phone Watchdog, more details in {@link startPhoneWatchdog}
     * @category Host
     */
    HostLayer.prototype.stopPhoneWatchdog = function (interval) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WAPI.stopPhoneWatchdog(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Check the current session is an MultiDevice session
     * @category Host
     */
    HostLayer.prototype.isMultiDevice = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WPP.conn.isMultiDevice(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieve main interface is authenticated, loaded and synced
     * @category Host
     */
    HostLayer.prototype.isMainReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WPP.conn.isMainReady(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieve if is authenticated
     * @category Host
     */
    HostLayer.prototype.isAuthenticated = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WPP.conn.isAuthenticated(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieve if main interface is authenticated and loaded, bot not synced
     * @category Host
     */
    HostLayer.prototype.isMainLoaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WPP.conn.isMainLoaded(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieve if main interface is initializing
     * @category Host
     */
    HostLayer.prototype.isMainInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () { return WPP.conn.isMainInit(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Join or leave of WhatsApp Web beta program.
     * Will return the value seted
     * @category Host
     */
    HostLayer.prototype.joinWebBeta = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (value) { return WPP.conn.joinWebBeta(value); }, value)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get WhatsApp build constants
     * @category Host
     * @returns Build constants information
     */
    HostLayer.prototype.getBuildConstants = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function () {
                            return WPP.conn.getBuildConstants();
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return HostLayer;
}());
exports.HostLayer = HostLayer;
