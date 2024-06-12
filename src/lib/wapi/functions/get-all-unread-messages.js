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

import { getAllChatsWithNewMessages } from './get-chats-with-new-messages';

/**
 * Retrieves undread messages
 * x.ack === -1
 * TODO: Test this fn, seems incorrect, should not be async
 */
export const getAllUnreadMessages = async function () {
  const queries = getAllChatsWithNewMessages().map((c) =>
    WPP.chat.getMessages(c.id, {
      count: c.unreadCount,
    })
  );

  const chatMessages = await Promise.all(queries);

  return chatMessages.flat().map(WAPI._serializeMessageObj);
};
