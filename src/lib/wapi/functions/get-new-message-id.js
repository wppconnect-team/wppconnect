
export function getNewMessageId(chatId) {
  const newMsgId = new Store.MsgKey(
    Object.assign({}, Store.Msg.models[0].__x_id)
  );

  newMsgId.fromMe = true;
  newMsgId.id = WAPI.getNewId().toUpperCase();
  newMsgId.remote = new Store.WidFactory.createWid(chatId);
  newMsgId._serialized = `${newMsgId.fromMe}_${newMsgId.remote}_${newMsgId.id}`;
  return newMsgId;
}
