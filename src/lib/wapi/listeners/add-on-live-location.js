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

export function addOnLiveLocation() {
  window.WAPI.onLiveLocation = async function (chatId, callback) {
    return await window.WAPI.waitForStore(['LiveLocation'], () => {
      var lLChat = Store.LiveLocation.get(chatId);
      if (lLChat) {
        var validLocs = lLChat.participants.validLocations();
        validLocs.map((x) =>
          x.on('change:lastUpdated', (x, y, z) => {
            console.log(x, y, z);
            const { id, lat, lng, accuracy, degrees, speed, lastUpdated } = x;
            const l = {
              id: id.toString(),
              lat,
              lng,
              accuracy,
              degrees,
              speed,
              lastUpdated,
            };
            // console.log('newloc',l)
            callback(l);
          })
        );
        return true;
      } else {
        return false;
      }
    });
  };
}
