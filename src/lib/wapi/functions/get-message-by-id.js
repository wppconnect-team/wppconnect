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

export async function getMessageById(id, done, serialize = true) {
  //Parse message ID

  if (typeof id === 'object' && id._serialized) {
    id = id._serialized;
  }

  if (typeof id !== 'string') {
    return false;
  }

  const key = window.Store.MsgKey.fromString(id);

  if (!key) {
    return false;
  }

  // Check message is loaded in store
  let msg = window.Store.Msg.get(key);

  if (!msg) {
    // Get chat of message
    const chat = window.Store.Chat.get(key.remote);
    if (!chat) {
      return false;
    }

    //If not message not found, load latest messages of chat
    await chat.loadEarlierMsgs();
    msg = window.Store.Msg.get(key);

    if (!msg) {
      // If not found, load messages around the message ID
      const context = chat.getSearchContext(key);
      if (
        context &&
        context.collection &&
        context.collection.loadAroundPromise
      ) {
        await context.collection.loadAroundPromise;
      }
      msg = window.Store.Msg.get(key);
    }
  }

  if (!msg) {
    return false;
  }

  let result = false;

  if (serialize) {
    try {
      result = WAPI.processMessageObj(msg, true, true);
    } catch (err) {}
  } else {
    result = msg;
  }

  if (typeof done === 'function') {
    done(result);
  } else {
    return result;
  }
}
