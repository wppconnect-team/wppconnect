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
import { ControlsLayer } from './layers/controls.layer';
import { Message } from './model';
import { magix, timeout, makeOptions } from './helpers/decrypt';
import { useragentOverride } from '../config/WAuserAgente';
import { CreateConfig } from '../config/create-config';
import axios from 'axios';
import treekill = require('tree-kill');

export class Whatsapp extends ControlsLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Decrypts message file
   * @param data Message object
   * @returns Decrypted file buffer (null otherwise)
   */
  public async downloadFile(data: string) {
    return await this.page.evaluate((data) => WAPI.downloadFile(data), data);
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

    const result = await this.page.evaluate(
      (messageId) =>
        WAPI.downloadMedia(messageId).catch((e) => ({
          __error: e,
        })),
      messageId
    );

    if (typeof result === 'object' && result.__error) {
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
    return await this.page.evaluate(() => WAPI.takeOver());
  }

  /**
   * Logout whastapp
   * @returns boolean
   */
  public async logout() {
    return await this.page.evaluate(() => WAPI.logout());
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
    return (await this.page.evaluate(
      (messageId: any) => WAPI.getMessageById(messageId),
      messageId
    )) as Message;
  }

  /**
   * Decrypts message file
   * @param message Message object
   * @returns Decrypted file buffer (null otherwise)
   */
  public async decryptFile(message: Message) {
    const options = makeOptions(useragentOverride);
    if (!message.clientUrl)
      throw new Error(
        'message is missing critical data needed to download the file.'
      );
    let haventGottenImageYet = true;
    let res: any;
    try {
      while (haventGottenImageYet) {
        res = await axios.get(message.clientUrl.trim(), options);
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
}
