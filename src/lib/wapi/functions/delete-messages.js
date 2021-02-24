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

export async function deleteMessages(chatId, messageArray, onlyLocal, done) {
  const userId = new Store.WidFactory.createWid(chatId);
  const conversation = WAPI.getChat(userId);
  if (!conversation) {
    if (done !== undefined) {
      done(false);
    }
    return false;
  }

  if (!Array.isArray(messageArray)) {
    messageArray = [messageArray];
  }

  let messagesToDelete = (
    await Promise.all(
      messageArray.map(async (msgId) =>
        typeof msgId == 'string'
          ? await getMessageById(msgId, null, false)
          : msgId
      )
    )
  ).filter((x) => x);
  if (messagesToDelete.length == 0) return true;
  let jobs = onlyLocal
    ? [conversation.sendDeleteMsgs(messagesToDelete, conversation)]
    : [
        conversation.sendRevokeMsgs(
          messagesToDelete.filter((msg) => msg.isSentByMe),
          conversation
        ),
        conversation.sendDeleteMsgs(
          messagesToDelete.filter((msg) => !msg.isSentByMe),
          conversation
        ),
      ];
  return Promise.all(jobs).then((_) => {
    if (done !== undefined) {
      done(true);
    }
    return true;
  });
}
