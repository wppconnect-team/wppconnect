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

export function deleteConversation(chatId, done) {
  let userId = new window.Store.UserConstructor(chatId, {
    intentionallyUsePrivateConstructor: true,
  });
  let conversation = WAPI.getChat(userId);

  if (!conversation) {
    if (done !== undefined) {
      done(false);
    }
    return false;
  }

  window.Store.sendDelete(conversation, false)
    .then(() => {
      if (done !== undefined) {
        done(true);
      }
    })
    .catch(() => {
      if (done !== undefined) {
        done(false);
      }
    });

  return true;
}
