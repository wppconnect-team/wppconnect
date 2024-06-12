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
import { CreateConfig } from '../../config/create-config';
import { evaluateAndReturn } from '../helpers';
import { HostLayer } from './host.layer';
import { CommunityLayer } from './community.layer';

export class CatalogLayer extends CommunityLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Create a product on catalog
   * @param name Product name
   * @param image Product image
   * @param description Product description
   * @param price Product price
   * @param isHidden Product visibility
   * @param url Product url
   * @param retailerId Product own ID system
   * @param currency Product currency
   * @example
   * ```javascript
   * client.createtProduct(
   *    'Product name',
   *    'image in base64',
   *    'product description',
   *    '89.90',
   *    true,
   *    'https://wppconnect.io',
   *    'AKA001',
   *   );
   * ```
   */
  public async createProduct(
    name: string,
    image: string,
    description: string,
    price: number,
    isHidden: boolean,
    url: string,
    retailerId: string,
    currency: string
  ) {
    return evaluateAndReturn(
      this.page,
      ({
        name,
        image,
        description,
        price,
        isHidden,
        url,
        retailerId,
        currency,
      }) =>
        WPP.catalog.createProduct({
          name,
          image,
          description,
          price,
          isHidden,
          url,
          retailerId,
          currency,
        }),
      { name, image, description, price, isHidden, url, retailerId, currency }
    );
  }
  /**
   * Querys all products
   * @param id Buisness profile id ('00000@c.us')
   * @param qnt limit to load products - Default: 10
   */
  public async getProducts(id: string, qnt: number) {
    return evaluateAndReturn(
      this.page,
      ({ id, qnt }) => WPP.catalog.getProducts(id, qnt),
      { id, qnt }
    );
  }

  /**
   * Create a new product on catalog
   * @param id Buisness profile id ('00000@c.us')
   * @param productId ID of Product
   */
  public async getProductById(id: string, productId: string) {
    return evaluateAndReturn(
      this.page,
      ({ id, productId }) => WPP.catalog.getProductById(id, productId),
      { id, productId }
    );
  }

  /**
   * Edit product on catalog
   * @param productId Product ID
   * @param options Object with options
   * @example
   * ```javascript
   * client.editProduct('56989897878' {
   *    name: 'Product name',
   *     description: 'product description',
   *     price: '89.90',
   *     isHidden: true,
   *     url: 'https://wppconnect.io',
   *     retailerId: 'AKA001',
   *   });
   * ```
   */
  public async editProduct(productId: string, options: string) {
    return evaluateAndReturn(
      this.page,
      ({ productId, options }) => WPP.catalog.editProduct(productId, options),
      { productId, options }
    );
  }
  /**
   * Delete product(s) on catalog
   * @param productsId Products ID
   * @example
   * ```javascript
   * //Delete one product
   * client.delProducts(['56989897878']);
   *
   * // Delete various products
   * client.delProducts(['56989897878','565657878']);
   * ```
   */
  public async delProducts(productsId: string[]) {
    return evaluateAndReturn(
      this.page,
      ({ productsId }) => WPP.catalog.delProducts(productsId),
      { productsId }
    );
  }

  /**
   * Add image on product This function change main image of product, for change additional images use client.addImage
   * @param productId Product ID
   * @param image Image in base64
   * @example
   * ```javascript
   * client.changeProductImage('56989897878', 'base64/string');
   * ```
   */
  public async changeProductImage(productId: string, image: string) {
    return evaluateAndReturn(
      this.page,
      ({ productId, image }) =>
        WPP.catalog.changeProductImage(productId, image),
      { productId, image }
    );
  }

  /**
   * Add image on product This function include additional images on product for change main image use client.changeProductImage
   * @param productId Product ID
   * @param image Image in base64
   * @example
   * ```javascript
   * client.addProductImage('56989897878', 'base64/string');
   * ```
   */
  public async addProductImage(productId: string, image: string) {
    return evaluateAndReturn(
      this.page,
      ({ productId, image }) => WPP.catalog.addProductImage(productId, image),
      { productId, image }
    );
  }

  /**
   * Remove image on product This function remove additional images of product for change main image use client.changeProductImage
   * @param productId Product ID
   * @param index Index array of additional imagens
   * @example
   * ```javascript
   * client.removeProductImage('56989897878', '1');
   * ```
   */
  public async removeProductImage(productId: string, index: string) {
    return evaluateAndReturn(
      this.page,
      ({ productId, index }) =>
        WPP.catalog.removeProductImage(productId, index),
      { productId, index }
    );
  }

  /**
   * Query all collections
   * @param id Product ID
   * @param qnt Max qnt collections - Default 10
   * @param maxProducts Max products in array products of collection - Default 10
   * @example
   * ```javascript
   * client.getCollections('5521988556558@c.us', '10','20');
   * ```
   */
  public async getCollections(id: string, qnt: string, maxProducts: string) {
    return evaluateAndReturn(
      this.page,
      ({ id, qnt, maxProducts }) =>
        WPP.catalog.getCollections(id, qnt, maxProducts),
      { id, qnt, maxProducts }
    );
  }

  /**
   * Create new collection
   * @param collectionName Product ID
   * @param productsId Index array of additional imagens
   * @example
   * ```javascript
   * client.createCollection('Name of collection', ['655632565','5689859898']);
   * ```
   */
  public async createCollection(collectionName: string, productsId: string) {
    return evaluateAndReturn(
      this.page,
      ({ collectionName, productsId }) =>
        WPP.catalog.createCollection(collectionName, productsId),
      { collectionName, productsId }
    );
  }

  /**
   * Edit a collection
   * @param collectionId Collection id
   * @param options Options arguments
   * @example
   * ```javascript
   * client.editCollection('656565898', {
   * collectionName: 'New Name for collection',
   * productsToAdd: ['5656523223'],
   * productsToRemove: ['5656523232']
   * });
   * ```
   */
  public async editCollection(collectionId: string, options: string) {
    return evaluateAndReturn(
      this.page,
      ({ collectionId, options }) =>
        WPP.catalog.editCollection(collectionId, options),
      { collectionId, options }
    );
  }

  /**
   * Delete a collection
   * @param collectionId Collection id
   * @param options Options arguments
   * @example
   * ```javascript
   * client.deleteCollection('65666565898');
   * ```
   */
  public async deleteCollection(collectionId: string) {
    return evaluateAndReturn(
      this.page,
      ({ collectionId }) => WPP.catalog.deleteCollection(collectionId),
      { collectionId }
    );
  }

  /**
   * Set product visibility
   * @param productId Product id
   * @param value True for visibility, false for non visible
   * @example
   * ```javascript
   * client.setProductVisibility('65666565898', false);
   * ```
   */
  public async setProductVisibility(productId: string, value: boolean) {
    return evaluateAndReturn(
      this.page,
      ({ productId, value }) =>
        WPP.catalog.setProductVisibility(productId, value),
      { productId, value }
    );
  }

  /**
   * Update options to customer cart your products
   * @param value True for enabled, false for non enabled
   * @example
   * ```javascript
   * client.updateCartEnabled(false);
   * ```
   */
  public async updateCartEnabled(value: boolean) {
    return evaluateAndReturn(
      this.page,
      ({ value }) => WPP.catalog.updateCartEnabled(value),
      { value }
    );
  }
}
