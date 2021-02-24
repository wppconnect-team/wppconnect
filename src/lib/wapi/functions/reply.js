
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
    ...quotedMsgOptions,
  };

  await window.Store.addAndSendMsgToChat(chat, message);

  return newMsgId._serialized;
}
