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

export async function sendContactVcard(chatId, contact, name) {
  var chat = await WAPI.sendExist(chatId);
  var cont = await WAPI.sendExist(contact);
  if (chat.id && cont.id) {
    var newId = window.WAPI.getNewMessageId(chat.id);
    var tempMsg = Object.create(
      Store.Msg.models.filter((msg) => msg.__x_isSentByMe && !msg.quotedMsg)[0]
    );
    var bod = await window.Store.Vcard.vcardFromContactModel(cont.__x_contact);
    name = !name ? cont.__x_formattedTitle : name;
    var extend = {
      ack: 0,
      body: bod.vcard,
      from: cont.__x_contact,
      local: !0,
      self: 'out',
      id: newId,
      vcardFormattedName: name,
      t: parseInt(new Date().getTime() / 1000),
      to: chatId,
      type: 'vcard',
      isNewMsg: !0,
    };
    Object.assign(tempMsg, extend);
    var result =
      (await Promise.all(Store.addAndSendMsgToChat(chat, tempMsg)))[1] || '';
    var m = { from: contact, type: 'vcard' },
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
