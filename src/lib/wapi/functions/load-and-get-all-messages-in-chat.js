
export async function loadAndGetAllMessagesInChat(
  id,
  includeMe,
  includeNotifications,
  done
) {
  return WAPI.loadAllEarlierMessages(id).then((_) => {
    const chat = WAPI.getChat(id);
    let output = [];
    const messages = chat.msgs._models;

    for (const i in messages) {
      if (i === 'remove') {
        continue;
      }
      const messageObj = messages[i];

      let message = WAPI.processMessageObj(
        messageObj,
        includeMe,
        includeNotifications
      );
      if (message) output.push(message);
    }
    if (done !== undefined) done(output);
    return output;
  });
}
