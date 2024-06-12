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

export async function setTemporaryMessages(chatId, value) {
  const chat = WPP.whatsapp.ChatStore.get(chatId);

  if (!chat) {
    throw {
      error: true,
      code: 'chat_not_found',
      message: 'Chat not found',
    };
  }
  if (chat.isGroup) {
    return await WPP.group.setProperty(chat.id, 'ephemeral', value);
  }

  value = value ? 604800 : 0;

  await Store.changeEphemeralDuration(chat, value).catch((e) => {
    throw {
      error: true,
      code: e.code || e.status || e.statusCode || 'unknown',
      message: e.message || e.reason || 'Unknown Error',
    };
  });

  return true;
}
