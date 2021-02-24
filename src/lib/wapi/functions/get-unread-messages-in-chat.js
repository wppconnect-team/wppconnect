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

export function getUnreadMessagesInChat(
  id,
  includeMe,
  includeNotifications,
  done
) {
  // get chat and its messages
  let chat = WAPI.getChat(id);
  let messages = chat.msgs._models;

  // initialize result list
  let output = [];

  // look for unread messages, newest is at the end of array
  for (let i = messages.length - 1; i >= 0; i--) {
    // system message: skip it
    if (i === 'remove') {
      continue;
    }

    // get message
    let messageObj = messages[i];

    // found a read message: stop looking for others
    if (
      typeof messageObj.isNewMsg !== 'boolean' ||
      messageObj.isNewMsg === false
    ) {
      continue;
    } else {
      messageObj.isNewMsg = false;
      // process it
      let message = WAPI.processMessageObj(
        messageObj,
        includeMe,
        includeNotifications
      );

      // save processed message on result list
      if (message) output.push(message);
    }
  }
  // callback was passed: run it
  if (done !== undefined) done(output);
  // return result list
  return output;
}
