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
    var vcardPromises = contacts.map(async (e) => {
      var id = e;
      var name = null;
      if (typeof e === 'object') {
        id = e.id;
        name = e.name;
      }

      var contChat = await WAPI.sendExist(id);

      // Create a copy of contact
      var contact = new Store.Contact.modelClass(contChat.contact);

      // Use defined name if exists
      if (name) {
        contact.name = name;
        Object.defineProperty(contact, 'formattedName', { value: name });
      }

      return await window.Store.Vcard.vcardFromContactModel(contact);
    });
    var newId = WPP.chat.generateMessageID(chat.id);
    var Vcards = await Promise.all(vcardPromises);

    var message = {
      ack: 0,
      from: Store.UserPrefs.getMaybeMeUser(),
      local: !0,
      self: 'out',
      id: newId,
      t: parseInt(new Date().getTime() / 1000),
      to: chat.id,
      type: 'multi_vcard',
      vcardList: Vcards,
      isNewMsg: !0,
    };

    var result =
      (await Promise.all(Store.addAndSendMsgToChat(chat, message)))[1] || '';
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
