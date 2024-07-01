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

const froms = [];
wppconnect
  .create()
  .then((client) => start(client))
  .catch((error) => {
    console.log(error);
  });

function start(client) {
  client.onMessage(async (message) => {
    if (message.body === 'new order' && message.isGroupMsg === false) {
      const order = await client.sendOrderMessage(message.from, [
        { type: 'custom', name: 'Item with cost test', price: 120000, qnt: 2 },
      ]);
      froms.push(message.from);
      client.sendText(
        message.from,
        `Please save your order ID, and get your order for testing purposes`
      );
      client.sendText(message.from, `${order.id}`);
    }
    if (message?.body?.includes('order id=') && message?.isGroupMsg === false) {
      const id = message?.body.split('=')[1];
      const order = await client.getOrder(id);
      client.sendText(message.from, '```' + JSON.stringify(order) + '```');
    }
  });
  client.onOrderStatusUpdate((data) => {
    froms.forEach((from) => {
      client.sendText(from, '```' + JSON.stringify(data) + '```');
    });
  });
}
