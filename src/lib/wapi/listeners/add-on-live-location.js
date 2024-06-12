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
  const callbacks = [];

  /**
   * Trigger the event
   */
  function fireCallback(data) {
    const location = Object.assign({}, data);
    if (location.jid) {
      location.id = location.jid.toString();
    }

    for (const callback of callbacks) {
      try {
        callback(location);
      } catch (error) {}
    }
  }

  WPP.on('chat.live_location_start', (e) => {
    fireCallback({
      type: 'enable',
      id: e.id.toString(),
      lat: e.lat,
      lng: e.lng,
      accuracy: e.accuracy,
      speed: e.speed,
      degrees: e.degrees,
      shareDuration: e.shareDuration,
    });
  });

  WPP.on('chat.live_location_update', (e) => {
    fireCallback({
      type: 'update',
      id: e.id.toString(),
      lat: e.lat,
      lng: e.lng,
      accuracy: e.accuracy,
      speed: e.speed,
      degrees: e.degrees,
      elapsed: e.elapsed,
      lastUpdated: e.lastUpdated,
    });
  });

  WPP.on('chat.live_location_end', (e) => {
    fireCallback({
      type: 'disablle',
      id: e.id.toString(),
      chat: e.chat.toString(),
    });
  });

  window.WAPI.onLiveLocation = async function (callback) {
    callbacks.push(callback);
  };
}
