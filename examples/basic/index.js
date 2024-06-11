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
const wppconnect = require('../../dist');

wppconnect
  .create({
    whatsappVersion: '2.3000.1012058694-alpha',
    headless: false,
    autoClose: false,
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage(async (message) => {
    console.log(message);
    if (message.body === 'Hi') {
      client
        .sendText(message.from, 'Welcome Wppconnect')
        .then((result) => {})
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
  });
  client.onAnyMessage((message) => {
    console.log('any');
    console.log(message);
  });
}
