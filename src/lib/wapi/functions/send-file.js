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

export async function sendFile(imgBase64, chatid, filename, caption, type) {
  type = type ? type : 'sendFile';

  if (
    (typeof filename != 'string' && filename != null) ||
    (typeof caption != 'string' && caption != null)
  ) {
    var text = 'incorrect parameter, insert an string.';
    return WAPI.scope(chatid, true, null, text);
  }
  var mime = imgBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if (mime && mime.length) {
    mime = mime[1];
  }
  var chat = await WAPI.sendExist(chatid);
  if (!chat.erro) {
    var mediaBlob = base64ToFile(imgBase64, filename),
      mediaCollection = await processFiles(chat, mediaBlob),
      media = mediaCollection.models[0];
    var result = (await media.sendToChat(chat, { caption: caption })) || '';
    var m = { type: type, filename: filename, text: caption, mimeType: mime },
      To = await WAPI.getchatId(chat.id);
    if (result === 'success' || result === 'OK') {
      var obj = WAPI.scope(To, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      var obj = WAPI.scope(To, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
