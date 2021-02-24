
import { getMessageById } from './get-message-by-id';

export async function forwardMessages(to, messages, skipMyMessages) {
  if (!Array.isArray(messages)) {
    messages = [messages];
  }
  const toForward = (
    await Promise.all(
      messages.map(async (msg) => {
        if (typeof msg === 'string') {
          return await getMessageById(msg, null, false);
        } else {
          return await getMessageById(msg.id, null, false);
        }
      })
    )
  ).filter((msg) => (skipMyMessages ? !msg.__x_isSentByMe : true));

  // const userId = new window.Store.UserConstructor(to);
  const conversation = window.Store.Chat.get(to);
  return conversation.forwardMessages(toForward);
}
