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

let timer = null;
let pong = true;

async function sendPing() {
  return window.WAPI.waitForStore(['State', 'Stream'], () => {
    // Check only if the interface is in CHAT and not disconnected
    if (
      window.Store.Stream.mode !== 'MAIN' ||
      window.Store.State.default.state === 'TIMEOUT'
    ) {
      return;
    }

    // Start phoneWatchdog if ping fails
    if (!pong) {
      window.Store.State.default.phoneWatchdog.activate();
      window.Store.State.default.phoneWatchdog.poke(250);
      return;
    }

    // Reset ping state
    pong = false;

    // Send a ping request
    return window.Store.State.default
      .sendBasic({
        tag: window.Store.State.default.tag('ping'),
        data: ['admin', 'test'],
      })
      .then(() => {
        pong = true;
      });
  });
}

export function startPhoneWatchdog(interval = 15000) {
  stopPhoneWatchdog();

  timer = setInterval(sendPing, interval);
}

export function stopPhoneWatchdog() {
  if (timer) {
    clearInterval(timer);
  }
  timer = null;
}
