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

import { getMessageById } from './get-message-by-id';

export async function forwardMessages(to, messages, skipMyMessages) {
  if (!Array.isArray(messages)) {
    messages = [messages];
  }
  const toForward = (
    await Promise.all(
      messages.map(async (msg) => {
        if (typeof msg === 'string') {
          return await getMessageById(msg, null, false);
        } else {
          return await getMessageById(msg.id, null, false);
        }
      })
    )
  ).filter((msg) => (skipMyMessages ? !msg.__x_isSentByMe : true));

  // const userId = new window.Store.UserConstructor(to);
  const conversation = window.Store.Chat.get(to);
  return conversation.forwardMessages(toForward);
}
