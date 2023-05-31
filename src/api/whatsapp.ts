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

import axios from 'axios';
import { Page } from 'puppeteer';
import { CreateConfig } from '../config/create-config';
import { useragentOverride } from '../config/WAuserAgente';
import { evaluateAndReturn } from './helpers';
import { magix, makeOptions, timeout } from './helpers/decrypt';
import { BusinessLayer } from './layers/business.layer';
import { GetMessagesParam, Message } from './model';
import treekill = require('tree-kill');

export class Whatsapp extends BusinessLayer {
  private connected: boolean | null = null;

  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);

    let interval: any = null;

    if (this.page) {
      this.page.on('close', async () => {
        clearInterval(interval);
      });
    }

    interval = setInterval(async (state) => {
      const newConnected = await page
        .evaluate(() => WPP.conn.isRegistered())
        .catch(() => null);

      if (newConnected === null || newConnected === this.connected) {
        return;
      }

      this.connected = newConnected;
      if (!newConnected) {
        this.log('info', 'Session Unpaired', { type: 'session' });
        setTimeout(async () => {
          if (this.statusFind) {
            try {
              this.statusFind('desconnectedMobile', session);
            } catch (error) {}
          }
        }, 1000);
      }
    }, 1000);
  }

  protected async afterPageScriptInjected() {
    await super.afterPageScriptInjected();
    this.page
      .evaluate(() => WPP.conn.isRegistered())
      .then((isAuthenticated) => {
        this.connected = isAuthenticated;
      })
      .catch(() => null);
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

    return await evaluateAndReturn(
      this.page,
      async (messageId) =>
        WPP.util.blobToBase64(await WPP.chat.downloadMedia(messageId)),
      messageId
    );
  }

  /**
   * Get the puppeteer page instance
   * @returns The Whatsapp page
   */
  get waPage(): Page {
    return this.page;
  }

  /**
   * Get the puppeteer page screenshot
   * @returns The Whatsapp page screenshot encoded in base64
   */
  public async takeScreenshot() {
    if (this.page) {
      return await this.page.screenshot({ encoding: 'base64' });
    }
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
    return await evaluateAndReturn(this.page, () => WPP.conn.logout());
  }

  /**
   * Closes page and browser
   * @internal
   */
  public async close() {
    const browser = this.page.browser();

    if (!this.page.isClosed()) {
      await this.page.close().catch(() => null);
    }

    await browser.close().catch(() => null);

    try {
      const process = browser.process();
      if (process) {
        treekill(process.pid, 'SIGKILL');
      }
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
        res = await axios.get<any>(mediaUrl.trim(), options);
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
      ({ callId }) => WPP.call.rejectCall(callId),
      {
        callId,
      }
    );
  }
}
