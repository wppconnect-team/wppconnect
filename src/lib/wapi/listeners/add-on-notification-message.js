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

export function addOnNotificationMessage() {
  window.WAPI.onNotificationMessage = function (callback) {
    WPP.whatsapp.MsgStore.on('add', (message) => {
      if (!message.isNotification || !message.isNewMsg) {
        return;
      }
      const data = WAPI._serializeMessageObj(message);
      callback(data);
    });

    return true;
  };
}
