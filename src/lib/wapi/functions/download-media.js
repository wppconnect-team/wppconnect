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

import { getMessageById } from './get-message-by-id';

export async function downloadMedia(messageId) {
  const msg = await getMessageById(messageId, null, false);

  if (!msg) {
    throw {
      error: true,
      code: 'message_not_found',
      message: 'Message not found',
    };
  }
  if (!msg.mediaData) {
    throw {
      error: true,
      code: 'message_not_contains_media',
      message: 'Message not contains media',
    };
  }

  await msg.downloadMedia(true, 1);

  let blob = null;

  if (msg.mediaData.mediaBlob) {
    blob = msg.mediaData.mediaBlob.forceToBlob();
  } else if (msg.mediaData.filehash) {
    blob = Store.BlobCache.get(msg.mediaData.filehash);
  }

  // Transform a VIDEO message to a DOCUMENT message
  if (!blob && msg.mediaObject.type && msg.mediaObject.type === 'VIDEO') {
    delete msg.mediaObject.type;
    msg.type = 'document';
    return downloadMedia(messageId);
  }

  if (!blob) {
    throw {
      error: true,
      code: 'media_not_found',
      message: 'Media not found',
    };
  }

  return await new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = function (e) {
      resolve(reader.result);
    };
    reader.onabort = reject;
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
