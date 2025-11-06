import type { FileMessageOptions, ListMessageOptions, LocationMessageOptions, TextMessageOptions, PoolMessageOptions, ForwardMessagesOptions, AllMessageOptions, SendMessageOptions } from '@wppconnect/wa-js/dist/chat';
import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { Message, Wid } from '../model';
import { ChatState } from '../model/enum';
import { ListenerLayer } from './listener.layer';
import { OrderItems, OrderMessageOptions } from '@wppconnect/wa-js/dist/chat/functions/sendChargeMessage';
import { PixParams } from '../../types/WAPI';
export declare class SenderLayer extends ListenerLayer {
    page: Page;
    constructor(page: Page, session?: string, options?: CreateConfig);
    /**
     * Automatically sends a link with the auto generated link preview. You can also add a custom message to be added.
     *
     * Deprecated: please use {@link sendText}
     *
     * @category Chat
     * @deprecated
     * @param chatId
     * @param url string A link, for example for youtube. e.g https://www.youtube.com/watch?v=Zi_XLOBDo_Y&list=RDEMe12_MlgO8mGFdeeftZ2nOQ&start_radio=1
     * @param text custom text as the message body, this includes the link or will be attached after the link
     */
    sendLinkPreview(chatId: string, url: string, text?: string): Promise<import("@wppconnect/wa-js/dist/chat").SendMessageReturn>;
    /**
     * Sends a text message to given chat
     * @category Chat
     * @param to chat id: xxxxx@us.c
     * @param content text message
     *
     * @example
     * ```javascript
     * // Simple message
     * client.sendText('<number>@c.us', 'A simple message');
     *
     * // A message with reply
     * client.sendText('<number>@c.us', 'A simple message', {
     *  quotedMsg: 'true_...@c.us_3EB01DE65ACC6_out'
     * });
     *
     * // With buttons
     * client.sendText('<number>@c.us', 'WPPConnect message with buttons', {
     *    useTemplateButtons: true, // False for legacy
     *    buttons: [
     *      {
     *        url: 'https://wppconnect.io/',
     *        text: 'WPPConnect Site'
     *      },
     *      {
     *        phoneNumber: '+55 11 22334455',
     *        text: 'Call me'
     *      },
     *      {
     *        id: 'your custom id 1',
     *        text: 'Some text'
     *      },
     *      {
     *        id: 'another id 2',
     *        text: 'Another text'
     *      }
     *    ],
     *    title: 'Title text' // Optional
     *    footer: 'Footer text' // Optional
     * });
     * ```
     */
    sendText(to: string, content: string, options?: TextMessageOptions): Promise<Message>;
    /**
     * Sends a pix message to given chat
     * @category Chat
     * @param to chat id: xxxxx@us.c
     * @param content pix message
     *
     * @example
     * ```javascript
     * // Simple message
     * client.sendPix('<number>@c.us', {
            keyType: 'PHONE',
            name: 'WPPCONNECT-TEAM',
            key: '+5567123456789',
            instructions: 'teste',
          });
     * ```
     */
    sendPixKey(to: string, params: PixParams, options?: SendMessageOptions): Promise<Message>;
    /**
     *
     * @category Chat
     * @param chat
     * @param content
     * @param options
     * @returns
     */
    sendMessageOptions(chat: any, content: any, options?: any): Promise<Message>;
    /**
     * Sends image message
     * @category Chat
     * @param to Chat id
     * @param filePath File path or http link
     * @param filename
     * @param caption
     * @param quotedMessageId Quoted message id
     * @param isViewOnce Enable single view
     */
    sendImage(to: string, filePath: string, filename?: string, caption?: string, quotedMessageId?: string, isViewOnce?: boolean, options?: {
        msgId?: string;
        mentionedList?: string[];
    }): Promise<{
        ack: number;
        id: string;
        sendMsgResult: import("@wppconnect/wa-js/dist/whatsapp/enums").SendMsgResult;
    }>;
    /**
     * Sends image message
     * @category Chat
     * @param to ID of the chat to send the image to
     * @param base64 A base64-encoded data URI (with mime type)
     * @param filename
     * @param caption
     * @param quotedMessageId Quoted message id
     * @param isViewOnce Enable single view
     * @param mentionedList
     * @example
     * ```javascript
     * const base64picture = "/9j/4AA[...]VZoCn9Lp//Z"
     * await client.sendImageFromBase64("120[...]381@g.us'", "data:image/png;base64," + base64picture, "picture.png")
     * ```
     */
    sendImageFromBase64(to: string, base64: string, filename: string, caption?: string, quotedMessageId?: string, isViewOnce?: boolean, mentionedList?: any, options?: {
        msgId?: string;
    }): Promise<{
        ack: number;
        id: string;
        sendMsgResult: import("@wppconnect/wa-js/dist/whatsapp/enums").SendMsgResult;
    }>;
    /**
     * Sends message with thumbnail
     *
     * @deprecated: please use {@link sendText} with options
     *
     * @deprecated
     * @category Chat
     * @param pathOrBase64
     * @param url
     * @param title
     * @param description
     * @param chatId
     */
    sendMessageWithThumb(pathOrBase64: string, url: string, title: string, description: string, chatId: string): Promise<import("@wppconnect/wa-js/dist/chat").SendMessageReturn>;
    /**
     * Replies to given mesage id of given chat id
     *
     * Deprecated: Please, use sendText with quotedMsg option
     *
     * @deprecated
     *
     * @category Chat
     * @param to Chat id
     * @param content Message body
     * @param quotedMsg Message id to reply to.
     */
    reply(to: string, content: string, quotedMsg: string): Promise<Message>;
    /**
     * Sends ptt audio
     * base64 parameter should have mime type already defined
     * @category Chat
     * @param to Chat id
     * @param base64 base64 data
     * @param filename
     * @param caption
     * @param quotedMessageId Quoted message id
     * @param messageId Set the id for this message
     * @param isPtt Set as ptt audio
     */
    sendPttFromBase64(to: string, base64: string, filename: string, caption?: string, quotedMessageId?: string, messageId?: string, isPtt?: boolean): Promise<{
        ack: number;
        id: string;
        sendMsgResult: import("@wppconnect/wa-js/dist/whatsapp/enums").SendMsgResult;
    }>;
    /**
     * Sends ptt audio from path
     * @category Chat
     * @param to Chat id
     * @param filePath File path
     * @param filename
     * @param caption
     * @param quotedMessageId Quoted message id
     * @param messageId Set the id for this message
     * @param isPtt Set as ptt audio
     */
    sendPtt(to: string, filePath: string, filename?: string, caption?: string, quotedMessageId?: string, messageId?: string, isPtt?: boolean): Promise<unknown>;
    /**
     * Sends file
     * base64 parameter should have mime type already defined
     *
     * Deprecated: please use sendFile with options: sendFile(to, content, options)
     *
     * @deprecated
     *
     * @category Chat
     * @param chatId Chat id
     * @param base64 base64 data
     * @param filename
     * @param caption
     */
    sendFileFromBase64(chatId: string, base64: string, filename: string, caption?: string): Promise<any>;
    /**
     * Sends file from path or base64
     *
     * @example
     * ```javascript
     * // File message from a path
     * client.sendFile('<number>@c.us', './someFile.txt');
     * // Simple message from base64
     *
     * client.sendFile('<number>@c.us', 'data:text/plain;base64,V1BQQ29ubmVjdA==');
     *
     * // With buttons
     * client.sendFile('<number>@c.us', 'data:text/plain;base64,V1BQQ29ubmVjdA==', {
     *    useTemplateButtons: true, // False for legacy
     *    buttons: [
     *      {
     *        url: 'https://wppconnect.io/',
     *        text: 'WPPConnect Site'
     *      },
     *      {
     *        phoneNumber: '+55 11 22334455',
     *        text: 'Call me'
     *      },
     *      {
     *        id: 'your custom id 1',
     *        text: 'Some text'
     *      },
     *      {
     *        id: 'another id 2',
     *        text: 'Another text'
     *      }
     *    ],
     *    title: 'Title text' // Optional
     *    footer: 'Footer text' // Optional
     * });
     * ```
     *
     * @category Chat
     * @param to Chat id
     * @param pathOrBase64 File path
     * @param options
     */
    sendFile(to: string | Wid, pathOrBase64: string, options?: FileMessageOptions): any;
    /**
     * Sends file from path or base64
     *
     * Deprecated: please use sendFile with options: sendFile(to, content, options)
     *
     * @deprecated
     *
     * @category Chat
     * @param to Chat id
     * @param pathOrBase64 File path or base64
     * @param filename The file name
     * @param caption Caption for the filename
     */
    sendFile(to: string, pathOrBase64: string, filename?: string, caption?: string): any;
    /**
     * Sends a video to given chat as a gif, with caption or not
     * @category Chat
     * @param to Chat id
     * @param filePath File path
     * @param filename
     * @param caption
     */
    sendVideoAsGif(to: string, filePath: string, filename?: string, caption?: string): Promise<{
        ack: number;
        id: string;
        sendMsgResult: import("@wppconnect/wa-js/dist/whatsapp/enums").SendMsgResult;
    }>;
    /**
     * Sends a video to given chat as a gif, with caption or not, using base64
     * @category Chat
     * @param to chat id xxxxx@us.c
     * @param base64 base64 data:video/xxx;base64,xxx
     * @param filename string xxxxx
     * @param caption string xxxxx
     */
    sendVideoAsGifFromBase64(to: string, base64: string, filename: string, caption?: string, quotedMessageId?: string): Promise<{
        ack: number;
        id: string;
        sendMsgResult: import("@wppconnect/wa-js/dist/whatsapp/enums").SendMsgResult;
    }>;
    /**
     * Sends a video to given chat as a gif, with caption or not, using base64
     * @category Chat
     * @param to Chat id
     * @param filePath File path
     * @param filename
     * @param caption
     */
    sendGif(to: string, filePath: string, filename?: string, caption?: string): Promise<{
        ack: number;
        id: string;
        sendMsgResult: import("@wppconnect/wa-js/dist/whatsapp/enums").SendMsgResult;
    }>;
    /**
     * Sends a video to given chat as a gif, with caption or not, using base64
     * @category Chat
     * @param to chat id xxxxx@us.c
     * @param base64 base64 data:video/xxx;base64,xxx
     * @param filename string xxxxx
     * @param caption string xxxxx
     */
    sendGifFromBase64(to: string, base64: string, filename: string, caption?: string): Promise<{
        ack: number;
        id: string;
        sendMsgResult: import("@wppconnect/wa-js/dist/whatsapp/enums").SendMsgResult;
    }>;
    /**
     * Sends contact card to iven chat id
     * @category Chat
     * @param to Chat id
     * @param contactsId Example: 0000@c.us | [000@c.us, 1111@c.us]
     */
    sendContactVcard(to: string, contactsId: string, name?: string): Promise<import("@wppconnect/wa-js/dist/chat").SendMessageReturn>;
    /**
     * Send a list of contact cards
     * @category Chat
     * @param to Chat id
     * @param contacts Example: | ['000@c.us', '1111@c.us', {id: '2222@c.us', name: 'Test'}]
     */
    sendContactVcardList(to: string, contacts: (string | {
        id: string;
        name: string;
    })[]): Promise<import("@wppconnect/wa-js/dist/chat").SendMessageReturn>;
    /**
     * Forwards array of messages (could be ids or message objects)
     * @category Chat
     * @param to Chat id
     * @param messages Array of messages ids to be forwarded
     * @param skipMyMessages
     * @returns array of messages ID
     */
    forwardMessage(toChatId: string, msgId: string | string[], options?: ForwardMessagesOptions): Promise<boolean>;
    /**
     * Generates sticker from the provided animated gif image and sends it (Send image as animated sticker)
     *
     * @example
     * ```javascript
     * client.sendImageAsStickerGif('000000000000@c.us', 'base64....');
     * ```
     *
     * @example
     * Send Sticker with reply
     * ```javascript
     * client.sendImageAsStickerGif('000000000000@c.us', 'base64....', {
     *     quotedMsg: 'msgId',
     * });
     * ```
     * @category Chat
     * @param pathOrBase64 image path imageBase64 A valid gif image is required. You can also send via http/https (http://www.website.com/img.gif)
     * @param to chatId '000000000000@c.us'
     */
    sendImageAsStickerGif(to: string, pathOrBase64: string, options?: AllMessageOptions): Promise<import("@wppconnect/wa-js/dist/chat").SendMessageReturn>;
    /**
     * Generates sticker from given image and sends it (Send Image As Sticker)
     *
     * @example
     * ```javascript
     * client.sendImageAsSticker('000000000000@c.us', 'base64....');
     * ```
     *
     * @example
     * Send Sticker with reply
     * ```javascript
     * client.sendImageAsSticker('000000000000@c.us', 'base64....', {
     *     quotedMsg: 'msgId',
     * });
     * ```
     *
     * @category Chat
     * @param pathOrBase64 image path imageBase64 A valid png, jpg and webp image is required. You can also send via http/https (http://www.website.com/img.gif)
     * @param to chatId '000000000000@c.us'
     */
    sendImageAsSticker(to: string, pathOrBase64: string, options?: AllMessageOptions): Promise<import("@wppconnect/wa-js/dist/chat").SendMessageReturn>;
    /**
     * Sends location to given chat id
     * @category Chat
     * @param to Chat id
     * @param options location options
     */
    sendLocation(to: string, options: LocationMessageOptions): any;
    /**
     * Sends location to given chat id
     * @category Chat
     * @param to Chat id
     * @param latitude Latitude
     * @param longitude Longitude
     * @param title Text caption
     */
    sendLocation(to: string, latitude: string, longitude: string, title: string): any;
    /**
     * Sets a chat status to seen. Marks all messages as ack: 3
     * @category Chat
     * @param chatId chat id: xxxxx@us.c
     */
    sendSeen(chatId: string): Promise<{
        wid: import("@wppconnect/wa-js/dist/whatsapp").Wid;
        unreadCount: number;
    }>;
    /**
     * Sets a audio or image view once. Marks message as played
     * @category Chat
     * @param msgId Message id: xxxxx@us.c
     */
    markPlayed(msgId: string): Promise<any>;
    /**
     * Starts typing ('Typing...' state)
     *
     * @example
     * ```javascript
     * // Keep sending typing state, use stopTyping to finish
     * await client.startTyping('[number]@c.us');
     *
     * // Keep sending typing state for 5 seconds
     * await client.startTyping('[number]@c.us', 5000);
     * ```
     * @category Chat
     * @param to Chat Id
     * @param duration Duration um miliseconds
     */
    startTyping(to: string, duration?: number): Promise<void>;
    /**
     * Stops typing ('Typing...' state)
     * @category Chat
     * @param to Chat Id
     */
    stopTyping(to: string): Promise<void>;
    /**
     * Starts recording ('Recording...' state)
     * @example
     * ```javascript
     * // Keep sending recording state, use stopRecoring to finish
     * await client.startRecording('[number]@c.us');
     *
     * // Keep sending typing state for 5 seconds
     * await client.startRecording('[number]@c.us', 5000);
     * ```
     * @category Chat
     * @param to Chat Id
     * @param duration Duration um miliseconds
     */
    startRecording(to: string, duration?: number): Promise<void>;
    /**
     * Stops recording ('Recording...' state)
     * @category Chat
     * @param to Chat Id
     */
    stopRecoring(to: string): Promise<void>;
    /**
     * Update your online presence
     * @category Chat
     * @param online true for available presence and false for unavailable
     */
    setOnlinePresence(online?: boolean): Promise<boolean>;
    /**
     * Sends text with tags
     * @category Chat
     */
    sendMentioned(to: string, message: string, mentioned: string[]): Promise<import("@wppconnect/wa-js/dist/chat").SendMessageReturn>;
    /**
     * Sends a list message
     *
     * ```typescript
     *   // Example
     *   client.sendListMessage('<number>@c.us', {
     *     buttonText: 'Click here',
     *     description: 'Choose one option',
     *     sections: [
     *       {
     *         title: 'Section 1',
     *         rows: [
     *           {
     *             rowId: 'my_custom_id',
     *             title: 'Test 1',
     *             description: 'Description 1',
     *           },
     *           {
     *             rowId: '2',
     *             title: 'Test 2',
     *             description: 'Description 2',
     *           },
     *         ],
     *       },
     *     ],
     *   });
     * ```
     *
     * @category Chat
     */
    sendListMessage(to: string, options: ListMessageOptions): Promise<Message>;
    /**
     * Send a create poll message
     *
     * @example
     * ```javascript
     * // Single pool
     * client.sendPollMessage(
     *  '[number]@g.us',
     *  'A poll name',
     *  ['Option 1', 'Option 2', 'Option 3']
     * );
     * ```
     * // Selectable Count
     * ```javascript
     * // Single pool
     * client.sendPollMessage(
     *  '[number]@g.us',
     *  'A poll name',
     *  ['Option 1', 'Option 2', 'Option 3'],
     *  {
     *    selectableCount: 1,
     *  }
     * );
     * ```
     *
     * @category Chat
     */
    sendPollMessage(chatId: string, name: string, choices: string[], options?: PoolMessageOptions): Promise<Message>;
    /**
     * Sets the chat state
     * Deprecated in favor of Use startTyping or startRecording functions
     * @category Chat
     * @param chatState
     * @param chatId
     * @deprecated Deprecated in favor of Use startTyping or startRecording functions
     */
    setChatState(chatId: string, chatState: ChatState): Promise<void>;
    /**
     * Send reaction to message
     * @example
     * ```javascript
     * // For send Reaction, just to send emoji
     * await client.sendReactionToMessage('[number]@c.us', '🤯');
     *
     * // to remove reacition
     * await client.startRecording('[number]@c.us', false);
     * ```
     * @category Chat
     * @param to Chat Id
     * @param duration Duration um miliseconds
     */
    sendReactionToMessage(msgId: string, reaction: string | false): Promise<{
        sendMsgResult: string;
    }>;
    /**
     * Send a order message
     * To send (prices, tax, shipping or discount), for example: USD 12.90, send them without dots or commas, like: 12900
     *
     * @example
     * ```javascript
     * // Send Order with a product
     * client.sendOrderMessage('[number]@c.us', [
     *   { type: 'product', id: '67689897878', qnt: 2 },
     *   { type: 'product', id: '37878774457', qnt: 1 },
     * ]
     *
     * // Send Order with a custom item
     * client.sendOrderMessage('[number]@c.us', [
     *   { type: 'custom', name: 'Item de cost test', price: 120000, qnt: 2 },
     * ]
     *
     * // Send Order with custom options
     * client.sendOrderMessage('[number]@c.us', [
     *   { type: 'product', id: '37878774457', qnt: 1 },
     *   { type: 'custom', name: 'Item de cost test', price: 120000, qnt: 2 },
     * ],
     * { tax: 10000, shipping: 4000, discount: 10000 }
     * ```
     *
     * @category Chat
     */
    sendOrderMessage(to: string, items: OrderItems[], options?: OrderMessageOptions): Promise<Message>;
}
