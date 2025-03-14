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
import { magix, makeOptions, newMagix, timeout } from './helpers/decrypt';
import { BusinessLayer } from './layers/business.layer';
import { GetMessagesParam, Message } from './model';
import * as fs from 'fs';
import { sleep } from '../utils/sleep';

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

    interval = setInterval(async () => {
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
              this.statusFind('disconnectedMobile', session);
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
   * @param messageId Message or id
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
   * @returns The Whatsapp page screenshot as a PNG encoded in base64 (not the full data URI, just the base64 section)
   */
  public async takeScreenshot() {
    if (this.page) {
      return await this.page.screenshot({ encoding: 'base64' });
    }
  }

  /**
   * Clicks on 'use here' button (When it gets unlaunched)
   * This method tracks the class of the button
   * WhatsApp Web might change this class name over time
   * Don't rely on this method
   */
  public async useHere() {
    return await evaluateAndReturn(this.page, () => WAPI.takeOver());
  }

  /**
   * Log out of WhatsApp
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

      await browser.close().catch(() => null);
      /*
      Code was removed as it is not necessary.
      try {
        const process = browser.process();
        if (process) {
          treekill(process.pid, 'SIGKILL');
        }
      } catch (error) {}
      */
    }

    return true;
  }

  /**
   * Return PID process
   * @internal
   */
  public getPID() {
    const browser = this.page.browser();
    const process = browser.process();
    return process.pid;
  }

  /**
   * Get a message by its ID
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
   * Returns a list of messages from a chat
   * @param chatId string ID of the conversation or group
   * @param params GetMessagesParam Result filtering options (count, id, direction) see {@link GetMessagesParam}.
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
   * @returns Decrypted file buffer (`null` otherwise)
   */
  public async decryptFile(message: Message) {
    const mediaUrl = message.clientUrl || message.deprecatedMms3Url;

    const options = makeOptions(useragentOverride);

    if (!mediaUrl)
      throw new Error(
        'message is missing critical data (`mediaUrl`) needed to download the file.'
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

  public async decryptAndSaveFile(
    message: Message,
    savePath: string
  ): Promise<void> {
    const mediaUrl = message.clientUrl || message.deprecatedMms3Url;

    if (!mediaUrl) {
      throw new Error(
        'Message is missing critical data needed to download the file.'
      );
    }

    try {
      const tempSavePath: string = savePath + '.encrypted';
      await this.downloadEncryptedFile(mediaUrl.trim(), tempSavePath);

      const inputReadStream = fs.createReadStream(tempSavePath);
      const outputWriteStream = fs.createWriteStream(savePath);
      const decryptedStream = newMagix(
        message.mediaKey,
        message.type,
        message.size
      );

      inputReadStream.pipe(decryptedStream).pipe(outputWriteStream);

      await new Promise<void>((resolve, reject) => {
        outputWriteStream.on('finish', () => {
          console.log(
            `Deciphering complete. Deleting the encrypted file: ${tempSavePath}`
          );
          fs.unlink(tempSavePath, (error) => {
            if (error) {
              console.error(
                `Error deleting the input file: ${tempSavePath}`,
                error
              );
              reject(error);
            } else {
              console.log('Encrypted file deleted successfully');
              resolve();
            }
          });
        });

        outputWriteStream.on('error', (error) => {
          console.error(`Error during writing file: ${savePath}`, error);
          reject(error);
        });

        decryptedStream.on('error', (error) => {
          console.error('An error occurred while decrypting the file', error);
          reject(error);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  downloadEncryptedFile = async (
    url: string,
    outputPath: string,
    retries: number = 3
  ) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(
          url,
          makeOptions(useragentOverride, 'stream')
        );

        await new Promise((resolve, reject) => {
          const writer = fs.createWriteStream(outputPath);
          response.data.pipe(writer);
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        console.log(`Encrypted file downloaded at ${outputPath}`);
        return;
      } catch (error) {
        console.error(`Attempt ${attempt} failed: `, error.message);
        if (attempt === retries) {
          console.error(
            `${outputPath} - All attempt failed to download the file: ${url}`
          );
          throw error;
        }

        console.log(
          `${outputPath} - Retrying to download the file: ${url} in 5 seconds...`
        );
        await sleep(5000);
      }
    }
  };

  /**
   * Rejects a call received via WhatsApp
   * @param callId string Call ID, if not passed, all calls will be rejected
   * @returns Number of rejected calls
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
