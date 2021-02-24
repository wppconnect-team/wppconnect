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

export async function addParticipant(groupId, contactsId) {
  const chat = Store.Chat.get(groupId);

  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId];
  }

  contactsId = await Promise.all(contactsId.map((c) => WAPI.sendExist(c)));
  contactsId = contactsId.filter((c) => !c.erro && c.isUser).map((c) => c.id);

  if (!contactsId.length) {
    return false;
  }

  await window.Store.WapQuery.addParticipants(chat.id, contactsId);

  const participants = contactsId.map((c) =>
    chat.groupMetadata.participants.get(c)
  );

  await window.Store.Participants.addParticipants(chat, contactsId);

  return true;
}
