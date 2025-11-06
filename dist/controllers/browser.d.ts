import { Browser, BrowserContext, Page } from 'puppeteer';
import { CreateConfig } from '../config/create-config';
import { Logger } from 'winston';
import { SessionToken } from '../token-store';
import { LoadingScreenCallback } from '../api/model';
import { LogLevel } from '../utils/logger';
export declare function unregisterServiceWorker(page: Page): Promise<void>;
/**
 * Força o carregamento de uma versão específica do WhatsApp WEB
 * @param page Página a ser injetada
 * @param version Versão ou expressão semver
 */
export declare function setWhatsappVersion(page: Page, version: string, log?: (level: LogLevel, message: string, meta?: object) => any): Promise<void>;
export declare function initWhatsapp(page: Page, token?: SessionToken, clear?: boolean, version?: string, proxy?: {
    url: string;
    username: string;
    password: string;
}, log?: (level: LogLevel, message: string, meta?: object) => any): Promise<Page>;
export declare function onLoadingScreen(page: Page, onLoadingScreenCallBack?: LoadingScreenCallback): Promise<void>;
export declare function injectApi(page: Page, onLoadingScreenCallBack?: LoadingScreenCallback): Promise<void>;
/**
 * Initializes browser, will try to use chrome as default
 * @param session
 */
export declare function initBrowser(session: string, options: CreateConfig, logger: Logger): Promise<Browser>;
export declare function getOrCreatePage(browser: Browser | BrowserContext): Promise<Page>;
