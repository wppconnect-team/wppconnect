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

export async function getGroupInfoFromInviteLink(inviteCode) {
  inviteCode = inviteCode.replace('chat.whatsapp.com/', '');
  inviteCode = inviteCode.replace('invite/', '');
  inviteCode = inviteCode.replace('https://', '');
  inviteCode = inviteCode.replace('http://', '');

  return await Store.sendQueryGroupInvite(inviteCode);
}
