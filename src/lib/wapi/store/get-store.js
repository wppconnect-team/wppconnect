
import { storeObjects } from './store-objects';

export function getStore(modules) {
  let foundCount = 0;
  let neededObjects = storeObjects;
  window.Store = window.Store || {};
  for (let idx in modules) {
    if (typeof modules[idx] === 'object' && modules[idx] !== null) {
      let first = Object.values(modules[idx])[0];
      if (typeof first === 'object' && first.exports) {
        for (let idx2 in modules[idx]) {
          let module = modules(idx2);
          if (!module) {
            continue;
          }
          neededObjects.forEach((needObj) => {
            if (!needObj.conditions || needObj.foundedModule) return;
            let neededModule = needObj.conditions(module);
            if (neededModule !== null) {
              foundCount++;
              needObj.foundedModule = neededModule;
              const event = new CustomEvent('storeLoaded', {
                detail: needObj.id,
              });
              if (needObj.id === 'Store') {
                const oldStore = window.Store;
                window.Store = needObj.foundedModule;
                Object.assign(window.Store, oldStore);
              } else {
                window.Store[needObj.id] = needObj.foundedModule;
              }
              window.dispatchEvent(event);

              var index = neededObjects.indexOf(needObj);
              if (index > -1) {
                neededObjects.splice(index, 1);
              }
            }
          });
          if (foundCount == neededObjects.length) {
            break;
          }
        }

        window.Store.sendMessage = function (e) {
          return window.Store.SendTextMsgToChat(this, ...arguments);
        };
        window.Store.sendAddMessage = function (e) {
          return window.Store.addAndSendMsgToChat(this, ...arguments);
        };
        if (window.Store.MediaCollection)
          window.Store.MediaCollection.prototype.processFiles =
            window.Store.MediaCollection.prototype.processFiles ||
            window.Store.MediaCollection.prototype.processAttachments;
        return window.Store;
      }
    }
  }
}
