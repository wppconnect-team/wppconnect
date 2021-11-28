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

export async function getMessages(chatId, params = {}, serialize = true) {
  const msgs = await WPP.chat.getMessages(chatId, params);

  if (!Array.isArray(msgs)) {
    const error = new Error(`Failed to fetch messages for ${chatId}`);

    Object.assign(error, msgs);

    throw error;
  }

  const result = msgs
    .map((m) => new WPP.whatsapp.MsgStore.modelClass(m))
    .map((m) => WAPI.processMessageObj(m, true, true));

  return result;
}
