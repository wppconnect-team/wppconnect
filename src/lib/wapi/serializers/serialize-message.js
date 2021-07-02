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

export const _serializeMessageObj = (obj) => {
  if (obj == undefined) {
    return null;
  }
  const _chat = obj['chat'] ? WAPI._serializeChatObj(obj['chat']) : {};
  if (obj.quotedMsg) obj.quotedMsgObj();
  return Object.assign(window.WAPI._serializeRawObj(obj), {
    id: obj.id._serialized,
    from: obj.from._serialized,
    quotedParticipant: obj.quotedParticipant
      ? obj.quotedParticipant._serialized
        ? obj.quotedParticipant._serialized
        : undefined
      : undefined,
    author: obj.author
      ? obj.author._serialized
        ? obj.author._serialized
        : undefined
      : undefined,
    chatId:
      obj.id && obj.id.remote
        ? obj.id.remote
        : obj.chatId && obj.chatId._serialized
        ? obj.chatId._serialized
        : undefined,
    to: obj.to
      ? obj.to._serialized
        ? obj.to._serialized
        : undefined
      : undefined,
    fromMe: obj.id.fromMe,
    sender: obj['senderObj']
      ? WAPI._serializeContactObj(obj['senderObj'])
      : null,
    timestamp: obj['t'],
    content: obj['body'],
    isGroupMsg: obj.isGroupMsg,
    isLink: obj.isLink,
    isMMS: obj.isMMS,
    isMedia: obj.isMedia,
    isNotification: obj.isNotification,
    isPSA: obj.isPSA,
    type: obj.type,
    chat: _chat,
    quotedMsgId: obj._quotedMsgObj
      ? obj._quotedMsgObj.id
        ? obj._quotedMsgObj.id._serialized
        : obj._quotedMsgObj.id._serialized
      : undefined,
    mediaData: window.WAPI._serializeRawObj(obj['mediaData']),
    reply: (body) => window.WAPI.reply(_chat.id._serialized, body, obj),
  });
};
