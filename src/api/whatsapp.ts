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

import { Page } from 'puppeteer';
import { BusinessLayer } from './layers/business.layer';
import { GetMessagesParam, Message } from './model';
import { magix, timeout, makeOptions } from './helpers/decrypt';
import { useragentOverride } from '../config/WAuserAgente';
import { CreateConfig } from '../config/create-config';
import axios from 'axios';
import treekill = require('tree-kill');
import { SocketState } from './model/enum';
import { evaluateAndReturn } from './helpers';

export class Whatsapp extends BusinessLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);

    let connected = false;

    const removeToken = async () => {
      this.log('info', 'Session Unpaired', { type: 'session' });
      const removed = await Promise.resolve(
        this.tokenStore.removeToken(this.session)
      );

      if (removed) {
        this.log('verbose', 'Token removed', { type: 'token' });
      }
    };

    if (this.page) {
      this.page.on('close', async () => {
        if (!connected) {
          await removeToken();
        }
      });
    }

    this.onStateChange(async (state) => {
      switch (state) {
        case SocketState.CONNECTED:
          connected = true;
          // wait for localStore populate
          setTimeout(async () => {
            this.log('verbose', 'Updating session token', { type: 'token' });
            const tokenData = await this.getSessionTokenBrowser();
            const updated = await Promise.resolve(
              this.tokenStore.setToken(this.session, tokenData)
            );

            if (updated) {
              this.log('verbose', 'Session token updated', {
                type: 'token',
              });
            } else {
              this.log('warn', 'Failed to update session token', {
                type: 'token',
              });
            }
          }, 1000);
          break;

        case SocketState.UNPAIRED:
        case SocketState.UNPAIRED_IDLE:
          setTimeout(async () => {
            await removeToken();

            // Fire only after a success connection and disconnection
            if (connected && this.statusFind) {
              try {
                this.statusFind('desconnectedMobile', session);
              } catch (error) {}
            }
            connected = false;
          }, 1000);
          break;
      }
    });
  }

  /**
   * Decrypts message file
   * @param data Message object
   * @returns Decrypted file buffer (null otherwise)
   */
  public async downloadFile(data: string) {
    return await evaluateAndReturn(
      this.page,
      (data) => WAPI.downloadFile(data),
      data
    );
  }

  /**
   * Download and returns the media content in base64 format
   * @param messageId Message ou id
   * @returns Base64 of media
   */
  public async downloadMedia(messageId: string | Message): Promise<string> {
    if (typeof messageId !== 'string') {
      messageId = messageId.id;
    }

    const result = await evaluateAndReturn(
      this.page,
      (messageId) =>
        WAPI.downloadMedia(messageId).catch((e) => ({
          __error: e,
        })),
      messageId
    );

    if (typeof result == 'object' && '__error' in result) {
      throw result.__error;
    }
    return result as string;
  }

  /**
   * Get the puppeteer page instance
   * @returns The Whatsapp page
   */
  get waPage(): Page {
    return this.page;
  }

  /**
   * Clicks on 'use here' button (When it get unlaunched)
   * This method tracks the class of the button
   * Whatsapp web might change this class name over the time
   * Dont rely on this method
   */
  public async useHere() {
    return await evaluateAndReturn(this.page, () => WAPI.takeOver());
  }

  /**
   * Logout whastapp
   * @returns boolean
   */
  public async logout() {
    return await evaluateAndReturn(this.page, () => WAPI.logout());
  }

  /**
   * Closes page and browser
   * @internal
   */
  public async close() {
    const closing = async (waPage: {
      browser: () => any;
      isClosed: () => any;
      close: () => any;
    }) => {
      if (waPage) {
        const browser = await waPage.browser();
        const pid = browser.process() ? browser?.process().pid : null;
        if (!waPage.isClosed()) await waPage.close();
        if (browser) await browser.close();
        if (pid) treekill(pid, 'SIGKILL');
      }
    };
    try {
      await closing(this.page);
    } catch (error) {}
    return true;
  }

  /**
   * Get message by id
   * @param messageId string
   * @returns Message object
   */
  public async getMessageById(messageId: string) {
    return (await evaluateAndReturn(
      this.page,
      (messageId: any) => WAPI.getMessageById(messageId),
      messageId
    )) as Message;
  }

  /**
   * Retorna uma lista de mensagens de um chat
   * @param chatId string ID da conversa ou do grupo
   * @param params GetMessagesParam Opções de filtragem de resultados (count, id, direction) veja {@link GetMessagesParam}.
   * @returns Message object
   */
  public async getMessages(chatId: string, params: GetMessagesParam = {}) {
    return await evaluateAndReturn(
      this.page,
      ({ chatId, params }) => WAPI.getMessages(chatId, params),
      { chatId, params: params as any }
    );
  }

  /**
   * Decrypts message file
   * @param message Message object
   * @returns Decrypted file buffer (null otherwise)
   */
  public async decryptFile(message: Message) {
    const mediaUrl = message.clientUrl || message.deprecatedMms3Url;

    const options = makeOptions(useragentOverride);

    if (!mediaUrl)
      throw new Error(
        'message is missing critical data needed to download the file.'
      );
    let haventGottenImageYet = true;
    let res: any;
    try {
      while (haventGottenImageYet) {
        res = await axios.get(mediaUrl.trim(), options);
        if (res.status == 200) {
          haventGottenImageYet = false;
        } else {
          await timeout(2000);
        }
      }
    } catch (error) {
      throw 'Error trying to download the file.';
    }
    const buff = Buffer.from(res.data, 'binary');
    return magix(buff, message.mediaKey, message.type, message.size);
  }

  /**
   * Rejeita uma ligação recebida pelo WhatsApp
   * @param callId string ID da ligação, caso não passado, todas ligações serão rejeitadas
   * @returns Número de ligações rejeitadas
   */
  public async rejectCall(callId?: string) {
    return await evaluateAndReturn(
      this.page,
      ({ callId }) => WAPI.rejectCall(callId),
      {
        callId,
      }
    );
  }
}
