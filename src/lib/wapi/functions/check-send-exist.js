
export function scope(id, erro, status, text = null) {
  let e = {
    me: Store.Me.attributes,
    to: id,
    erro: erro,
    text: text,
    status: status,
  };
  return e;
}
export async function getchatId(chatId) {
  var to = await WAPI.getChatById(chatId),
    objTo = to.lastReceivedKey,
    extend = {
      formattedName: to.contact.formattedName,
      isBusiness: to.contact.isBusiness,
      isMyContact: to.contact.isMyContact,
      verifiedName: to.contact.verifiedName,
      pushname: to.contact.pushname,
      isOnline: to.isOnline,
    };
  Object.assign(objTo, extend);
  return objTo;
}

export async function sendExist(chatId, returnChat = true, Send = true) {
  // Check chat exists (group is always a chat)
  let chat = await window.WAPI.getChat(chatId);

  // Check if contact number exists
  if (!chat && !chatId.includes('@g')) {
    let ck = await window.WAPI.checkNumberStatus(chatId);

    if (!ck.numberExists) {
      return scope(chatId, true, ck.status, 'The number does not exist');
    }

    // Load chat ID for non contact
    await window.Store.Chat.find(ck.id);

    chatId = ck.id._serialized;
    chat = await window.WAPI.getChat(chatId);
  }

  if (!chat) {
    return scope(chatId, true, 404);
  }
  if (Send) {
    await window.Store.SendSeen(chat, false);
  }
  if (returnChat) {
    return chat;
  }
  return scope(chatId, false, 200);
}
