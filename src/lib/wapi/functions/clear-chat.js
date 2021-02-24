
export async function clearChat(id) {
  return await Store.ChatUtil.sendClear(Store.Chat.get(id), true);
}
