import { Page } from 'puppeteer';
import { CreateConfig } from '../config/create-config';
import { BusinessLayer } from './layers/business.layer';
import { GetMessagesParam, Message } from './model';
export declare class Whatsapp extends BusinessLayer {
    page: Page;
    private connected;
    constructor(page: Page, session?: string, options?: CreateConfig);
    protected afterPageScriptInjected(): Promise<void>;
    /**
     * Decrypts message file
     * @param data Message object
     * @returns Decrypted file buffer (null otherwise)
     */
    downloadFile(data: string): Promise<string | boolean>;
    /**
     * Download and returns the media content in base64 format
     * @param messageId Message or id
     * @returns Base64 of media
     */
    downloadMedia(messageId: string | Message): Promise<string>;
    /**
     * Get the puppeteer page instance
     * @returns The Whatsapp page
     */
    get waPage(): Page;
    /**
     * Get the puppeteer page screenshot
     * @returns The Whatsapp page screenshot as a PNG encoded in base64 (not the full data URI, just the base64 section)
     */
    takeScreenshot(): Promise<string>;
    /**
     * Clicks on 'use here' button (When it gets unlaunched)
     * This method tracks the class of the button
     * WhatsApp Web might change this class name over time
     * Don't rely on this method
     */
    useHere(): Promise<boolean>;
    /**
     * Log out of WhatsApp
     * @returns boolean
     */
    logout(): Promise<boolean>;
    /**
     * Closes page and browser
     * @internal
     */
    close(): Promise<boolean>;
    /**
     * Return PID process
     * @internal
     */
    getPID(): number;
    /**
     * Get a message by its ID
     * @param messageId string
     * @returns Message object
     */
    getMessageById(messageId: string): Promise<Message>;
    /**
     * Returns a list of messages from a chat
     * @param chatId string ID of the conversation or group
     * @param params GetMessagesParam Result filtering options (count, id, direction) see {@link GetMessagesParam}.
     * @returns Message object
     */
    getMessages(chatId: string, params?: GetMessagesParam): Promise<Message[]>;
    /**
     * Decrypts message file
     * @param message Message object
     * @returns Decrypted file buffer (`null` otherwise)
     */
    decryptFile(message: Message): Promise<Buffer<ArrayBufferLike>>;
    decryptAndSaveFile(message: Message, savePath: string): Promise<void>;
    downloadEncryptedFile: (url: string, outputPath: string, retries?: number) => Promise<void>;
    /**
     * Rejects a call received via WhatsApp
     * @param callId string Call ID, if not passed, all calls will be rejected
     * @returns Number of rejected calls
     */
    rejectCall(callId?: string): Promise<boolean>;
}
