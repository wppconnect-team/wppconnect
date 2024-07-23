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

import { getMessageById } from '../functions/get-message-by-id';

export async function getOrderbyMsg(msgId) {
  let msg = await getMessageById(msgId, null, false);
  if (!msg) {
    throw {
      error: true,
      code: 'message_not_found',
      message: 'Message not found',
    };
  }
  if (msg.type !== 'order') {
    throw {
      error: true,
      code: 'message_is_not_an_order',
      message: 'Message is not an order',
    };
  }
  let order = WPP.order.get(msgId);
  if (!order) {
    order = await WPP.whatsapp.OrderStore.findOrder(
      msg.orderId,
      msg.sellerJid,
      msg.token
    );
  }

  if (!order) {
    throw {
      error: true,
      code: 'order_not_found',
      message: 'Order not found',
    };
  }

  return order.products;
}
