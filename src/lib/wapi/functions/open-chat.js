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

export async function openChat(chatId) {
  const chat = Store.Chat.get(chatId);
  const result = Store.Cmd.default.openChatBottom(chat);
  return result;
}

/**
 * Opens chat at given message position
 * This is a UI proccess, use this in a queue
 * @param {string} chatId Chat id
 * @param {string} messageId Message id: (For example: '06D3AB3D0EEB9D077A3F9A3EFF4DD030')
 * @returns {{wasVisible: boolean, alignAt: string}}: {wasVisible: false, alignAt: "center"}
 */
export async function openChatAt(chatId, messageId) {
  const chat = Store.Chat.get(chatId);
  const atMessage = chat.msgs.models.find((model) => model.id.id === messageId);
  const args = {
    collection: chat.msgs,
    msg: atMessage,
    isUnreadDivider: false,
  };
  const result = await Store.Cmd.default._openChat(chat, args);
  return result;
}
