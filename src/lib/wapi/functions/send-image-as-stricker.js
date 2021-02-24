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

import { base64ToFile } from '../helper/base64-to-file';
import { sendSticker } from './send-sticker';

/**
 * Sends image as sticker to given chat id
 * @param {string} imageBase64 Image as base64 A valid webp image is required.
 * @param {string} chatId chat id '000000000000@c.us'
 * @param {*} metadata about the image. Based on [sharp metadata](https://sharp.pixelplumbing.com/api-input#metadata)
 */
export async function sendImageAsSticker(imageBase64, chatId, metadata, type) {
  const mediaBlob = base64ToFile(
    'data:image/webp;base64,' + imageBase64,
    'file.webp'
  );
  let encrypted = await window.WAPI.encryptAndUploadFile('sticker', mediaBlob);

  return await sendSticker(encrypted, chatId, metadata, type);
}
