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

export async function pinChat(chatId, type = true, notExist = false) {
  if (typeof type != 'boolean' || typeof notExist != 'boolean') {
    var text = 'incorrect parameter, insert a boolean true or false';
    return WAPI.scope(chatId, true, null, text);
  }
  let typeFix = type ? 'pin' : 'unpin',
    retult = void 0;
  var chat = await WAPI.sendExist(chatId, true, notExist);
  if (!chat.erro) {
    var m = {
        type: 'pinChat',
        typefix: typeFix,
      },
      To = await WAPI.getchatId(chat.id);
    await Store.pinChat
      .setPin(chat, type)
      .then((_) => {
        var obj = WAPI.scope(To, false, 'OK', null);
        Object.assign(obj, m);
        retult = obj;
      })
      .catch((error) => {
        var obj = WAPI.scope(To, true, error, 'Pin Chat first');
        Object.assign(obj, m);
        retult = obj;
      });
    return retult;
  } else {
    return chat;
  }
}
