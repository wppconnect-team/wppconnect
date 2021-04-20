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

export async function setGroupSubject(groupId, title) {
  const chat = Store.Chat.get(groupId);

  if (!chat) {
    throw {
      error: true,
      code: 'group_not_found',
      message: 'Group not found',
    };
  }
  if (!chat.isGroup) {
    throw {
      error: true,
      code: 'not_a_group',
      message: 'Chat is not a group',
    };
  }

  if (chat.name == title) {
    throw {
      error: true,
      code: 'redundant_change',
      message: 'You can not change group subject to same name',
    };
  }

  const result = await Store.sendSetGroupSubject(chat.id, title).catch((e) => {
    throw {
      error: true,
      code: e.code || e.status || e.statusCode || 'unknown',
      message: e.message || e.reason || 'Unknown Error',
    };
  });

  chat.name = title;

  return result;
}
