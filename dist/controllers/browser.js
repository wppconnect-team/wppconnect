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
exports.unregisterServiceWorker = unregisterServiceWorker;
exports.setWhatsappVersion = setWhatsappVersion;
exports.initWhatsapp = initWhatsapp;
exports.onLoadingScreen = onLoadingScreen;
exports.injectApi = injectApi;
exports.initBrowser = initBrowser;
exports.getOrCreatePage = getOrCreatePage;
var ChromeLauncher = __importStar(require("chrome-launcher"));
var os = __importStar(require("os"));
var path = __importStar(require("path"));
var rimraf = __importStar(require("rimraf"));
var waVersion = __importStar(require("@wppconnect/wa-version"));
var axios_1 = __importDefault(require("axios"));
var puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
var puppeteer_config_1 = require("../config/puppeteer.config");
var puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
var WAuserAgente_1 = require("../config/WAuserAgente");
var websocket_1 = require("./websocket");
function unregisterServiceWorker(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.evaluateOnNewDocument(function () {
                        // Remove existent service worker
                        navigator.serviceWorker
                            .getRegistrations()
                            .then(function (registrations) {
                            for (var _i = 0, registrations_1 = registrations; _i < registrations_1.length; _i++) {
                                var registration = registrations_1[_i];
                                registration.unregister();
                            }
                        })
                            .catch(function (err) { return null; });
                        // Disable service worker registration
                        // @ts-ignore
                        navigator.serviceWorker.register = new Promise(function () { });
                        setInterval(function () {
                            window.onerror = console.error;
                            window.onunhandledrejection = console.error;
                        }, 500);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Força o carregamento de uma versão específica do WhatsApp WEB
 * @param page Página a ser injetada
 * @param version Versão ou expressão semver
 */
function setWhatsappVersion(page, version, log) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = null;
                    try {
                        body = waVersion.getPageContent(version);
                    }
                    catch (error) { }
                    if (!body) {
                        log === null || log === void 0 ? void 0 : log('error', "Version not available for ".concat(version, ", using latest as fallback"));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, page.setRequestInterception(true)];
                case 1:
                    _a.sent();
                    page.on('request', function (req) {
                        if (req.url().startsWith('https://web.whatsapp.com/check-update')) {
                            req.abort();
                            return;
                        }
                        if (req.url() !== 'https://web.whatsapp.com/') {
                            req.continue();
                            return;
                        }
                        req.respond({
                            status: 200,
                            contentType: 'text/html',
                            body: body,
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function initWhatsapp(page_1, token_1) {
    return __awaiter(this, arguments, void 0, function (page, token, clear, version, proxy, log) {
        if (clear === void 0) { clear = true; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!proxy) return [3 /*break*/, 2];
                    return [4 /*yield*/, page.authenticate({
                            username: proxy.username,
                            password: proxy.password,
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, page.setUserAgent(WAuserAgente_1.useragentOverride)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, unregisterServiceWorker(page)];
                case 4:
                    _a.sent();
                    if (!version) return [3 /*break*/, 6];
                    log === null || log === void 0 ? void 0 : log('verbose', "Setting WhatsApp WEB version to ".concat(version));
                    return [4 /*yield*/, setWhatsappVersion(page, version, log)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    log === null || log === void 0 ? void 0 : log('verbose', "Loading WhatsApp WEB");
                    return [4 /*yield*/, page.goto(puppeteer_config_1.puppeteerConfig.whatsappUrl, {
                            waitUntil: 'load',
                            timeout: 0,
                            referer: 'https://whatsapp.com/',
                        })];
                case 7:
                    _a.sent();
                    log === null || log === void 0 ? void 0 : log('verbose', 'WhatsApp WEB loaded');
                    /*setTimeout(() => {
                      log?.('verbose', `Loading WhatsApp WEB`);
                  
                      const timeout = 10 * 1000;
                      page
                        .goto(puppeteerConfig.whatsappUrl, {
                          timeout,
                          waitUntil: 'domcontentloaded',
                        })
                        .catch(() => {});
                  
                      log?.('verbose', `WhatsApp WEB loaded`);
                    }, 1000);
                    */
                    return [2 /*return*/, page];
            }
        });
    });
}
var lastPercent = null;
var lastPercentMessage = null;
function onLoadingScreen(page, onLoadingScreenCallBack) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.evaluate("function getElementByXpath(path) {\n    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;\n  }")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page
                            .exposeFunction('loadingScreen', function (percent, message) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (lastPercent !== percent || lastPercentMessage !== message) {
                                    onLoadingScreenCallBack && onLoadingScreenCallBack(percent, message);
                                    lastPercent = percent;
                                    lastPercentMessage = message;
                                }
                                return [2 /*return*/];
                            });
                        }); })
                            .catch(function () { return null; })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function (selectors) {
                            var observer = new MutationObserver(function () {
                                var window2 = window;
                                var progressBar = window2.getElementByXpath(selectors.PROGRESS);
                                var progressBarNewTheme = window2.getElementByXpath(selectors.PROGRESS_NEW_THEME);
                                var progressMessage = window2.getElementByXpath(selectors.PROGRESS_MESSAGE);
                                var progressMessageNewTheme = window2.getElementByXpath(selectors.PROGRESS_MESSAGE_NEW_THEME);
                                if (progressBar) {
                                    if (this.lastPercent !== progressBar.value ||
                                        this.lastPercentMessage !== progressMessage.innerText) {
                                        window2.loadingScreen(progressBar.value, progressMessage.innerText);
                                        this.lastPercent = progressBar.value;
                                        this.lastPercentMessage = progressMessage.innerText;
                                    }
                                }
                                else if (progressBarNewTheme) {
                                    if (this.lastPercent !== progressBarNewTheme.value ||
                                        this.lastPercentMessage !== progressMessageNewTheme.innerText) {
                                        var progressMsg = progressMessageNewTheme.innerText != 'WhatsApp'
                                            ? progressMessageNewTheme.innerText
                                            : '';
                                        window2.loadingScreen(progressBarNewTheme.value, progressMsg);
                                        this.lastPercent = progressBarNewTheme.value;
                                        this.lastPercentMessage = progressMsg;
                                    }
                                }
                            });
                            observer.observe(document, {
                                attributes: true,
                                childList: true,
                                characterData: true,
                                subtree: true,
                            });
                        }, {
                            PROGRESS: "//*[@id='app']/div/div/div[2]/progress",
                            PROGRESS_NEW_THEME: "//*[@id='app']/div/div/div[3]/progress",
                            PROGRESS_MESSAGE: "//*[@id='app']/div/div/div[3]",
                            PROGRESS_MESSAGE_NEW_THEME: "//*[@id='app']/div/div/div[2]",
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function injectApi(page, onLoadingScreenCallBack) {
    return __awaiter(this, void 0, void 0, function () {
        var injected;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page
                        .evaluate(function () {
                        // @ts-ignore
                        return (typeof window.WAPI !== 'undefined' &&
                            typeof window.Store !== 'undefined');
                    })
                        .catch(function () { return false; })];
                case 1:
                    injected = _a.sent();
                    if (injected) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, page.addScriptTag({
                            path: require.resolve('@wppconnect/wa-js'),
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function () {
                            WPP.chat.defaultSendMessageOptions.createChat = true;
                            WPP.conn.setKeepAlive(true);
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page.addScriptTag({
                            path: require.resolve(path.join(__dirname, '../../dist/lib/wapi', 'wapi.js')),
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, onLoadingScreen(page, onLoadingScreenCallBack)];
                case 5:
                    _a.sent();
                    // Make sure WAPI is initialized
                    return [4 /*yield*/, page
                            .waitForFunction(function () {
                            return (typeof window.WAPI !== 'undefined' &&
                                typeof window.Store !== 'undefined' &&
                                window.WPP.isReady);
                        })
                            .catch(function () { return false; })];
                case 6:
                    // Make sure WAPI is initialized
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Initializes browser, will try to use chrome as default
 * @param session
 */
function initBrowser(session, options, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var chromePath, browser, transport, args, arg, tmpUserDataDir_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (options.useChrome) {
                        chromePath = getChrome();
                        if (chromePath) {
                            if (!options.puppeteerOptions) {
                                options.puppeteerOptions = {};
                            }
                            options.puppeteerOptions.executablePath = chromePath;
                        }
                        else {
                            logger.warn('Chrome not found, using chromium', {
                                session: session,
                                type: 'browser',
                            });
                        }
                    }
                    // Use stealth plugin to avoid being detected as a bot
                    puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
                    browser = null;
                    if (!(options.browserWS && options.browserWS != '')) return [3 /*break*/, 3];
                    return [4 /*yield*/, getTransport(options.browserWS)];
                case 1:
                    transport = _a.sent();
                    return [4 /*yield*/, puppeteer_extra_1.default.connect({ transport: transport })];
                case 2:
                    browser = _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    args = options.browserArgs
                        ? options.browserArgs
                        : __spreadArray([], puppeteer_config_1.puppeteerConfig.chromiumArgs, true);
                    if (options.proxy && options.proxy.url) {
                        args.push("--proxy-server=".concat(options.proxy.url));
                    }
                    return [4 /*yield*/, puppeteer_extra_1.default.launch(__assign({ headless: options.headless, devtools: options.devtools, args: args }, options.puppeteerOptions))];
                case 4:
                    browser = _a.sent();
                    // Register an exit callback to remove user-data-dir
                    try {
                        arg = browser
                            .process()
                            .spawnargs.find(function (s) { return s.startsWith('--user-data-dir='); });
                        if (arg) {
                            tmpUserDataDir_1 = arg.split('=')[1];
                            // Only if path is in TMP directory
                            if (path.relative(os.tmpdir(), tmpUserDataDir_1).startsWith('puppeteer')) {
                                process.on('exit', function () {
                                    // Remove only on exit signal
                                    try {
                                        rimraf.sync(tmpUserDataDir_1);
                                    }
                                    catch (error) { }
                                });
                            }
                        }
                    }
                    catch (error) { }
                    _a.label = 5;
                case 5: return [2 /*return*/, browser];
            }
        });
    });
}
function getOrCreatePage(browser) {
    return __awaiter(this, void 0, void 0, function () {
        var pages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, browser.pages()];
                case 1:
                    pages = _a.sent();
                    if (pages.length) {
                        return [2 /*return*/, pages[0]];
                    }
                    return [4 /*yield*/, browser.newPage()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Retrieves chrome instance path
 */
function getChrome() {
    try {
        return ChromeLauncher.Launcher.getFirstInstallation();
    }
    catch (error) {
        return undefined;
    }
}
function getTransport(browserWS) {
    return __awaiter(this, void 0, void 0, function () {
        var error, e_1, endpointURL, data, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    error = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, websocket_1.WebSocketTransport.create(browserWS, 10000)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    e_1 = _a.sent();
                    error = e_1;
                    return [3 /*break*/, 4];
                case 4:
                    _a.trys.push([4, 7, , 8]);
                    endpointURL = browserWS.replace(/ws(s)?:/, 'http$1:') + '/json/version';
                    return [4 /*yield*/, axios_1.default.get(endpointURL).then(function (r) { return r.data; })];
                case 5:
                    data = _a.sent();
                    return [4 /*yield*/, websocket_1.WebSocketTransport.create(data.webSocketDebuggerUrl, 10000)];
                case 6: return [2 /*return*/, _a.sent()];
                case 7:
                    e_2 = _a.sent();
                    return [3 /*break*/, 8];
                case 8: 
                // Throw first error
                throw error;
            }
        });
    });
}
