import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { SessionToken } from '../../token-store';
import { Chat, Contact, ContactStatus, ProfilePicThumbObj, WhatsappProfile, Wid } from '../model';
import { SenderLayer } from './sender.layer';
import { ChatListOptions } from '@wppconnect/wa-js/dist/chat';
export declare class RetrieverLayer extends SenderLayer {
    page: Page;
    constructor(page: Page, session?: string, options?: CreateConfig);
    /**
     * Returns a list of mute and non-mute users
     * @category Chat
     * @param type return type: all, toMute and noMute.
     * @returns obj
     */
    getListMutes(type?: string): Promise<object>;
    /**
     * Returns browser session token
     * @category Host
     * @returns obj [token]
     */
    getSessionTokenBrowser(removePath?: boolean): Promise<SessionToken>;
    /**
     * Receive the current theme
     * @category Host
     * @returns string light or dark
     */
    getTheme(): Promise<string>;
    /**
     * Receive all blocked contacts
     * @category Blocklist
     * @returns array of [0,1,2,3....]
     */
    getBlockList(): Promise<string[]>;
    /**
     * Retrieves all chats
     * Deprecated in favor of {@link listChats}
     *
     * @category Chat
     * @returns array of [Chat]
     * @deprecated Deprecated in favor of listChats.
     */
    getAllChats(withNewMessageOnly?: boolean): Promise<Chat[]>;
    /**
     * Return list of chats
     *  * @example
     * ```javascript
     * // All chats
     * const chats = await client.listChats();
     *
     * // Some chats
     * const chats = client.listChats({count: 20});
     *
     * // 20 chats before specific chat
     * const chats = client.listChats({count: 20, direction: 'before', id: '[number]@c.us'});
     *
     * // Only users chats
     * const chats = await client.listChats({onlyUsers: true});
     *
     * // Only groups chats
     * const chats = await client.listChats({onlyGroups: true});
     *
     * // Only with label Text
     * const chats = await client.listChats({withLabels: ['Test']});
     *
     * // Only with label id
     * const chats = await client.listChats({withLabels: ['1']});
     *
     * // Only with label with one of text or id
     * const chats = await client.listChats({withLabels: ['Alfa','5']});
     * ```
     * @category Chat
     * @returns array of [Chat]
     */
    listChats(options?: ChatListOptions): Promise<Chat[]>;
    /**
     * Checks if a number is a valid WA number
     * @category Contact
     * @param contactId, you need to include the @c.us at the end.
     * @returns contact details as promise
     */
    checkNumberStatus(contactId: string): Promise<WhatsappProfile>;
    /**
     * Retrieves all chats with messages
     * Deprecated in favor of {@link listChats}
     *
     * @category Chat
     * @returns array of [Chat]
     * @deprecated Deprecated in favor of listChats.
     */
    getAllChatsWithMessages(withNewMessageOnly?: boolean): Promise<Chat[]>;
    /**
     * Retrieve all groups
     * Deprecated in favor of {@link listChats}
     *
     * @category Group
     * @returns array of groups
     * @deprecated Deprecated in favor of listChats.
     */
    getAllGroups(withNewMessagesOnly?: boolean): Promise<Chat[]>;
    /**
     * Retrieve all broadcast list
     * @category Group
     * @returns array of broadcast list
     */
    getAllBroadcastList(): Promise<Chat[]>;
    /**
     * Retrieves contact detail object of given contact id
     * @category Contact
     * @param contactId
     * @returns contact details as promise
     */
    getContact(contactId: string): Promise<Contact>;
    /**
     * Retrieves all contacts
     * @category Contact
     * @returns array of [Contact]
     */
    getAllContacts(): Promise<Contact[]>;
    /**
     * Retrieves chat object of given contact id
     * @category Chat
     * @param contactId
     * @returns chat details as promise
     */
    getChatById(contactId: string | Wid): Promise<Chat>;
    /**
     * Retrieves chat object of given contact id
     * @category Chat
     * @param contactId
     * @returns chat details as promise
     * @deprecated
     */
    getChat(contactId: string | Wid): Promise<Chat>;
    /**
     * Retorna dados da imagem do contato
     * @category Contact
     * @param chatId Chat id
     * @returns url of the chat picture or undefined if there is no picture for the chat.
     */
    getProfilePicFromServer(chatId: string): Promise<ProfilePicThumbObj>;
    /**
     * Load more messages in chat object from server. Use this in a while loop
     * Depreciado em favor de {@link getMessages}
     *
     * @deprecated Depreciado em favor de getMessages
     * @category Chat
     * @param contactId
     * @returns contact details as promise
     */
    loadEarlierMessages(contactId: string): Promise<import("../model").Message[]>;
    /**
     * Retrieves status of given contact
     * @category Contact
     * @param contactId
     */
    getStatus(contactId: string): Promise<ContactStatus>;
    /**
     * Checks if a number is a valid whatsapp number
     *
     * Deprecated in favor of checkNumberStatus
     * @deprecated Deprecated in favor of checkNumberStatus
     * @category Contact
     * @param contactId, you need to include the @c.us at the end.
     * @returns contact details as promise
     */
    getNumberProfile(contactId: string): Promise<WhatsappProfile>;
    /**
     * Retrieves all undread Messages
     * @category Chat
     * @param includeMe
     * @param includeNotifications
     * @param useUnreadCount
     * @returns any
     * @deprecated
     */
    getUnreadMessages(includeMe: boolean, includeNotifications: boolean, useUnreadCount: boolean): Promise<any>;
    /**
     * Retrieves all unread messages (where ack is -1)
     * @category Chat
     * @returns list of messages
     */
    getAllUnreadMessages(): Promise<import("../model").PartialMessage[]>;
    /**
     * Retrieves all new messages (where isNewMsg is true)
     * @category Chat
     * @returns List of messages
     * @deprecated Use getAllUnreadMessages
     */
    getAllNewMessages(): Promise<import("../model").Message[]>;
    /**
     * Retrieves all messages already loaded in a chat
     * For loading every message use loadAndGetAllMessagesInChat
     * Depreciado em favor de {@link getMessages}
     *
     * @deprecated Depreciado em favor de getMessages
     *
     * @category Chat
     * @param chatId, the chat to get the messages from
     * @param includeMe, include my own messages? boolean
     * @param includeNotifications
     * @returns any
     */
    getAllMessagesInChat(chatId: string, includeMe: boolean, includeNotifications: boolean): Promise<import("../model").Message[]>;
    /**
     * Loads and Retrieves all Messages in a chat
     * Depreciado em favor de {@link getMessages}
     *
     * @deprecated Depreciado em favor de getMessages
     * @category Chat
     * @param chatId, the chat to get the messages from
     * @param includeMe, include my own messages? boolean
     * @param includeNotifications
     * @returns any
     */
    loadAndGetAllMessagesInChat(chatId: string, includeMe?: boolean, includeNotifications?: boolean): Promise<import("../model").Message[]>;
    /**
     * Checks if a CHAT contact is online.
     * @category Chat
     * @param chatId chat id: xxxxx@c.us
     */
    getChatIsOnline(chatId: string): Promise<boolean>;
    /**
     * Retrieves the last seen of a CHAT.
     * @category Chat
     * @param chatId chat id: xxxxx@c.us
     */
    getLastSeen(chatId: string): Promise<number | boolean>;
    /**
     * Get the platform message from message ID
     *
     * The platform can be:
     * android
     * iphone
     * web
     * unknown
     * @category Chat
     * @param chatId chat id: xxxxx@c.us
     */
    getPlatformFromMessage(msgId: string): Promise<string>;
    /**
     * Get the reactions of a message
     *
     * @category Chat
     */
    getReactions(msgId: string): Promise<{
        reactionByMe: {
            id: any;
            orphan: number;
            msgId: any;
            reactionText: string;
            read: boolean;
            senderUserJid: string;
            timestamp: number;
        };
        reactions: {
            aggregateEmoji: string;
            hasReactionByMe: boolean;
            senders: {
                id: any;
                orphan: number;
                msgId: any;
                reactionText: string;
                read: boolean;
                senderUserJid: string;
                timestamp: number;
            }[];
        }[];
    }>;
    /**
     * Get the votes of a poll message
     *
     * @category Chat
     */
    getVotes(msgId: string): Promise<{
        msgId: any;
        chatId: Wid;
        votes: {
            selectedOptions: number[];
            timestamp: number;
            sender: Wid;
        }[];
    }>;
    /**
     * Get the max number of participants for a group
     *
     * @category Group
     */
    getGroupSizeLimit(): Promise<number>;
    /**
     * Get info of your sended order
     *
     * @example
     * ```javascript
     * const orderInfo = await client.getOrder('<orderId>');
     * ```
     * @category Order
     * @return Your order
     */
    getOrder(msgId: string): Promise<import("@wppconnect/wa-js/dist/whatsapp").OrderModel>;
    /**
     * Get all commons groups for the contact
     *
     * @example
     * ```javascript
     * const groups_ids = await client.getCommonGroups('[number]@c.us');
     * ```
     *
     * @category Group
     * @param groupId Group ID ('000000-000000@g.us')
     * @returns Promise
     */
    getCommonGroups(wid: string): Promise<import("@wppconnect/wa-js/dist/whatsapp").Wid[]>;
    /**
     * Get LID/PhoneNumber mapping and Contact information
     *
     * @example
     * ```javascript
     * const info = await client.getPnLidEntry('[number]@c.us');
     * const info = await client.getPnLidEntry('[number]@lid');
     * ```
     *
     * @category Contact
     * @param phoneOrLid Contact ID (phone number or LID)
     * @returns Promise with lid, phoneNumber and contact information
     */
    getPnLidEntry(phoneOrLid: string): Promise<import("@wppconnect/wa-js/dist/contact").PnLidEntryResult>;
}
