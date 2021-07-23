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
    };
  Object.assign(objTo, extend);
  return objTo;
}

export async function sendExist(chatId, returnChat = true, Send = true) {
  if (!chatId) {
    return scope(chatId, true, 500, 'Chat ID is empty');
  }

  // Check chat exists (group is always a chat)
  let chat = await window.WAPI.getChat(chatId);

  if (!chat && chatId === 'status@broadcast') {
    chat = new Store.Chat.modelClass({
      id: Store.WidFactory.createWid('status@broadcast'),
    });
    Store.Chat.add(chat);
    chat = await window.WAPI.getChat(chatId); // Fix some methods
  }

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
