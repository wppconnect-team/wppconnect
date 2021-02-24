
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
