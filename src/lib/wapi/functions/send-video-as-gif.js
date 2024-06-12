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

/**
 * Sends video as a gif to given chat id
 * @param {string} dataBase64
 * @param {string} chatid
 * @param {string} filename
 * @param {string} caption
 * @param {Function} done Optional callback
 */
export async function sendVideoAsGif(
  dataBase64,
  chatid,
  filename,
  caption,
  done
) {
  var chat = await WAPI.sendExist(chatid);
  if (!chat.erro) {
    var mediaBlob = base64ToFile(dataBase64, filename);
    var mediaCollection = await processFiles(chat, mediaBlob);
    var media = mediaCollection.getModelsArray()[0];
    media.mediaPrep._mediaData.isGif = true;
    media.mediaPrep._mediaData.gifAttribution = 1;

    var result = (await media.sendToChat(chat, { caption: caption })) || '';
    var m = { filename: filename, text: caption },
      To = await WAPI.getchatId(chat.id);
    if (result === 'success' || result === 'OK') {
      if (done !== undefined) done(false);
      var obj = WAPI.scope(To, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      if (done !== undefined) done(true);
      var obj = WAPI.scope(To, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
