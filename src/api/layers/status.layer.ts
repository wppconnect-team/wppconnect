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
import { CreateConfig } from '../../config/create-config';
import { LabelsLayer } from './labels.layer';
import {
  evaluateAndReturn,
  base64MimeType,
  fileToBase64,
  downloadFileToBase64,
} from '../helpers';
import { SendStatusOptions } from '@wppconnect/wa-js/dist/status';

export class StatusLayer extends LabelsLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }
  /**
   * Send a image message to status stories
   * @category Status
   *
   * @example
   * ```javascript
   * client.sendImageStatus('data:image/jpeg;base64,<a long base64 file...>');
   * ```
   *
   * @example
   * ```javascript
   * // Send with caption
   * client.sendImageStatus('data:image/jpeg;base64,<a long base64 file...>', { caption: 'example test' } );
   * ```
   * @param pathOrBase64 Path or base 64 image
   */
  public async sendImageStatus(
    pathOrBase64: string,
    options?: SendStatusOptions & { caption?: string }
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
        'Not an image, allowed formats png, jpeg and webp'
      );
      Object.assign(error, {
        code: 'invalid_image',
      });
      throw error;
    }
    return await evaluateAndReturn(
      this.page,
      ({ base64, options }) => {
        WPP.status.sendImageStatus(base64, options);
      },
      { base64, options }
    );
  }
  /**
   * Send a video message to status stories
   * @category Status
   *
   * @example
   * ```javascript
   * client.sendVideoStatus('data:video/mp4;base64,<a long base64 file...>');
   * ```
   * @example
   * ```javascript
   * // Send with caption
   * client.sendVideoStatus('data:video/mp4;base64,<a long base64 file...>', { caption: 'example test' } );
   * ```
   * @param pathOrBase64 Path or base 64 image
   */
  public async sendVideoStatus(
    pathOrBase64: string,
    options?: SendStatusOptions & { caption?: string }
  ) {
    let base64: string = '';
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
    }

    if (!base64) {
      const error = new Error('Empty or invalid file or base64');
      Object.assign(error, {
        code: 'empty_file',
      });
      throw error;
    }

    return await evaluateAndReturn(
      this.page,
      ({ base64, options }) => {
        WPP.status.sendVideoStatus(base64, options);
      },
      { base64, options }
    );
  }

  /**
   * Send a text to status stories
   * @category Status
   *
   * @example
   * ```javascript
   * client.sendTextStatus(`Bootstrap primary color: #0275d8`, { backgroundColor: '#0275d8', font: 2});
   * ```
   * @param pathOrBase64 Path or base 64 image
   */
  public async sendTextStatus(
    text: string,
    options: {
      backgroundColor?: string;
      font?: number;
    }
  ) {
    return await evaluateAndReturn(
      this.page,
      ({ text, options }) => {
        WPP.status.sendTextStatus(text, options);
      },
      { text, options }
    );
  }

  /**
   * Mark status as read/seen
   * @category Status
   *
   * @example
   * ```javascript
   * client.sendReadStatus('[phone_number]@c.us', 'false_status@broadcast_3A169E0FD4BC6E92212F_[]@c.us');
   * ```
   * @param chatId Chat ID of contact
   * @param statusId ID of status msg
   */
  public async sendReadStatus(chatId: string, statusId: string) {
    return await evaluateAndReturn(
      this.page,
      ({ chatId, statusId }) => {
        WPP.status.sendReadStatus(chatId, statusId);
      },
      { chatId, statusId }
    );
  }
}
