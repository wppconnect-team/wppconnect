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
    session: 'teste',
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage(async (message) => {
    if (message.body === 'create newsletter' && message.isGroupMsg === false) {
      const t = await client.createNewsletter('WPP Test Newsletter2', {
        description: 'test',
      });
      console.log(t);
      await client.sendText(message.from, '```' + JSON.stringify(t) + '```');
      await client.sendText(
        message.from,
        'Check the channels of connected device'
      );
    }
  });
}
