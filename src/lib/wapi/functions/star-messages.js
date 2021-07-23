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

export async function starMessages(messagesId, star) {
  if (typeof star === 'undefined') {
    star = true;
  }

  if (!Array.isArray(messagesId)) {
    messagesId = [messagesId];
  }

  let messagesToStar = await Promise.all(
    messagesId.map(async (msgId) => await getMessageById(msgId, null, false))
  );

  // Ignore unchanged messages
  messagesToStar = messagesToStar.filter((msg) => msg && msg.star !== star);

  // group by chat
  const messagesPerChat = messagesToStar.reduce(function (r, msg) {
    const id = msg.id.remote._serialized;
    r[id] = r[id] || [];
    r[id].push(msg);
    return r;
  }, Object.create(null));

  let count = 0;
  // Star Messages
  for (const chatId in messagesPerChat) {
    const chat = Store.Chat.get(chatId);
    const messages = messagesPerChat[chatId];

    count += await chat
      .sendStarMsgs(messages, star)
      .then(() => messages.length)
      .catch(() => 0);
  }

  return count;
}
