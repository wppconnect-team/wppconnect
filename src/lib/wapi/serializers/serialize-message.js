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

// Since WhatsApp Web 2.3000.x, a MsgKey's cached `_serialized` property can come
// back `null` (its minified name changed), while `MsgKey.toString()` still returns
// the correct serialized id. Reading `_serialized` directly left `id` undefined,
// which silently broke quoted replies (`quotedMsg`) and anything else relying on
// `msg.id`. Prefer `_serialized`, fall back to `toString()`.
const serializeMsgKey = (key) =>
  key ? key._serialized || key.toString?.() : undefined;

export const _serializeMessageObj = (obj) => {
  if (obj == undefined) {
    return null;
  }
  if (obj.quotedMsg && obj.quotedMsgObj) obj.quotedMsgObj();
  return Object.assign(window.WAPI._serializeRawObj(obj), {
    id: serializeMsgKey(obj.id),
    from: obj.from._serialized,
    quotedParticipant: obj?.quotedParticipant?._serialized,
    author: obj?.author?._serialized,
    chatId: obj?.id?.remote || obj?.chatId?._serialized,
    to: obj?.to?._serialized,
    fromMe: obj?.id?.fromMe,
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
    quotedMsgId: serializeMsgKey(obj?._quotedMsgObj?.id),
    mediaData: window.WAPI._serializeRawObj(obj['mediaData']),
  });
};
