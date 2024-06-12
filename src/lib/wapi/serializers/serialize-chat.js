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

import { _serializeRawObj } from './serialize-raw';

/**
 * Serializes a chat object
 *
 * @param rawChat Chat object
 * @returns {Chat}
 */
export const _serializeChatObj = (obj) => {
  if (obj == undefined) {
    return null;
  }
  return Object.assign(window.WAPI._serializeRawObj(obj), {
    kind: obj.kind,
    isBroadcast: obj.isBroadcast,
    isGroup: obj.isGroup,
    isUser: obj.isUser,
    contact: obj['contact']
      ? window.WAPI._serializeContactObj(obj['contact'])
      : null,
    groupMetadata: obj['groupMetadata']
      ? window.WAPI._serializeRawObj(obj['groupMetadata'])
      : null,
    presence: obj['presence']
      ? window.WAPI._serializeRawObj(obj['presence'])
      : null,
    msgs: null,
  });
};
