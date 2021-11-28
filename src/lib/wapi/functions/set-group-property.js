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

export async function setGroupProperty(groupId, property, value) {
  const chat = WPP.whatsapp.ChatStore.get(groupId);

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

  const properties = [
    'announcement',
    'restrict',
    'no_frequently_forwarded',
    'ephemeral',
  ];

  if (!properties.includes(property)) {
    throw {
      error: true,
      code: 'invalid_property',
      message: 'Invalid property, none of (' + properties.join(', ') + ')',
    };
  }

  if (property === 'ephemeral') {
    value = value ? 604800 : 0;
  }

  const result = await Store.sendSetGroupProperty(
    chat.id,
    property,
    value
  ).catch((e) => {
    throw {
      error: true,
      code: e.code || e.status || e.statusCode || 'unknown',
      message: e.message || e.reason || 'Unknown Error',
    };
  });

  return result;
}
