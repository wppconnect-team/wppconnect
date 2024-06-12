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

export async function sendMute(chatId, time, type) {
  var chat = await WAPI.sendExist(chatId);
  if (!chat.erro) {
    let TimeInt = null;
    var result = null,
      remove = null,
      texto = null;
    var To = await WAPI.getchatId(chat.id),
      isMute = await window.Store.Mute.get(chat.id),
      m = { type: 'sendMute', time: time, timeType: type };
    if (typeof time === 'number' && typeof type === 'string') {
      switch (type) {
        case 'hours':
          TimeInt = parseInt(
            new Date(
              new Date().setHours(new Date().getHours() + time)
            ).getTime() / 1000
          );
          break;
        case 'minutes':
          TimeInt = parseInt(
            new Date(
              new Date().setMinutes(new Date().getMinutes() + time)
            ).getTime() / 1000
          );
          break;
        case 'year':
          TimeInt = parseInt(
            new Date(
              new Date().setDate(new Date().getDate() + time)
            ).getTime() / 1000
          );
          break;
      }
      await window.Store.SendMute.sendConversationMute(chat.id, TimeInt, 0)
        .then((e) => {
          result = e;
        })
        .catch((e) => {
          result = e;
        });
    } else {
      remove = true;
      await window.Store.SendMute.sendConversationMute(
        chat.id,
        0,
        isMute.__x_expiration
      )
        .then((e) => {
          result = e;
        })
        .catch((e) => {
          result = e;
        });
    }
    if (result.status === 200) {
      if (remove) {
        isMute.__x_expiration = 0;
        isMute.__x_isMuted = false;
      } else {
        isMute.__x_expiration = TimeInt;
        isMute.__x_isMuted = true;
      }
      var obj = WAPI.scope(To, false, result.status, null);
      Object.assign(obj, m);
      return obj;
    } else {
      if (remove) {
        texto = 'is not mute to remove';
      } else {
        texto = 'This chat is already mute';
      }
      var obj = WAPI.scope(To, true, result['status'], texto);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
