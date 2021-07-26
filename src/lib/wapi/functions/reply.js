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

export async function reply(chatId, content, quotedMessageId) {
  const chat = Store.Chat.get(chatId);

  let quotedMsgOptions = {};
  if (quotedMessageId) {
    let quotedMessage = await getMessageById(quotedMessageId, null, false);
    if (quotedMessage && quotedMessage.canReply()) {
      quotedMsgOptions = quotedMessage.msgContextInfo(chat);
    }
  }

  const newMsgId = await window.WAPI.getNewMessageId(chat.id);
  const fromwWid = await Store.UserPrefs.getMaybeMeUser();
  const message = {
    id: newMsgId,
    ack: 0,
    body: content,
    from: fromwWid,
    to: chat.id,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    isNewMsg: !0,
    type: 'chat',
    ...quotedMsgOptions,
  };

  await window.Store.addAndSendMsgToChat(chat, message);

  return newMsgId._serialized;
}
