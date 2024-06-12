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

import { processFiles } from './process-files';
import { base64ToFile } from '../helper';
import { getMessageById } from './get-message-by-id';

/**
 * Sends image to given chat if
 * @param {string} imgBase64 base64 encoded file
 * @param {string} chatid Chat id
 * @param {string} filename
 * @param {string} caption
 * @param {Function} done Optional callback
 * @param {string} quotedMessageId Quoted message id
 */
export async function sendPtt(
  imgBase64,
  chatid,
  filename,
  caption,
  done,
  quotedMessageId = null
) {
  var chat = await WAPI.sendExist(chatid);

  if (!chat.erro) {
    let quotedMsg = null;

    if (typeof quotedMessageId === 'string' && quotedMessageId) {
      const message = await getMessageById(quotedMessageId, null, false);

      if (message && message.canReply()) {
        quotedMsg = message;
      }
    }

    var mediaBlob = base64ToFile(imgBase64, filename);
    var mediaCollection = await processFiles(chat, mediaBlob);
    var media = mediaCollection.getModelsArray()[0];
    media.mediaPrep._mediaData.type = 'ptt';

    var result = (await media.sendToChat(chat, { caption, quotedMsg })) || '';

    if (done !== undefined) done(true);

    var m = {
      type: 'ptt',
      filename: filename,
      text: caption,
    };
    var to = await WAPI.getchatId(chat.id);
    if (result === 'success' || result === 'OK') {
      var obj = WAPI.scope(to, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      var obj = WAPI.scope(to, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
