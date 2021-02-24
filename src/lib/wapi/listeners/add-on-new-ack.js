
export function addOnNewAcks() {
  window.WAPI.waitNewAcknowledgements = function (callback) {
    window.WAPI.waitForStore(['Chat', 'Msg'], () => {
      Store.Msg.on('change:ack', callback);
    });
    return true;
  };
}
