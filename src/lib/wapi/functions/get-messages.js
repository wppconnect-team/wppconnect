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

const messageDefaults = {
  isSentCagPollCreation: false,
  isEventCanceled: false,
  isForwarded: false,
  isQuestion: false,
  isSpoiler: false,
  nonJidMentions: null,
};

export async function getMessages(chatId, params = {}, serialize = true) {
  const msgs = await WPP.chat.getMessages(chatId, params);

  if (!Array.isArray(msgs)) {
    const error = new Error(`Failed to fetch messages for ${chatId}`);

    Object.assign(error, msgs);

    throw error;
  }

  // WPP.chat.getMessages already returns models; wrapping them again leaks a copy per message
  const result = msgs.map((m) => {
    const message = { ...WAPI.processMessageObj(m, true, true) };
    // Preserve the DTO defaults previously materialized by the copy constructor.
    for (const [key, value] of Object.entries(messageDefaults)) {
      if (message[key] === undefined) message[key] = value;
    }
    return message;
  });

  return result;
}
