import { Page } from 'puppeteer';
import { Logger } from 'winston';
import { CreateConfig } from '../../config/create-config';
import { LogLevel } from '../../utils/logger';
import { CatchQRCallback, HostDevice, LinkByCodeCallback, LoadingScreenCallback, StatusFindCallback } from '../model';
import { SocketState } from '../model/enum';
import { ScrapQrcode } from '../model/qrcode';
export declare class HostLayer {
    page: Page;
    readonly session: string;
    readonly options: CreateConfig;
    readonly logger: Logger;
    protected autoCloseInterval: any;
    protected autoCloseCalled: boolean;
    protected isInitialized: boolean;
    protected isInjected: boolean;
    protected isStarted: boolean;
    protected isLogged: boolean;
    protected isInChat: boolean;
    protected checkStartInterval?: NodeJS.Timer;
    protected urlCode: string;
    protected attempt: number;
    catchQR?: CatchQRCallback;
    statusFind?: StatusFindCallback;
    onLoadingScreen?: LoadingScreenCallback;
    catchLinkCode?: LinkByCodeCallback;
    constructor(page: Page, session?: string, options?: CreateConfig);
    protected log(level: LogLevel, message: string, meta?: object): void;
    protected initialize(): Promise<void>;
    protected afterPageLoad(): Promise<void>;
    protected afterPageScriptInjected(): Promise<void>;
    start(): Promise<void>;
    protected checkStart(): Promise<void>;
    protected checkQrCode(): Promise<void>;
    protected loginByCode(phone: string): Promise<void>;
    protected checkInChat(): Promise<void>;
    protected tryAutoClose(): void;
    protected startAutoClose(time?: number | null): void;
    protected cancelAutoClose(): void;
    getQrCode(): Promise<ScrapQrcode>;
    waitForQrCodeScan(): Promise<void>;
    waitForInChat(): Promise<boolean>;
    waitForPageLoad(): Promise<void>;
    waitForLogin(): Promise<boolean>;
    /**
     * @category Host
     * @returns Current host device details
     */
    getHostDevice(): Promise<HostDevice>;
    /**
     * @category Host
     * @returns Current wid connected
     */
    getWid(): Promise<string>;
    /**
     * Retrieves WA version
     * @category Host
     */
    getWAVersion(): Promise<string>;
    /**
     * Retrieves WA-JS version
     * @category Host
     */
    getWAJSVersion(): Promise<string>;
    /**
     * Retrieves the connection state
     * @category Host
     */
    getConnectionState(): Promise<SocketState>;
    /**
     * Retrieves if the phone is online. Please note that this may not be real time.
     * @category Host
     */
    isConnected(): Promise<boolean>;
    /**
     * Check is online
     * @category Host
     */
    isOnline(): Promise<boolean>;
    /**
     * Retrieves if the phone is online. Please note that this may not be real time.
     * @category Host
     */
    isLoggedIn(): Promise<boolean>;
    /**
     * Retrieves Battery Level
     * @category Host
     */
    getBatteryLevel(): Promise<number>;
    /**
     * Start phone Watchdog, forcing the phone connection verification.
     *
     * @category Host
     * @param interval interval number in miliseconds
     */
    startPhoneWatchdog(interval?: number): Promise<void>;
    /**
     * Stop phone Watchdog, more details in {@link startPhoneWatchdog}
     * @category Host
     */
    stopPhoneWatchdog(interval: number): Promise<void>;
    /**
     * Check the current session is an MultiDevice session
     * @category Host
     */
    isMultiDevice(): Promise<boolean>;
    /**
     * Retrieve main interface is authenticated, loaded and synced
     * @category Host
     */
    isMainReady(): Promise<boolean>;
    /**
     * Retrieve if is authenticated
     * @category Host
     */
    isAuthenticated(): Promise<boolean>;
    /**
     * Retrieve if main interface is authenticated and loaded, bot not synced
     * @category Host
     */
    isMainLoaded(): Promise<boolean>;
    /**
     * Retrieve if main interface is initializing
     * @category Host
     */
    isMainInit(): Promise<boolean>;
    /**
     * Join or leave of WhatsApp Web beta program.
     * Will return the value seted
     * @category Host
     */
    joinWebBeta(value: boolean): Promise<boolean>;
    /**
     * Get WhatsApp build constants
     * @category Host
     * @returns Build constants information
     */
    getBuildConstants(): Promise<any>;
}
