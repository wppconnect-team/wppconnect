import { EditMessageOptions } from '@wppconnect/wa-js/dist/chat/functions/editMessage';
import { MsgKey } from '@wppconnect/wa-js/dist/whatsapp';
import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { UILayer } from './ui.layer';
import { Message } from '../model';
export declare class ControlsLayer extends UILayer {
    page: Page;
    constructor(page: Page, session?: string, options?: CreateConfig);
    /**
     * Unblock contact
     * @category Blocklist
     * @param contactId {string} id '000000000000@c.us'
     * @returns boolean
     */
    unblockContact(contactId: string): Promise<boolean>;
    /**
     * Block contact
     * @category Blocklist
     * @param contactId {string} id '000000000000@c.us'
     * @returns boolean
     */
    blockContact(contactId: string): Promise<boolean>;
    /**
     * puts the chat as unread
     * @category Chat
     * @param contactId {string} id '000000000000@c.us'
     * @returns boolean
     */
    markUnseenMessage(contactId: string): Promise<boolean>;
    /**
     * Deletes the given chat
     * @category Chat
     * @param chatId {string} id '000000000000@c.us'
     * @returns boolean
     */
    deleteChat(chatId: string): Promise<boolean>;
    /**
     * Archive and unarchive chat messages with true or false
     * @category Chat
     * @param chatId {string} id '000000000000@c.us'
     * @param option {boolean} true or false
     * @returns boolean
     */
    archiveChat(chatId: string, option?: boolean): Promise<{
        wid: import("@wppconnect/wa-js/dist/whatsapp").Wid;
        archive: boolean;
    }>;
    /**
     * Pin and Unpin chat messages with true or false
     * @category Chat
     * @param chatId {string} id '000000000000@c.us'
     * @param option {boolean} true or false
     * @param nonExistent {boolean} Pin chat, non-existent (optional)
     * @returns object
     */
    pinChat(chatId: string, option: boolean, nonExistent?: boolean): Promise<{
        wid: import("@wppconnect/wa-js/dist/whatsapp").Wid;
        pin: boolean;
    }>;
    /**
     * Deletes all messages of given chat
     * @category Chat
     * @param chatId
     * @param keepStarred Keep starred messages
     * @returns boolean
     */
    clearChat(chatId: string, keepStarred?: boolean): Promise<boolean>;
    /**
     * Deletes message of given message id
     * @category Chat
     * @param chatId The chat id from which to delete the message.
     * @param messageId The specific message id of the message to be deleted
     * @param onlyLocal If it should only delete locally (message remains on the other recipienct's phone). Defaults to false.
     */
    deleteMessage(chatId: string, messageId: string[] | string, onlyLocal?: boolean, deleteMediaInDevice?: boolean): Promise<boolean>;
    /**
     * Edits message of given message id
     * @category Chat
     * @param msgId The specific message id of the message to be edited
     * @param newText New content of specified message
     * @param options Common message options
     *
     * @example
     * ```javascript
     * // Simple message
     * client.editMessage('true_<number>@c.us_messageId', 'new Text For Simple Message');
     * ```
     */
    editMessage(msgId: string | MsgKey, newText: string, options?: EditMessageOptions): Promise<Message>;
    /**
     * Stars message of given message id
     * @category Chat
     * @param messagesId The specific message id of the message to be starred
     * @param star Add or remove star of the message. Defaults to true.
     */
    starMessage(messagesId: string[] | string, star?: boolean): Promise<number>;
    /**
     * Allow only admin to send messages with true or false
     * @category Group
     * @param chatId {string} id '000000000000@c.us'
     * @param option {boolean} true or false
     * @returns boolean
     */
    setMessagesAdminsOnly(chatId: string, option: boolean): Promise<boolean>;
    /**
     * Enable or disable temporary messages with true or false
     * @category Chat
     * @param chatOrGroupId id '000000000000@c.us' or '000000-000000@g.us'
     * @param value true or false
     * @returns boolean
     */
    setTemporaryMessages(chatOrGroupId: string, value: boolean): Promise<boolean>;
    /**
     * Change limits of whatsapp web
     *  * @example
     * ```javascript
     *  //Change the maximum size (bytes) for uploading media (max 70MB)
     *  WPP.conn.setLimit('maxMediaSize',16777216);
     *
     *  //Change the maximum size (bytes) for uploading files (max 1GB)
     *  WPP.conn.setLimit('maxFileSize',104857600);
     *
     *  //Change the maximum number of contacts that can be selected when sharing (Default 5)
     *  WPP.conn.setLimit('maxShare',100);
     *
     *  //Change the maximum time (seconds) of a video status
     *  WPP.conn.setLimit('statusVideoMaxDuration',120);
     *
     *  //Remove pinned conversation limit (only whatsapp web) (Default 3)
     *  WPP.conn.setLimit('unlimitedPin',true);
     * ```
     * @category Chat
     */
    setLimit(key: 'maxMediaSize' | 'maxFileSize' | 'maxShare' | 'statusVideoMaxDuration' | 'unlimitedPin', value: boolean | number): Promise<number>;
}
