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

import { Page } from 'puppeteer';
import { ControlsLayer } from './controls.layer';
import { CreateConfig } from '../../config/create-config';

export class BusinessLayer extends ControlsLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Querys product catalog
   * @param id Buisness profile id ('00000@c.us')
   */
  public async getBusinessProfilesProducts(id: string) {
    return this.page.evaluate(
      ({ id }) => {
        WAPI.getBusinessProfilesProducts(id);
      },
      { id }
    );
  }

  /**
   * Querys order catalog
   * @param messageId string
   * @returns Message object
   */
  public async getOrderbyMsg(messageId: string) {
    return this.page.evaluate(
      ({ messageId }) => {
        WAPI.getOrderbyMsg(messageId);
      },
      { messageId }
    );
  }

  /**
   * Sends product with product image to given chat id
   * @param to Chat id
   * @param base64 Base64 image data
   * @param caption Message body
   * @param businessId Business id number that owns the product ('0000@c.us')
   * @param productId Product id, see method getBusinessProfilesProducts for more info
   */
  public async sendImageWithProduct(
    to: string,
    base64: string,
    caption: string,
    businessId: string,
    productId: string
  ) {
    return this.page.evaluate(
      ({ to, base64, businessId, caption, productId }) => {
        WAPI.sendImageWithProduct(base64, to, caption, businessId, productId);
      },
      { to, base64, businessId, caption, productId }
    );
  }
}
