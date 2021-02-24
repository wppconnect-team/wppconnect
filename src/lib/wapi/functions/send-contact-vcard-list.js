
export async function sendContactVcardList(chatId, contacts) {
  if (typeof chatId != 'string') {
    var text =
      "incorrect parameter, insert an string. Example: '222222222222@c.us'";
    return WAPI.scope(chatId, true, null, text);
  }
  if (!Array.isArray(contacts)) {
    var text =
      "incorrect parameter, insert an array. Example: ['222222222222@c.us', '333333333333@c.us, ... ]";
    return WAPI.scope(chatId, true, null, text);
  }
  if (contacts.length === 1) {
    var text =
      "Enter more than one number to send. Example: ['222222222222@c.us', '333333333333@c.us, ... ]";
    return WAPI.scope(chatId, true, null, text);
  }
  var chat = await WAPI.sendExist(chatId);
  if (!chat.erro) {
    var tempMsg = Object.create(
        Store.Msg.models.filter(
          (msg) => msg.__x_isSentByMe && !msg.quotedMsg
        )[0]
      ),
      conta = contacts.map(async (e) => {
        return await WAPI.sendExist(e);
      });
    var ar = await Promise.all(conta);
    var cont = new Array();
    for (var key in ar) {
      cont.push(ar[key].__x_contact);
    }
    var vcard = cont.map(async (e) => {
      return await window.Store.Vcard.vcardFromContactModel(e);
    });
    var newId = window.WAPI.getNewMessageId(chatId);
    var Vcards = await Promise.all(vcard);
    var extend = {
      ack: 0,
      from: chatId,
      local: !0,
      self: 'out',
      id: newId,
      t: parseInt(new Date().getTime() / 1000),
      to: chatId,
      type: 'multi_vcard',
      vcardList: Vcards,
      isNewMsg: !0,
    };
    Object.assign(tempMsg, extend);
    var result =
      (await Promise.all(Store.addAndSendMsgToChat(chat, tempMsg)))[1] || '';
    var m = { from: contacts, type: 'multi_vcard' },
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
