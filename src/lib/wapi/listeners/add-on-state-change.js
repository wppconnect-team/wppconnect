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

export function addOnStateChange() {
  let initialized = false;
  let getData = () => {
    return WPP.whatsapp.Socket.state;
  };

  window.WAPI.onStateChange = function (callback) {
    WPP.whatsapp.Socket.on('change:state', () => callback(getData()));
    if (!initialized) {
      initialized = true;
      callback(getData());
    }
    return true;
  };
}

/**
 * @deprecated in favor of {@link addOnStreamModeChanged}
 */
export function addOnStreamChange() {
  let initialized = false;
  let getData = () => {
    return WPP.whatsapp.Socket.stream;
  };
  window.WAPI.onStreamChange = function (callback) {
    WPP.whatsapp.Socket.on('change:stream', () => callback(getData()));
    if (!initialized) {
      initialized = true;
      callback(getData());
    }
    return true;
  };
}

export function addOnStreamModeChanged() {
  window.WAPI.onStreamModeChanged = function (callback) {
    WPP.on('conn.stream_mode_changed', (mode) => {
      callback(mode);
    });
    return true;
  };
}

export function addOnStreamInfoChanged() {
  window.WAPI.onStreamInfoChanged = function (callback) {
    WPP.on('conn.stream_info_changed', (info) => {
      callback(info);
    });
    return true;
  };
}
