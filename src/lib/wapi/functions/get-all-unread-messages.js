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

const USER_JID_SUFFIXES = ['@c.us', '@s.whatsapp.net', '@lid'];
const GROUP_JID_SUFFIX = '@g.us';

const extractChatId = (chat) => {
  if (!chat || !chat.id) {
    return '';
  }

  if (typeof chat.id === 'string') {
    return chat.id;
  }

  return chat.id._serialized || '';
};

const isUserChat = (chat, chatId) => {
  if (chat && chat.isUser === true) {
    return true;
  }

  return USER_JID_SUFFIXES.some((suffix) => chatId.endsWith(suffix));
};

const isGroupChat = (chat, chatId) => {
  if (chat && chat.isGroup === true) {
    return true;
  }

  return chatId.endsWith(GROUP_JID_SUFFIX);
};

/**
 * Retrieves unread messages (x.ack === -1) with optional filtering.
 *
 * @example
 * // Fetch up to 20 unread user messages
 * WAPI.getAllUnreadMessages({ onlyUsers: true, limit: 20 });
 *
 * @example
 * // Fetch unread group messages without limiting the amount
 * WAPI.getAllUnreadMessages({ onlyGroups: true });
 */
export const getAllUnreadMessages = async function (options = {}) {
  const { onlyUsers, onlyGroups, limit } = options;

  if (onlyUsers && onlyGroups) {
    throw new Error(
      'getAllUnreadMessages: onlyUsers and onlyGroups cannot both be true.'
    );
  }

  const chatsWithUnread = getAllChatsWithNewMessages();

  const filteredChats = chatsWithUnread.filter((chat) => {
    const chatId = extractChatId(chat);

    if (onlyUsers) {
      return isUserChat(chat, chatId);
    }

    if (onlyGroups) {
      return isGroupChat(chat, chatId);
    }

    return true;
  });

  const normalizedLimit =
    typeof limit === 'number' && Number.isFinite(limit)
      ? Math.max(0, Math.floor(limit))
      : undefined;

  if (normalizedLimit === undefined) {
    const queries = filteredChats.map((chat) =>
      WPP.chat.getMessages(chat.id, {
        count: chat.unreadCount,
      })
    );

    if (queries.length === 0) {
      return [];
    }

    const chatMessages = await Promise.all(queries);

    return chatMessages.flat().map(WAPI._serializeMessageObj);
  }

  if (normalizedLimit === 0) {
    return [];
  }

  const serializedMessages = [];

  for (const chat of filteredChats) {
    if (serializedMessages.length >= normalizedLimit) {
      break;
    }

    const remaining = normalizedLimit - serializedMessages.length;
    const unreadCount = chat.unreadCount || 0;
    const fetchCount = remaining < unreadCount ? remaining : unreadCount;

    if (fetchCount <= 0) {
      continue;
    }

    const chatMessages = await WPP.chat.getMessages(chat.id, {
      count: fetchCount,
    });

    for (const message of chatMessages) {
      serializedMessages.push(WAPI._serializeMessageObj(message));

      if (serializedMessages.length >= normalizedLimit) {
        break;
      }
    }
  }

  return serializedMessages;
};
