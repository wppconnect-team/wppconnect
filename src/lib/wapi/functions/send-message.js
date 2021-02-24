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

export async function sendMessage(to, content) {
  var chat = Store.Chat.get(to);
  if (chat) {
    const newMsgId = await window.WAPI.getNewMessageId(chat.id);
    const fromwWid = await window.Store.Conn.wid;
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
    };

    await window.Store.addAndSendMsgToChat(chat, message);

    return newMsgId._serialized;
  } else {
    chat = await WAPI.sendExist(to);
    const message = content;
    if (!chat.erro) {
      const result = await chat.sendMessage(message);
      if (result === 'success' || result === 'OK') {
        return chat.lastReceivedKey._serialized;
      } else {
        const m = { type: 'sendtext', text: message };
        const To = await WAPI.getchatId(chat.id);
        const obj = WAPI.scope(To, true, result, null);
        Object.assign(obj, m);
        return obj;
      }
    } else {
      return chat;
    }
  }
}
