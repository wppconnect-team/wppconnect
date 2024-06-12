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

export async function sendLocation(
  chatId,
  latitude,
  longitude,
  location = null
) {
  var chat = await WAPI.sendExist(chatId);

  if (!chat.erro) {
    var newId = WPP.chat.generateMessageID(chat.id);

    var message = {
      ack: 0,
      id: newId,
      local: true,
      self: 'out',
      t: parseInt(new Date().getTime() / 1000),
      from: WPP.whatsapp.UserPrefs.getMaybeMeUser(),
      to: chat.id,
      isNewMsg: true,
      type: 'location',
      lat: latitude,
      lng: longitude,
      loc: location,
    };

    var result =
      (
        await Promise.all(
          WPP.whatsapp.functions.addAndSendMsgToChat(chat, message)
        )
      )[1] || '';
    var m = {
        latitude: latitude,
        longitude: longitude,
        title: location,
        type: 'location',
      },
      obj,
      To = await WAPI.getchatId(chat.id);
    if (result == 'success' || result == 'OK') {
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
