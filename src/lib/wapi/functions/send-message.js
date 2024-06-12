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

export async function sendMessage(to, content) {
  const chat = await WAPI.sendExist(to);

  if (!chat.erro) {
    var newId = WPP.chat.generateMessageID(chat.id);

    var message = {
      id: newId,
      body: content,
      type: 'chat',
      subtype: null,
      t: parseInt(new Date().getTime() / 1000),
      from: WPP.whatsapp.UserPrefs.getMaybeMeUser(),
      to: chat.id,
      self: 'out',
      isNewMsg: true,
      local: true,
      ack: 0,
      urlText: null,
      urlNumber: null,
    };

    var result =
      (
        await Promise.all(
          WPP.whatsapp.functions.addAndSendMsgToChat(chat, message)
        )
      )[1] || '';

    if (result === 'success' || result === 'OK') {
      return newId?._serialized;
    } else {
      const m = { type: 'sendtext', text: message };
      const To = await WAPI.getchatId(chat.id);
      const obj = WAPI.scope(To, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
