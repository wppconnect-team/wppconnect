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

import type {
  FileMessageOptions,
  ListMessageOptions,
  LocationMessageOptions,
  SendMessageReturn,
  TextMessageOptions,
  PoolMessageOptions,
  ForwardMessagesOptions,
  AllMessageOptions,
} from '@wppconnect/wa-js/dist/chat';
import * as path from 'path';
import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { convertToMP4GIF } from '../../utils/ffmpeg';
import { sleep } from '../../utils/sleep';
import {
  base64MimeType,
  downloadFileToBase64,
  evaluateAndReturn,
  fileToBase64,
  stickerSelect,
} from '../helpers';
import { filenameFromMimeType } from '../helpers/filename-from-mimetype';
import { Message, SendFileResult, SendStickerResult, Wid } from '../model';
import { ChatState } from '../model/enum';
import { ListenerLayer } from './listener.layer';
import {
  OrderItems,
  OrderMessageOptions,
} from '@wppconnect/wa-js/dist/chat/functions/sendChargeMessage';

export class SenderLayer extends ListenerLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

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
  public async sendLinkPreview(chatId: string, url: string, text: string = '') {
    const message = text.includes(url) ? text : `${url}\n${text}`;

    const result = await evaluateAndReturn(
      this.page,
      ({ chatId, message }) => {
        return WPP.chat.sendTextMessage(chatId, message, { linkPreview: true });
      },
      { chatId, message }
    );

    return result;
  }

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
  public async sendText(
    to: string,
    content: string,
    options?: TextMessageOptions
  ): Promise<Message> {
    const sendResult = await evaluateAndReturn(
      this.page,
      ({ to, content, options }) =>
        WPP.chat.sendTextMessage(to, content, {
          ...options,
          waitForAck: true,
        }),
      { to, content, options: options as any }
    );

    // I don't know why the evaluate is returning undefined for direct call
    // To solve that, I added `JSON.parse(JSON.stringify(<message>))` to solve that
    const result = (await evaluateAndReturn(
      this.page,
      async ({ messageId }) => {
        return JSON.parse(JSON.stringify(await WAPI.getMessageById(messageId)));
      },
      { messageId: sendResult.id }
    )) as Message;

    if (result['erro'] == true) {
      throw result;
    }

    return result;
  }

  /**
   *
   * @category Chat
   * @param chat
   * @param content
   * @param options
   * @returns
   */
  public async sendMessageOptions(
    chat: any,
    content: any,
    options?: any
  ): Promise<Message> {
    const messageId = await evaluateAndReturn(
      this.page,
      ({ chat, content, options }) => {
        return WAPI.sendMessageOptions(chat, content, options);
      },
      { chat, content, options }
    );
    const result = (await evaluateAndReturn(
      this.page,
      (messageId: any) => WAPI.getMessageById(messageId),
      messageId
    )) as Message;
    return result;
  }

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
  public async sendImage(
    to: string,
    filePath: string,
    filename?: string,
    caption?: string,
    quotedMessageId?: string,
    isViewOnce?: boolean
  ) {
    let base64 = await downloadFileToBase64(filePath, [
      'image/gif',
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/webp',
    ]);

    if (!base64) {
      base64 = await fileToBase64(filePath);
    }

    if (!base64) {
      const obj = {
        erro: true,
        to: to,
        text: 'No such file or directory, open "' + filePath + '"',
      };
      throw obj;
    }

    if (!filename) {
      filename = path.basename(filePath);
    }

    return await this.sendImageFromBase64(
      to,
      base64,
      filename,
      caption,
      quotedMessageId,
      isViewOnce
    );
  }

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
  public async sendImageFromBase64(
    to: string,
    base64: string,
    filename: string,
    caption?: string,
    quotedMessageId?: string,
    isViewOnce?: boolean,
    mentionedList?: any
  ) {
    let mimeType = base64MimeType(base64);

    if (!mimeType) {
      const obj = {
        erro: true,
        to: to,
        text: 'Invalid base64!',
      };
      throw obj;
    }

    if (!mimeType.includes('image')) {
      const obj = {
        erro: true,
        to: to,
        text: 'Not an image, allowed formats png, jpeg and webp',
      };
      throw obj;
    }

    filename = filenameFromMimeType(filename, mimeType);

    const result = await evaluateAndReturn(
      this.page,
      async ({
        to,
        base64,
        filename,
        caption,
        quotedMessageId,
        isViewOnce,
        mentionedList,
      }) => {
        const result = await WPP.chat.sendFileMessage(to, base64, {
          type: 'image',
          isViewOnce,
          filename,
          caption,
          quotedMsg: quotedMessageId,
          waitForAck: true,
          detectMentioned: true,
          mentionedList: mentionedList,
        });

        return {
          ack: result.ack,
          id: result.id,
          sendMsgResult: await result.sendMsgResult,
        };
      },
      {
        to,
        base64,
        filename,
        caption,
        quotedMessageId,
        isViewOnce,
        mentionedList,
      }
    );

    return result;
  }

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
  public async sendMessageWithThumb(
    pathOrBase64: string,
    url: string,
    title: string,
    description: string,
    chatId: string
  ) {
    let base64: string = '';

    if (pathOrBase64.startsWith('data:')) {
      base64 = pathOrBase64;
    } else {
      let fileContent = await downloadFileToBase64(pathOrBase64, [
        'image/gif',
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
      ]);
      if (!fileContent) {
        fileContent = await fileToBase64(pathOrBase64);
      }
      if (fileContent) {
        base64 = fileContent;
      }
    }

    if (!base64) {
      const error = new Error('Empty or invalid file or base64');
      Object.assign(error, {
        code: 'empty_file',
      });
      throw error;
    }

    const mimeInfo = base64MimeType(base64);

    if (!mimeInfo || !mimeInfo.includes('image')) {
      const error = new Error(
        'Not an image, allowed formats png, jpeg, webp and gif'
      );
      Object.assign(error, {
        code: 'invalid_image',
      });
      throw error;
    }

    const thumbnail = base64.replace(
      /^data:image\/(png|jpe?g|webp|gif);base64,/,
      ''
    );

    return evaluateAndReturn(
      this.page,
      ({ thumbnail, url, title, description, chatId }) =>
        WPP.chat.sendTextMessage(chatId, url, {
          linkPreview: {
            thumbnail: thumbnail,
            canonicalUrl: url,
            description: description,
            matchedText: url,
            title: title,
            richPreviewType: 0,
            doNotPlayInline: true,
          },
        }),
      {
        thumbnail,
        url,
        title,
        description,
        chatId,
      }
    );
  }

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
  public async reply(
    to: string,
    content: string,
    quotedMsg: string
  ): Promise<Message> {
    const result = await evaluateAndReturn(
      this.page,
      ({ to, content, quotedMsg }) => {
        return WPP.chat.sendTextMessage(to, content, { quotedMsg });
      },
      { to, content, quotedMsg }
    );

    const message = (await evaluateAndReturn(
      this.page,
      (messageId: any) => WAPI.getMessageById(messageId),
      result.id
    )) as Message;
    if (message['erro'] == true) {
      throw message;
    }
    return message;
  }

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
   */
  public async sendPttFromBase64(
    to: string,
    base64: string,
    filename: string,
    caption?: string,
    quotedMessageId?: string,
    messageId?: string
  ) {
    const result = await evaluateAndReturn(
      this.page,
      async ({ to, base64, filename, caption, quotedMessageId, messageId }) => {
        const result = await WPP.chat.sendFileMessage(to, base64, {
          type: 'audio',
          isPtt: true,
          filename,
          caption,
          quotedMsg: quotedMessageId,
          waitForAck: true,
          messageId: messageId,
        });

        return {
          ack: result.ack,
          id: result.id,
          sendMsgResult: await result.sendMsgResult,
        };
      },
      { to, base64, filename, caption, quotedMessageId, messageId }
    );

    return result;
  }

  /**
   * Sends ptt audio from path
   * @category Chat
   * @param to Chat id
   * @param filePath File path
   * @param filename
   * @param caption
   * @param quotedMessageId Quoted message id
   * @param messageId Set the id for this message
   */
  public async sendPtt(
    to: string,
    filePath: string,
    filename?: string,
    caption?: string,
    quotedMessageId?: string,
    messageId?: string
  ) {
    return new Promise(async (resolve, reject) => {
      let base64 = await downloadFileToBase64(filePath, [/^audio/]),
        obj: { erro: boolean; to: string; text: string };

      if (!base64) {
        base64 = await fileToBase64(filePath);
      }

      if (!base64) {
        obj = {
          erro: true,
          to: to,
          text: 'No such file or directory, open "' + filePath + '"',
        };
        return reject(obj);
      }

      if (!filename) {
        filename = path.basename(filePath);
      }

      return this.sendPttFromBase64(
        to,
        base64,
        filename,
        caption,
        quotedMessageId,
        messageId
      )
        .then(resolve)
        .catch(reject);
    });
  }

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
  public async sendFileFromBase64(
    chatId: string,
    base64: string,
    filename: string,
    caption?: string
  ) {
    return this.sendFile(chatId, base64, filename, caption);
  }

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
  public async sendFile(
    to: string | Wid,
    pathOrBase64: string,
    options?: FileMessageOptions
  );
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
  public async sendFile(
    to: string,
    pathOrBase64: string,
    filename?: string,
    caption?: string
  );
  public async sendFile(
    to: string,
    pathOrBase64: string,
    nameOrOptions?: string | FileMessageOptions,
    caption?: string
  ) {
    let options: FileMessageOptions = { type: 'auto-detect' };

    if (typeof nameOrOptions === 'string') {
      options.filename = nameOrOptions;
      options.caption = caption;
    } else if (typeof nameOrOptions === 'object') {
      options = nameOrOptions;
    }

    let base64 = '';

    if (pathOrBase64.startsWith('data:')) {
      base64 = pathOrBase64;
    } else {
      let fileContent = await downloadFileToBase64(pathOrBase64);
      if (!fileContent) {
        fileContent = await fileToBase64(pathOrBase64);
      }
      if (fileContent) {
        base64 = fileContent;
      }

      if (!options.filename) {
        options.filename = path.basename(pathOrBase64);
      }
    }

    if (!base64) {
      const error = new Error('Empty or invalid file or base64');
      Object.assign(error, {
        code: 'empty_file',
      });
      throw error;
    }

    return evaluateAndReturn(
      this.page,
      async ({ to, base64, options }) => {
        const result = await WPP.chat.sendFileMessage(to, base64, options);
        return {
          ack: result.ack,
          id: result.id,
          sendMsgResult: await result.sendMsgResult,
        };
      },
      { to, base64, options: options as any }
    );
  }

  /**
   * Sends a video to given chat as a gif, with caption or not
   * @category Chat
   * @param to Chat id
   * @param filePath File path
   * @param filename
   * @param caption
   */
  public async sendVideoAsGif(
    to: string,
    filePath: string,
    filename?: string,
    caption?: string
  ) {
    let base64 = await downloadFileToBase64(filePath),
      obj: { erro: boolean; to: string; text: string };

    if (!base64) {
      base64 = await fileToBase64(filePath);
    }

    if (!base64) {
      obj = {
        erro: true,
        to: to,
        text: 'No such file or directory, open "' + filePath + '"',
      };
      throw obj;
    }

    if (!filename) {
      filename = path.basename(filePath);
    }

    return this.sendVideoAsGifFromBase64(to, base64, filename, caption);
  }

  /**
   * Sends a video to given chat as a gif, with caption or not, using base64
   * @category Chat
   * @param to chat id xxxxx@us.c
   * @param base64 base64 data:video/xxx;base64,xxx
   * @param filename string xxxxx
   * @param caption string xxxxx
   */
  public async sendVideoAsGifFromBase64(
    to: string,
    base64: string,
    filename: string,
    caption?: string,
    quotedMessageId?: string
  ) {
    const result = await evaluateAndReturn(
      this.page,
      async ({ to, base64, filename, caption, quotedMessageId }) => {
        const result = await WPP.chat.sendFileMessage(to, base64, {
          type: 'video',
          isGif: true,
          filename,
          caption,
          quotedMsg: quotedMessageId,
          waitForAck: true,
        });

        return {
          ack: result.ack,
          id: result.id,
          sendMsgResult: await result.sendMsgResult,
        };
      },
      { to, base64, filename, caption, quotedMessageId }
    );

    return result;
  }

  /**
   * Sends a video to given chat as a gif, with caption or not, using base64
   * @category Chat
   * @param to Chat id
   * @param filePath File path
   * @param filename
   * @param caption
   */
  public async sendGif(
    to: string,
    filePath: string,
    filename?: string,
    caption?: string
  ) {
    let base64 = await downloadFileToBase64(filePath),
      obj: { erro: boolean; to: string; text: string };

    if (!base64) {
      base64 = await fileToBase64(filePath);
    }

    if (!base64) {
      obj = {
        erro: true,
        to: to,
        text: 'No such file or directory, open "' + filePath + '"',
      };
      throw obj;
    }

    if (!filename) {
      filename = path.basename(filePath);
    }

    return this.sendGifFromBase64(to, base64, filename, caption);
  }

  /**
   * Sends a video to given chat as a gif, with caption or not, using base64
   * @category Chat
   * @param to chat id xxxxx@us.c
   * @param base64 base64 data:video/xxx;base64,xxx
   * @param filename string xxxxx
   * @param caption string xxxxx
   */
  public async sendGifFromBase64(
    to: string,
    base64: string,
    filename: string,
    caption?: string
  ) {
    base64 = await convertToMP4GIF(base64);

    return await this.sendVideoAsGifFromBase64(to, base64, filename, caption);
  }
  /**
   * Sends contact card to iven chat id
   * @category Chat
   * @param to Chat id
   * @param contactsId Example: 0000@c.us | [000@c.us, 1111@c.us]
   */
  public async sendContactVcard(to: string, contactsId: string, name?: string) {
    const result = await evaluateAndReturn(
      this.page,
      ({ to, contactsId, name }) => {
        return WPP.chat.sendVCardContactMessage(to, {
          id: contactsId,
          name: name,
        });
      },
      { to, contactsId, name }
    );
    return result;
  }

  /**
   * Send a list of contact cards
   * @category Chat
   * @param to Chat id
   * @param contacts Example: | ['000@c.us', '1111@c.us', {id: '2222@c.us', name: 'Test'}]
   */
  public async sendContactVcardList(
    to: string,
    contacts: (string | { id: string; name: string })[]
  ) {
    const result = await evaluateAndReturn(
      this.page,
      ({ to, contacts }) => {
        return WPP.chat.sendVCardContactMessage(to, contacts);
      },
      { to, contacts }
    );
    return result;
  }

  /**
   * Forwards array of messages (could be ids or message objects)
   * @category Chat
   * @param to Chat id
   * @param messages Array of messages ids to be forwarded
   * @param skipMyMessages
   * @returns array of messages ID
   */
  public async forwardMessage(
    toChatId: string,
    msgId: string | string[],
    options?: ForwardMessagesOptions
  ): Promise<boolean> {
    return evaluateAndReturn(
      this.page,
      ({ toChatId, msgId, options }) =>
        WPP.chat.forwardMessage(toChatId, msgId, options),
      { toChatId, msgId, options }
    );
  }

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
  public async sendImageAsStickerGif(
    to: string,
    pathOrBase64: string,
    options?: AllMessageOptions
  ) {
    let base64: string = '';

    if (pathOrBase64.startsWith('data:')) {
      base64 = pathOrBase64;
    } else {
      let fileContent = await downloadFileToBase64(pathOrBase64, [
        'image/gif',
        'image/webp',
      ]);
      if (!fileContent) {
        fileContent = await fileToBase64(pathOrBase64);
      }
      if (fileContent) {
        base64 = fileContent;
      }
    }

    if (!base64) {
      const error = new Error('Empty or invalid file or base64');
      Object.assign(error, {
        code: 'empty_file',
      });
      throw error;
    }

    const mimeInfo = base64MimeType(base64);

    if (!mimeInfo || !mimeInfo.includes('image')) {
      const error = new Error('Not an image, allowed formats gig and webp');
      Object.assign(error, {
        code: 'invalid_image',
      });
      throw error;
    }

    const buff = Buffer.from(
      base64.replace(/^data:image\/(gif|webp);base64,/, ''),
      'base64'
    );

    let obj = await stickerSelect(buff, 1);

    if (!obj) {
      const error = new Error(
        'Error with sharp library, check the console log'
      );
      Object.assign(error, {
        code: 'sharp_error',
      });
      throw error;
    }

    const { webpBase64 } = obj;

    return await evaluateAndReturn(
      this.page,
      ({ to, webpBase64, options }) => {
        return WPP.chat.sendFileMessage(to, webpBase64, {
          type: 'sticker',
          ...options,
        });
      },
      { to, webpBase64, options }
    );
  }

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
  public async sendImageAsSticker(
    to: string,
    pathOrBase64: string,
    options?: AllMessageOptions
  ) {
    let base64: string = '';

    if (pathOrBase64.startsWith('data:')) {
      base64 = pathOrBase64;
    } else {
      let fileContent = await downloadFileToBase64(pathOrBase64, [
        'image/gif',
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
      ]);
      if (!fileContent) {
        fileContent = await fileToBase64(pathOrBase64);
      }
      if (fileContent) {
        base64 = fileContent;
      }
    }

    if (!base64) {
      const error = new Error('Empty or invalid file or base64');
      Object.assign(error, {
        code: 'empty_file',
      });
      throw error;
    }

    const mimeInfo = base64MimeType(base64);

    if (!mimeInfo || !mimeInfo.includes('image')) {
      const error = new Error(
        'Not an image, allowed formats png, jpeg, webp and gif'
      );
      Object.assign(error, {
        code: 'invalid_image',
      });
      throw error;
    }

    const buff = Buffer.from(
      base64.replace(/^data:image\/(png|jpe?g|webp|gif);base64,/, ''),
      'base64'
    );

    let obj = await stickerSelect(buff, 0);

    if (!obj) {
      const error = new Error(
        'Error with sharp library, check the console log'
      );
      Object.assign(error, {
        code: 'sharp_error',
      });
      throw error;
    }

    const { webpBase64 } = obj;

    return await evaluateAndReturn(
      this.page,
      ({ to, webpBase64, options }) => {
        return WPP.chat.sendFileMessage(to, webpBase64, {
          type: 'sticker',
          ...options,
        });
      },
      { to, webpBase64, options }
    );
  }

  /**
   * Sends location to given chat id
   * @category Chat
   * @param to Chat id
   * @param options location options
   */
  public async sendLocation(to: string, options: LocationMessageOptions);
  /**
   * Sends location to given chat id
   * @category Chat
   * @param to Chat id
   * @param latitude Latitude
   * @param longitude Longitude
   * @param title Text caption
   */
  public async sendLocation(
    to: string,
    latitude: string,
    longitude: string,
    title: string
  );
  public async sendLocation(
    to: string,
    latitudeOrOptions: string | LocationMessageOptions,
    longitude?: string,
    title?: string
  ) {
    const options: LocationMessageOptions =
      typeof latitudeOrOptions === 'string'
        ? {
            lat: latitudeOrOptions,
            lng: longitude,
            title: title,
          }
        : latitudeOrOptions;

    return await evaluateAndReturn(
      this.page,
      async ({ to, options }) => {
        const result = await WPP.chat.sendLocationMessage(to, options);

        return {
          ack: result.ack,
          id: result.id,
          sendMsgResult: await result.sendMsgResult,
        };
      },
      { to, options: options as any }
    );
  }

  /**
   * Sets a chat status to seen. Marks all messages as ack: 3
   * @category Chat
   * @param chatId chat id: xxxxx@us.c
   */
  public async sendSeen(chatId: string) {
    return evaluateAndReturn(
      this.page,
      (chatId) => WPP.chat.markIsRead(chatId),
      chatId
    );
  }

  /**
   * Sets an audio or image view once. Marks message as played
   * @category Chat
   * @param msgId Message id: xxxxx@us.c
   */
  public async markPlayed(msgId: string) {
    return evaluateAndReturn(
      this.page,
      (msgId) => WPP.chat.markPlayed(msgId),
      msgId
    );
  }

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
   * @param duration Duration um milliseconds
   */
  public async startTyping(to: string, duration?: number) {
    return evaluateAndReturn(
      this.page,
      ({ to, duration }) => WPP.chat.markIsComposing(to, duration),
      {
        to,
        duration,
      }
    );
  }

  /**
   * Stops typing ('Typing...' state)
   * @category Chat
   * @param to Chat Id
   */
  public async stopTyping(to: string) {
    return evaluateAndReturn(this.page, ({ to }) => WPP.chat.markIsPaused(to), {
      to,
    });
  }

  /**
   * Starts recording ('Recording...' state)
   * @example
   * ```javascript
   * // Keep sending recording state, use `stopRecording` to finish
   * await client.startRecording('[number]@c.us');
   *
   * // Keep sending typing state for 5 seconds
   * await client.startRecording('[number]@c.us', 5000);
   * ```
   * @category Chat
   * @param to Chat Id
   * @param duration Duration um milliseconds
   */
  public async startRecording(to: string, duration?: number) {
    return evaluateAndReturn(
      this.page,
      ({ to, duration }) => WPP.chat.markIsRecording(to, duration),
      {
        to,
        duration,
      }
    );
  }

  /**
   * Stops recording ('Recording...' state)
   * @category Chat
   * @param to Chat Id
   */
  public async stopRecording(to: string) {
    return evaluateAndReturn(this.page, ({ to }) => WPP.chat.markIsPaused(to), {
      to,
    });
  }

  /**
   * Update your online presence
   * @category Chat
   * @param online true for available presence and false for unavailable
   */
  public async setOnlinePresence(online: boolean = true) {
    return evaluateAndReturn(
      this.page,
      ({ online }) => WPP.conn.markAvailable(online),
      {
        online,
      }
    );
  }

  /**
   * Sends text with tags
   * @category Chat
   */
  public async sendMentioned(to: string, message: string, mentioned: string[]) {
    return await evaluateAndReturn(
      this.page,
      ({ to, message, mentioned }) =>
        WPP.chat.sendTextMessage(to, message, {
          detectMentioned: true,
          mentionedList: mentioned,
        }),
      { to, message, mentioned }
    );
  }

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
  public async sendListMessage(to: string, options: ListMessageOptions) {
    const sendResult = await evaluateAndReturn(
      this.page,
      ({ to, options }) => WPP.chat.sendListMessage(to, options),
      {
        to,
        options: options,
      }
    );

    // I don't know why the evaluate is returning undefined for direct call
    // To solve that, I added `JSON.parse(JSON.stringify(<message>))` to solve that
    const result = (await evaluateAndReturn(
      this.page,
      async ({ messageId }) => {
        return JSON.parse(JSON.stringify(await WAPI.getMessageById(messageId)));
      },
      { messageId: sendResult.id }
    )) as Message;

    if (result['erro'] == true) {
      throw result;
    }

    return result;
  }

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
  public async sendPollMessage(
    chatId: string,
    name: string,
    choices: string[],
    options?: PoolMessageOptions
  ) {
    const sendResult = await evaluateAndReturn(
      this.page,
      ({ chatId, name, choices, options }) =>
        WPP.chat.sendCreatePollMessage(chatId, name, choices, options),
      {
        chatId,
        name,
        choices,
        options: options,
      }
    );

    // I don't know why the evaluate is returning undefined for direct call
    // To solve that, I added `JSON.parse(JSON.stringify(<message>))` to solve that
    const result = (await evaluateAndReturn(
      this.page,
      async ({ messageId }) => {
        return JSON.parse(JSON.stringify(await WAPI.getMessageById(messageId)));
      },
      { messageId: sendResult.id }
    )) as Message;

    if (result['erro'] == true) {
      throw result;
    }

    return result;
  }
  /**
   * Sets the chat state
   * Deprecated in favor of Use startTyping or startRecording functions
   * @category Chat
   * @param chatState
   * @param chatId
   * @deprecated Deprecated in favor of Use startTyping or startRecording functions
   */
  public async setChatState(chatId: string, chatState: ChatState) {
    return await evaluateAndReturn(
      this.page,
      ({ chatState, chatId }) => {
        WAPI.sendChatstate(chatState, chatId);
      },
      { chatState, chatId }
    );
  }

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
   * @param duration Duration um milliseconds
   */
  public async sendReactionToMessage(msgId: string, reaction: string | false) {
    return evaluateAndReturn(
      this.page,
      ({ msgId, reaction }) => WPP.chat.sendReactionToMessage(msgId, reaction),
      {
        msgId,
        reaction,
      }
    );
  }

  /**
   * Send an order message
   * To send (prices, tax, shipping or discount), for example: USD 12.90, send them without dots or commas, like: 12900
   *
   * @example
   * ```javascript
   * // Send an order with a product
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
  public async sendOrderMessage(
    to: string,
    items: OrderItems[],
    options?: OrderMessageOptions
  ) {
    const sendResult = await evaluateAndReturn(
      this.page,
      ({ to, items, options }) =>
        WPP.chat.sendChargeMessage(to, items, options),
      {
        to,
        items,
        options,
      }
    );

    // I don't know why the evaluate is returning undefined for direct call
    // To solve that, I added `JSON.parse(JSON.stringify(<message>))` to solve that
    const result = (await evaluateAndReturn(
      this.page,
      async ({ messageId }) => {
        return JSON.parse(JSON.stringify(await WAPI.getMessageById(messageId)));
      },
      { messageId: sendResult.id }
    )) as Message;

    if (result['erro'] == true) {
      throw result;
    }

    return result;
  }
}
