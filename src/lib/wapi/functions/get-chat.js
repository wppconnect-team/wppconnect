
export function getChat(id) {
  if (!id) {
    return false;
  }
  id = typeof id == 'string' ? id : id._serialized;
  const found = Store.Chat.get(id);
  if (found) {
    found.sendMessage = found.sendMessage
      ? found.sendMessage
      : function () {
          return window.Store.sendMessage.apply(this, arguments);
        };
  }
  return found;
}
