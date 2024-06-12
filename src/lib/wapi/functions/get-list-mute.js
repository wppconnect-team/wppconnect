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

export async function getListMute(type = 'all') {
  var muteList = (await window.Store.Mute)._models,
    noMute = new Array(),
    toMute = new Array();
  for (var i in muteList)
    muteList[i].__x_isMuted
      ? toMute.push(WAPI.interfaceMute(muteList[i]))
      : noMute.push(WAPI.interfaceMute(muteList[i]));
  var r = null;
  console.log(0, type);
  switch (type) {
    case 'all':
      r = [
        {
          total: toMute.length + noMute.length,
          amountToMute: toMute.length,
          amountnoMute: noMute.length,
        },
        toMute,
        noMute,
      ];
      break;
    case 'toMute':
      r = [{ total: toMute.length }, toMute];
      break;
    case 'noMute':
      r = [{ total: noMute.length }, noMute];
      break;
  }
  return r;
}
export function interfaceMute(arr) {
  let { attributes, expiration, id, isMuted, isState, promises, stale } = arr;
  return { attributes, expiration, id, isMuted, isState, promises, stale };
}
