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

export async function sendContactVcard(chatId, contactId, name) {
  var chat = await WAPI.sendExist(chatId);
  var contChat = await WAPI.sendExist(contactId);
  if (chat.id && contChat.id) {
    var newId = WPP.chat.generateMessageID(chat.id);
    // Create a copy of contact
    var contact = new Store.Contact.modelClass(contChat.contact);

    // Use defined name if exists
    if (name) {
      contact.name = name;
      Object.defineProperty(contact, 'formattedName', { value: name });
    }

    var bod = await window.Store.Vcard.vcardFromContactModel(contact);
    var message = {
      ack: 0,
      body: bod.vcard,
      from: Store.UserPrefs.getMaybeMeUser(),
      local: !0,
      self: 'out',
      id: newId,
      vcardFormattedName: contact.formattedName,
      t: parseInt(new Date().getTime() / 1000),
      to: chat.id,
      type: 'vcard',
      isNewMsg: !0,
    };

    var result =
      (await Promise.all(Store.addAndSendMsgToChat(chat, message)))[1] || '';
    var m = { from: contactId, type: 'vcard' },
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
