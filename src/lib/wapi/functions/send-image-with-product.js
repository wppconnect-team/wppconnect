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

import { processFiles } from './process-files';
import { base64ToFile } from '../helper';

/**
 * Sends product with product image to given chat id
 * @param {string} imgBase64 Base64 image data
 * @param {string} chatid Chat id
 * @param {string} caption Caption
 * @param {string} bizNumber string the @c.us number of the business account from which you want to grab the product
 * @param {string} productId string the id of the product within the main catalog of the aforementioned business
 * @param {Function} done Optional callback
 */
export function sendImageWithProduct(
  imgBase64,
  chatid,
  caption,
  bizNumber,
  productId,
  done
) {
  WPP.whatsapp.CatalogStore.findCarouselCatalog(bizNumber).then((cat) => {
    if (cat && cat[0]) {
      const product = cat[0].productCollection.get(productId);
      const temp = {
        productMsgOptions: {
          businessOwnerJid: product.catalogWid.toString({
            legacy: !0,
          }),
          productId: product.id.toString(),
          url: product.url,
          productImageCount: product.productImageCollection.length,
          title: product.name,
          description: product.description,
          currencyCode: product.currency,
          priceAmount1000: product.priceAmount1000,
          type: 'product',
        },
        caption,
      };

      var idUser = new WPP.whatsapp.WidFactory.createWid(chatid);

      return WPP.chat.find(idUser).then((chat) => {
        var mediaBlob = base64ToFile(imgBase64, product.name);
        // var mc = new Store.MediaCollection(chat);
        // mc.processFiles([mediaBlob], chat, 1)
        processFiles(chat, mediaBlob).then((mc) => {
          var media = mc.getModelsArray()[0];
          Object.entries(temp.productMsgOptions).map(
            ([k, v]) => (media.mediaPrep._mediaData[k] = v)
          );
          media.mediaPrep.sendToChat(chat, temp);
          if (done !== undefined) done(true);
        });
      });
    }
  });
}
