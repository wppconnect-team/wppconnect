import { Browser, BrowserContext, Page, launch } from 'puppeteer';
import { Logger } from 'winston';
import { SessionToken, TokenStore } from '../token-store';
export interface CreateConfig {
    /**
     * Headless chrome
     * @default true
     */
    headless?: boolean | 'shell';
    /**
     * Open devtools by default
     * @default false
     */
    devtools?: boolean;
    /**
     * If false will use Chromium instance
     * @default true
     */
    useChrome?: boolean;
    /**
     * Opens a debug session
     * @default false
     */
    debug?: boolean;
    /**
     * If you want to use browserWSEndpoint
     */
    browserWS?: string;
    /**
     * Parameters to be added into the chrome browser instance
     */
    browserArgs?: string[];
    /**
     * Will be passed to puppeteer.launch
     */
    puppeteerOptions?: Parameters<typeof launch>[0];
    /**
     * Pass a external browser instance, can be used with electron
     */
    browser?: Browser | BrowserContext;
    /**
     * Pass a external page instance, can be used with electron
     */
    page?: Page;
    /**
     * Logs QR automatically in terminal
     * @default true
     */
    logQR?: boolean;
    /**
     * Will disable the welcoming message which appears in the beginning
     * @default false
     */
    disableWelcome?: boolean;
    /**
     * Logs info updates automatically in terminal
     * @default true
     */
    updatesLog?: boolean;
    /**
     * Automatically closes the wppconnect only when scanning the QR code (default 60000 miliseconds, if you want to turn it off, assign 0 or false)
     * @default 60000
     */
    autoClose?: number;
    /**
     * Automatically closes the wppconnect only when is syncing the device (default 180000 miliseconds, 3 minutes, if you want to turn it off, assign 0 or false)
     * @default 180000 (3 minutes)
     */
    deviceSyncTimeout?: number;
    /**
     * Wait for in chat to return a instance of {@link Whatsapp}
     * @default false
     */
    waitForLogin?: boolean;
    /**
     * Wait for in chat to return a instance of {@link Whatsapp}
     * @default false
     */
    logger?: Logger;
    /**
     * Initial token to log in in WhatsApp.
     * If not passed, the client will get it from {@link tokenStore}.
     * @deprecated
     */
    sessionToken?: SessionToken;
    /**
     * Token store used to manage token {@link tokenStore}
     * @default 'file'
     * @deprecated
     */
    tokenStore?: TokenStore | string;
    /** Folder name when saving tokens if {@link tokenStore} is 'file'.
     * @default 'tokens'
     */
    folderNameToken?: string;
    /**
     * folder directory tokens, just inside the wppconnect folder, example: { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
     * @deprecated See {@link tokenStore}
     */
    mkdirFolderToken?: string;
    /**
     * Creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
     * @deprecated See {@link tokenStore}
     * @default true
     */
    createPathFileToken?: boolean;
    /**
     * Quando definido, essa opção força o carregamento de uma versão específica do WhatsApp WEB
     * Normalmente, versões mais antigas continuam funcionando por mais um tempo,
     * assim, com essa opção, é possível ter uma janela de tempo maior para se preparar para atualizações.
     * Caso seja definido vazio ou null, será usado a versão atual, ou seja, sem forçar versão específica.
     * @default 2.2134.x
     */
    whatsappVersion?: string;
    /**
     * Define the connected device name in WhatsApp app
     * @default 'WPPConnect'
     */
    deviceName?: string | false;
    /**
     * Set custom Link Preview API servers
     * @default null
     */
    linkPreviewApiServers?: string[] | null;
    /**
     * Disable custom Google Analytics
     * @default true
     */
    disableGoogleAnalytics?: boolean;
    /**
     * Custom Google Analytics Tracker Id, like 'G-XXXXXXXXXX'
     * collect analytics data to your GA account
     * @default null
     */
    googleAnalyticsId?: string | null;
    /**
     * Custom variable for Google Analytics
     * @default 'WPPConnect'
     */
    poweredBy?: string;
    /**
     * Insert the phone number for connect by link phone, qr code not wil generate
     */
    phoneNumber?: string;
    /**
     * Define the proxy settings for the connection
     * @default null
     */
    proxy?: {
        /**
         * The URL of the proxy server
         */
        url: string;
        /**
         * The username for the proxy server
         */
        username: string;
        /**
         * The password for the proxy server
         */
        password: string;
    };
}
export declare const defaultOptions: CreateConfig;
