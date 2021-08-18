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
  // Definição de valores padrões
  if (typeof params === 'undefined') {
    params = {};
  }
  if (typeof params.count === 'undefined') {
    params.count = 20;
  }
  if (typeof params.direction === 'undefined') {
    params.direction = 'before';
  }

  // Corrige o ID do chat
  if (typeof chatId === 'object' && chatId._serialized) {
    chatId = chatId._serialized;
  }

  const chat = window.Store.Chat.get(chatId);
  if (!chat) {
    throw {
      error: true,
      code: 'chat_not_found',
      message: 'Chat not found',
    };
  }

  const chatWid = Store.WidFactory.createWid(chatId);

  // É valido apenas before e after
  let direction = 'before';
  if (params.direction === 'after') {
    direction = 'after';
  }

  const queryData = {
    remote: chatWid,
    count: params.count,
    owner: params.fromMe,
    direction: direction,
  };

  // Caso tenha informado o ID da mensagem, a consulta se realizará a partir dela
  if (params.id) {
    try {
      const msgKey = window.Store.MsgKey.fromString(params.id);
      if (msgKey) {
        queryData.id = msgKey.id;
        queryData.fromMe = msgKey.fromMe;
        queryData._serialized = msgKey._serialized;
      }
    } catch (error) {
      queryData.id = params.id;
    }
  } else {
    // Pesquisa sem ID sempre trará mais uma mensagem do que solicitado
    queryData.count--;
  }

  const msgs = await Store.msgFindQuery(direction, queryData);
  console.log(msgs);

  if (!Array.isArray(msgs)) {
    const error = new Error(`Failed to fetch messages for ${chat.id}`);

    Object.assign(error, msgs);

    throw error;
  }

  const result = msgs
    .map((m) => new Store.Msg.modelClass(m))
    .map((m) => WAPI.processMessageObj(m, true, true));

  return result;
}
