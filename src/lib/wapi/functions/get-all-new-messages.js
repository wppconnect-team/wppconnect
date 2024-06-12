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

export const getAllNewMessages = function () {
  const _newMessages =
    getAllChatsWithNewMessages()
      .map((c) => WAPI.getChat(c.id))
      .flatMap((c) => c.msgs.filter((x) => x.isNewMsg))
      .map(WAPI._serializeMessageObj) || [];

  return _newMessages;
};
