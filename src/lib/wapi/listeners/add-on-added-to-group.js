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

export function addOnAddedToGroup() {
  /**
   * Registers a callback that fires when your host phone is added to a group.
   * @param callback - function - Callback function to be called when a message acknowledgement changes. The callback returns 3 variables
   * @returns {boolean}
   */
  window.WAPI.onAddedToGroup = function (callback) {
    WPP.whatsapp.MsgStore.on('add', (message) => {
      /**
       * Mensagem precisa ser:
       * - Nova
       * - É uma notificação
       * - Do tipo de eventos de grupo
       * - Evento de adicionado no grupo
       */
      if (
        message.isNewMsg &&
        message.isNotification &&
        message.type === 'gp2' &&
        message.subtype === 'add'
      ) {
        try {
          const data = WAPI._serializeChatObj(message.chat);
          callback(data);
        } catch (error) {
          console.error(error);
        }
      }
    });
    return true;
  };
}
