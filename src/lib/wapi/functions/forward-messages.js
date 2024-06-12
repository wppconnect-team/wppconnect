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

export async function forwardMessages(chatId, messagesId, skipMyMessages) {
  if (!Array.isArray(messagesId)) {
    messagesId = [messagesId];
  }

  await WAPI.sendExist(chatId);
  const chat = WPP.whatsapp.ChatStore.get(chatId);
  if (!chat) {
    throw {
      error: true,
      code: 'chat_not_found',
      message: 'Chat not found',
      chatId: chatId,
    };
  }

  const messages = [];

  for (const msg of messagesId) {
    const msgId = typeof msg === 'string' ? msg : msg.id;
    const messageData = await getMessageById(msgId, null, false);

    if (!messageData) {
      throw {
        error: true,
        code: 'message_not_found',
        message: 'Message not Found',
        messageId: msgId,
      };
    }

    messages.push(messageData);
  }

  const toForward = messages.filter((msg) =>
    skipMyMessages ? !msg.isSentByMe : true
  );

  await chat.forwardMessages(toForward);
  await new Promise((resolve) => setTimeout(resolve, 100)); // Wait collection update

  const msgs = chat.msgs.getModelsArray().slice(messagesId.length * -1);

  return msgs.map((m) => m.id._serialized);
}
