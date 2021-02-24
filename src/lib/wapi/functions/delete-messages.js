
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
