
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
