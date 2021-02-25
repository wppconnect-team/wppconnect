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

export function getStore2(modules) {
  let foundCount = 0;
  let neededObjects = storeObjects;
  window.Store = window.Store || {};

  Object.keys(modules.m).forEach(function (id) {
    var module = modules(id);
    if (!module) {
      return;
    }

    neededObjects.forEach((needObj) => {
      if (!needObj.conditions || needObj.foundedModule) return;
      let neededModule = null;
      try {
        neededModule = needObj.conditions(module);
      } catch (error) {
        console.log(error);
      }
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
  });

  if (foundCount == neededObjects.length) {
    return window.Store;
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
