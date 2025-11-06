"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = void 0;
var logger_1 = require("../utils/logger");
exports.defaultOptions = {
    folderNameToken: './tokens',
    headless: true,
    devtools: false,
    useChrome: true,
    debug: false,
    logQR: true,
    browserWS: '',
    browserArgs: [''],
    puppeteerOptions: {},
    disableWelcome: false,
    updatesLog: true,
    autoClose: 60000,
    deviceSyncTimeout: 180000,
    createPathFileToken: true,
    waitForLogin: true,
    logger: logger_1.defaultLogger,
    tokenStore: 'file',
    whatsappVersion: '2.3000.10271x',
    deviceName: false,
    linkPreviewApiServers: null,
    disableGoogleAnalytics: true,
    googleAnalyticsId: null,
    poweredBy: 'WPPConnect',
    proxy: null,
};
