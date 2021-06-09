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
  try {
    let msg = await getMessageById(msgId, null, false);
    let oc = window.Store.loader.searchModule((m) => m.OrderCollection);
    let order = await oc.default.findOrder(
      msg.orderId,
      msg.sellerJid,
      msg.token
    );
    return order.products;
  } catch (error) {
    return error;
  }
}
