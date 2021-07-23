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

import * as path from 'path';
import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { convertToMP4GIF } from '../../utils/ffmpeg';
import {
  base64MimeType,
  downloadFileToBase64,
  evaluateAndReturn,
  fileToBase64,
  stickerSelect,
} from '../helpers';
import { filenameFromMimeType } from '../helpers/filename-from-mimetype';
import {
  Message,
  SendFileResult,
  SendLinkResult,
  SendStickerResult,
} from '../model';
import { ChatState } from '../model/enum';
import { ListenerLayer } from './listener.layer';

export class SenderLayer extends ListenerLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Automatically sends a link with the auto generated link preview. You can also add a custom message to be added.
   * @category Chat
   * @param chatId
   * @param url string A link, for example for youtube. e.g https://www.youtube.com/watch?v=Zi_XLOBDo_Y&list=RDEMe12_MlgO8mGFdeeftZ2nOQ&start_radio=1
   * @param title custom text as the message body, this includes the link or will be attached after the link
   */
  public async sendLinkPreview(
    chatId: string,
    url: string,
    title: string
  ): Promise<SendLinkResult> {
    const result = await evaluateAndReturn(
      this.page,
      ({ chatId, url, title }) => {
        return WAPI.sendLinkPreview(chatId, url, title);
      },
      { chatId, url, title }
    );
    if (result['erro'] == true) {
      throw result;
    }
    return result;
  }

  /**
   * Sends a text message to given chat
   * @category Chat
   * @param to chat id: xxxxx@us.c
   * @param content text message
   */
  public async sendText(to: string, content: string): Promise<Message> {
    const messageId: string = await evaluateAndReturn(
      this.page,
      ({ to, content }) => {
        return WAPI.sendMessage(to, content);
      },
      { to, content }
    );
    const result = (await evaluateAndReturn(
      this.page,
      (messageId: any) => WAPI.getMessageById(messageId),
      messageId
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
   */
  public async sendImage(
    to: string,
    filePath: string,
    filename?: string,
    caption?: string
  ): Promise<SendFileResult> {
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

    return await this.sendImageFromBase64(to, base64, filename, caption);
  }

  /**
   * Sends image message
   * @category Chat
   * @param to Chat id
   * @param base64 File path, http link or base64Encoded
   * @param filename
   * @param caption
   */
  public async sendImageFromBase64(
    to: string,
    base64: string,
    filename: string,
    caption?: string
  ): Promise<SendFileResult> {
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
      ({ to, base64, filename, caption }) => {
        return WAPI.sendImage(base64, to, filename, caption);
      },
      { to, base64, filename, caption }
    );
    if (result['erro'] == true) {
      throw result;
    }
    return result;
  }

  /**
   * Sends message with thumbnail
   * @category Chat
   * @param thumb
   * @param url
   * @param title
   * @param description
   * @param chatId
   */
  public async sendMessageWithThumb(
    thumb: string,
    url: string,
    title: string,
    description: string,
    chatId: string
  ) {
    return evaluateAndReturn(
      this.page,
      ({ thumb, url, title, description, chatId }) => {
        WAPI.sendMessageWithThumb(thumb, url, title, description, chatId);
      },
      {
        thumb,
        url,
        title,
        description,
        chatId,
      }
    );
  }

  /**
   * Replies to given mesage id of given chat id
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
    const messageId: string = await evaluateAndReturn(
      this.page,
      ({ to, content, quotedMsg }) => {
        return WAPI.reply(to, content, quotedMsg);
      },
      { to, content, quotedMsg }
    );
    const result = (await evaluateAndReturn(
      this.page,
      (messageId: any) => WAPI.getMessageById(messageId),
      messageId
    )) as Message;
    if (result['erro'] == true) {
      throw result;
    }
    return result;
  }

  /**
   * Sends ptt audio
   * base64 parameter should have mime type already defined
   * @category Chat
   * @param to Chat id
   * @param base64 base64 data
   * @param filename
   * @param caption
   */
  public async sendPttFromBase64(
    to: string,
    base64: string,
    filename: string,
    caption?: string
  ): Promise<SendFileResult> {
    return evaluateAndReturn(
      this.page,
      ({ to, base64, filename, caption }) =>
        WAPI.sendPtt(base64, to, filename, caption),
      { to, base64, filename, caption }
    );
  }

  /**
   * Sends ptt audio from path
   * @category Chat
   * @param to Chat id
   * @param filePath File path
   * @param filename
   * @param caption
   */
  public async sendPtt(
    to: string,
    filePath: string,
    filename?: string,
    caption?: string
  ) {
    return new Promise<SendFileResult>(async (resolve, reject) => {
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

      return this.sendPttFromBase64(to, base64, filename, caption)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Sends file
   * base64 parameter should have mime type already defined
   * @category Chat
   * @param to Chat id
   * @param base64 base64 data
   * @param filename
   * @param caption
   */
  public async sendFileFromBase64(
    to: string,
    base64: string,
    filename: string,
    caption?: string
  ): Promise<SendFileResult> {
    let mimeType = base64MimeType(base64);

    if (!mimeType) {
      const obj = {
        erro: true,
        to: to,
        text: 'Invalid base64!',
      };
      throw obj;
    }

    filename = filenameFromMimeType(filename, mimeType);

    const type = 'FileFromBase64';
    const result = await evaluateAndReturn(
      this.page,
      ({ to, base64, filename, caption, type }) => {
        return WAPI.sendFile(base64, to, filename, caption, type);
      },
      { to, base64, filename, caption, type }
    );
    if (result['erro'] == true) {
      throw result;
    }
    return result;
  }

  /**
   * Sends file from path
   * @category Chat
   * @param to Chat id
   * @param filePath File path
   * @param filename
   * @param caption
   */
  public async sendFile(
    to: string,
    filePath: string,
    filename?: string,
    caption?: string
  ) {
    return new Promise<SendFileResult>(async (resolve, reject) => {
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
        return reject(obj);
      }

      if (!filename) {
        filename = path.basename(filePath);
      }

      this.sendFileFromBase64(to, base64, filename, caption)
        .then(resolve)
        .catch(reject);
    });
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
    caption?: string
  ) {
    return await evaluateAndReturn(
      this.page,
      ({ to, base64, filename, caption }) =>
        WAPI.sendVideoAsGif(base64, to, filename, caption),
      { to, base64, filename, caption }
    );
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
  public async sendContactVcard(
    to: string,
    contactsId: string | string[],
    name?: string
  ) {
    const result = await evaluateAndReturn(
      this.page,
      ({ to, contactsId, name }) => {
        return WAPI.sendContactVcard(to, contactsId, name);
      },
      { to, contactsId, name }
    );
    if (result['erro'] == true) {
      throw result;
    }
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
        return WAPI.sendContactVcardList(to, contacts);
      },
      { to, contacts }
    );
    if (result['erro'] == true) {
      throw result;
    }
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
  public async forwardMessages(
    to: string,
    messages: string | string[],
    skipMyMessages: boolean
  ): Promise<string[]> {
    return evaluateAndReturn(
      this.page,
      ({ to, messages, skipMyMessages }) =>
        WAPI.forwardMessages(to, messages, skipMyMessages),
      { to, messages, skipMyMessages }
    );
  }

  /**
   * Generates sticker from the provided animated gif image and sends it (Send image as animated sticker)
   * @category Chat
   *  @param path image path imageBase64 A valid gif image is required. You can also send via http/https (http://www.website.com/img.gif)
   *  @param to chatId '000000000000@c.us'
   */
  public async sendImageAsStickerGif(
    to: string,
    path: string
  ): Promise<SendStickerResult | false> {
    let b64 = await downloadFileToBase64(path, ['image/gif', 'image/webp']);
    if (!b64) {
      b64 = await fileToBase64(path);
    }
    if (b64) {
      const buff = Buffer.from(
        b64.replace(/^data:image\/(gif|webp);base64,/, ''),
        'base64'
      );
      const mimeInfo = base64MimeType(b64);
      if (!mimeInfo || mimeInfo.includes('image')) {
        let obj = await stickerSelect(buff, 1);
        if (typeof obj == 'object') {
          let _webb64 = obj['webpBase64'];
          let _met = obj['metadata'];

          const result = await evaluateAndReturn(
            this.page,
            ({ _webb64, to, _met }) => {
              return WAPI.sendImageAsSticker(_webb64, to, _met, 'StickerGif');
            },
            { _webb64, to, _met }
          );
          if (result['erro'] == true) {
            throw result;
          }
          return result;
        } else {
          throw {
            error: true,
            message: 'Error with sharp library, check the console log',
          };
        }
      } else {
        console.log('Not an image, allowed format gif');
        return false;
      }
    }
  }

  /**
   * Generates sticker from given image and sends it (Send Image As Sticker)
   * @category Chat
   * @param path image path imageBase64 A valid png, jpg and webp image is required. You can also send via http/https (http://www.website.com/img.gif)
   * @param to chatId '000000000000@c.us'
   */
  public async sendImageAsSticker(
    to: string,
    path: string
  ): Promise<SendStickerResult | false> {
    let b64 = await downloadFileToBase64(path, [
      'image/gif',
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/webp',
    ]);
    if (!b64) {
      b64 = await fileToBase64(path);
    }
    if (b64) {
      const buff = Buffer.from(
        b64.replace(/^data:image\/(png|jpe?g|webp|gif);base64,/, ''),
        'base64'
      );
      const mimeInfo = base64MimeType(b64);

      if (!mimeInfo || mimeInfo.includes('image')) {
        let obj = await stickerSelect(buff, 0);
        if (typeof obj == 'object') {
          let _webb64 = obj['webpBase64'];
          let _met = obj['metadata'];
          const result = await evaluateAndReturn(
            this.page,
            ({ _webb64, to, _met }) => {
              return WAPI.sendImageAsSticker(_webb64, to, _met, 'Sticker');
            },
            { _webb64, to, _met }
          );
          if (result['erro'] == true) {
            throw result;
          }
          return result;
        } else {
          throw {
            error: true,
            message: 'Error with sharp library, check the console log',
          };
        }
      } else {
        console.log('Not an image, allowed formats png, jpeg and webp');
        return false;
      }
    }
  }

  /**
   * TODO: Fix message not being delivered
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
  ) {
    const result = await evaluateAndReturn(
      this.page,
      ({ to, latitude, longitude, title }) => {
        return WAPI.sendLocation(to, latitude, longitude, title);
      },
      { to, latitude, longitude, title }
    );
    if (result['erro'] == true) {
      throw result;
    } else {
      return result;
    }
  }

  /**
   * Sets a chat status to seen. Marks all messages as ack: 3
   * @category Chat
   * @param chatId chat id: xxxxx@us.c
   */
  public async sendSeen(chatId: string) {
    return evaluateAndReturn(
      this.page,
      (chatId) => WAPI.sendSeen(chatId),
      chatId
    );
  }

  /**
   * Starts typing ('Typing...' state)
   * @category Chat
   * @param chatId
   */
  public async startTyping(to: string) {
    return evaluateAndReturn(this.page, ({ to }) => WAPI.startTyping(to), {
      to,
    });
  }

  /**
   * Stops typing
   * @category Chat
   * @param to Chat id
   */
  public async stopTyping(to: string) {
    return evaluateAndReturn(this.page, ({ to }) => WAPI.stopTyping(to), {
      to,
    });
  }

  /**
   * Sends text with tags
   * @category Chat
   */
  public async sendMentioned(to: string, message: string, mentioned: string[]) {
    return await evaluateAndReturn(
      this.page,
      ({ to, message, mentioned }) => {
        WAPI.sendMessageMentioned(to, message, mentioned);
      },
      { to, message, mentioned }
    );
  }

  /**
   * Sets the chat state
   * @category Chat
   * @param chatState
   * @param chatId
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
}
