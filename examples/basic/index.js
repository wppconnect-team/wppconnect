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
import { create } from '../../dist/index.js';

create({
  headless: false,
  autoClose: 0, // turn off auto close
  onStreamModeChanged: (mode) => {
    console.log('Stream mode changed:', mode);
  },
  onStreamInfoChanged: (info) => {
    console.log('Stream info changed:', info);
  },
})
  .then((client) => start(client))
  .catch((error) => {
    console.log(error);
  });

function start(client) {
  client.onBackendEvent((eventName, ...args) => {
    console.log('Backend event:', eventName, args);
  });

  client.onMessage((message) => {
    if (message.body === 'hi' && message.isGroupMsg === false) {
      client
        .createGroup('teste vai', ['5521967865110'])
        .then((a) => console.log(a))
        .catch((e) => console.log(e));
      client
        .sendText(message.from, 'Welcome to Wppconnect')
        .then((result) => {})
        .catch((error) => {
          console.error('Error when sending: ', error); //return error object
        });
    }
  });
}
