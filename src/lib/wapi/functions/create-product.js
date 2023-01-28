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

/**
 * Sends product to catalog
 * @param {string} imgBase64 Base64 image data
 * @param {string} name Product name
 * @param {string} description Product description
 * @param {number} price Product price
 * @param {boolean} isHidden Boolean that indicates if product is hidden or not. Default is false
 * @param {string} url Product url
 * @param {string} retailerId Registered product ID on another system
 * @param {string} currency Currency of product
 * @param {Function} done Optional callback
 */
export function createProduct(
  imgBase64,
  name,
  description = null,
  price = null,
  isHidden = false,
  url = null,
  retailerId = null,
  currency = 'BRL',
  done
) {
  WPP.catalog
    .createProduct({
      name,
      image: imgBase64,
      description,
      price,
      isHidden,
      url,
      retailerId,
      currency,
    })
    .then((result) => {
      if (done !== undefined) done(result);
    });
}
