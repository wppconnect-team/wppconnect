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

export async function sendSticker(sticker, chatId, metadata, type) {
  var chat = await WAPI.sendExist(chatId);

  if (!chat.erro) {
    var stick = new window.Store.Sticker.default.modelClass();

    stick.__x_clientUrl = sticker.clientUrl;
    stick.__x_filehash = sticker.filehash;
    stick.__x_id = sticker.filehash;
    stick.__x_uploadhash = sticker.uploadhash;
    stick.__x_mediaKey = sticker.mediaKey;
    stick.__x_initialized = false;
    stick.__x_mediaData.mediaStage = 'INIT';
    stick.mimetype = 'image/webp';
    stick.height = metadata && metadata.height ? metadata.height : 512;
    stick.width = metadata && metadata.width ? metadata.width : 512;

    await stick.initialize();

    var result =
      (await stick.sendToChat(chat, {
        stickerIsFirstParty: false,
        stickerSendOrigin: 6,
      })) || '';
    var m = { type: type },
      obj,
      To = await WAPI.getchatId(chat.id);
    if (result === 'OK') {
      obj = WAPI.scope(To, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      obj = WAPI.scope(To, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
