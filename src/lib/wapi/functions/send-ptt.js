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
 * Sends image to given chat if
 * @param {string} imgBase64 base64 encoded file
 * @param {string} chatid Chat id
 * @param {string} filename
 * @param {string} caption
 * @param {Function} done Optional callback
 */
export function sendPtt(imgBase64, chatid, filename, caption, done) {
  const idUser = new Store.WidFactory.createWid(chatid);
  return Store.Chat.find(idUser).then((chat) => {
    var mediaBlob = base64ToFile(imgBase64, filename);
    processFiles(chat, mediaBlob).then((mediaCollection) => {
      var media = mediaCollection.models[0];
      media.mediaPrep._mediaData.type = 'ptt';
      media.mediaPrep.sendToChat(chat, { caption: caption });
      if (done !== undefined) done(true);
    });
  });
}
