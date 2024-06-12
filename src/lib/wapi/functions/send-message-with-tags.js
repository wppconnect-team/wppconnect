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

export async function sendMessageWithTags(to, body) {
  var chat = to.id ? to : WPP.whatsapp.ChatStore.get(to);
  var chatId = chat.id._serialized;
  var msgIveSent = chat.msgs.filter((msg) => msg.__x_isSentByMe)[0];
  if (!msgIveSent) {
    return chat.sendMessage(body);
  }

  var tempMsg = Object.create(msgIveSent);
  var newId = WPP.chat.generateMessageID(chatId);
  var mentionedJidList =
    body
      .match(/@(\d*)/g)
      .map(
        (x) => new WPP.whatsapp.WidFactory.createUserWid(x.replace('@', ''))
      ) || undefined;

  var extend = {
    ack: 0,
    id: newId,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    to: new WPP.whatsapp.WidFactory.createWid(chatId),
    isNewMsg: !0,
    type: 'chat',
    body,
    quotedMsg: null,
    mentionedJidList,
  };

  Object.assign(tempMsg, extend);
  await WPP.whatsapp.functions.addAndSendMsgToChat(chat, tempMsg);
  return newId._serialized;
}
