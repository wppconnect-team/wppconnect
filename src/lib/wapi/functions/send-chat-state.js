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

export async function sendChatstate(state, chatId) {
  state = parseInt(state, 10);

  const chat = WPP.whatsapp.ChatStore.get(chatId);

  if (!chat) {
    throw {
      error: true,
      code: 'chat_not_found',
      message: 'Chat not found',
    };
  }

  switch (state) {
    case 0:
      window.Store.ChatStates.sendChatStateComposing(chat.id);
      break;
    case 1:
      window.Store.ChatStates.sendChatStateRecording(chat.id);
      break;
    case 2:
      window.Store.ChatStates.sendChatStatePaused(chat.id);
      break;
    default:
      return false;
  }

  return true;
}
