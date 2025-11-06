import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { CommunityLayer } from './community.layer';
export declare class CatalogLayer extends CommunityLayer {
    page: Page;
    constructor(page: Page, session?: string, options?: CreateConfig);
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
    createProduct(name: string, image: string, description: string, price: number, isHidden: boolean, url: string, retailerId: string, currency: string): Promise<import("@wppconnect/wa-js/dist/whatsapp").ProductModel>;
    /**
     * Querys all products
     * @param id Buisness profile id ('00000@c.us')
     * @param qnt limit to load products - Default: 10
     */
    getProducts(id: string, qnt: number): Promise<any[]>;
    /**
     * Create a new product on catalog
     * @param id Buisness profile id ('00000@c.us')
     * @param productId ID of Product
     */
    getProductById(id: string, productId: string): Promise<{
        id: string;
        retailer_id: string;
        name: string;
        description: string;
        url: string;
        currency: string;
        price: string;
        is_hidden: boolean;
        max_available: number;
        availability: string;
        checkmark: boolean;
        image_hashes_for_whatsapp: string[];
        image_cdn_urls: {
            key: "requested" | "full";
            value: string;
        }[];
        additional_image_cdn_urls: any[];
        whatsapp_product_can_appeal: boolean;
        capability_to_review_status: {
            key: "WHATSAPP";
            value: "APPROVED";
        }[];
    }>;
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
    editProduct(productId: string, options: string): Promise<import("@wppconnect/wa-js/dist/whatsapp").ProductModel>;
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
    delProducts(productsId: string[]): Promise<any>;
    /**
     * Add image on product This function change main image of product, for change additional images use client.addImage
     * @param productId Product ID
     * @param image Image in base64
     * @example
     * ```javascript
     * client.changeProductImage('56989897878', 'base64/string');
     * ```
     */
    changeProductImage(productId: string, image: string): Promise<any>;
    /**
     * Add image on product This function include additional images on product for change main image use client.changeProductImage
     * @param productId Product ID
     * @param image Image in base64
     * @example
     * ```javascript
     * client.addProductImage('56989897878', 'base64/string');
     * ```
     */
    addProductImage(productId: string, image: string): Promise<any>;
    /**
     * Remove image on product This function remove additional images of product for change main image use client.changeProductImage
     * @param productId Product ID
     * @param index Index array of additional imagens
     * @example
     * ```javascript
     * client.removeProductImage('56989897878', '1');
     * ```
     */
    removeProductImage(productId: string, index: string): Promise<import("@wppconnect/wa-js/dist/whatsapp").ProductModel>;
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
    getCollections(id: string, qnt: string, maxProducts: string): Promise<import("@wppconnect/wa-js/dist/whatsapp").ProductCollModel[]>;
    /**
     * Create new collection
     * @param collectionName Product ID
     * @param productsId Index array of additional imagens
     * @example
     * ```javascript
     * client.createCollection('Name of collection', ['655632565','5689859898']);
     * ```
     */
    createCollection(collectionName: string, productsId: string): Promise<any>;
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
    editCollection(collectionId: string, options: string): Promise<any>;
    /**
     * Delete a collection
     * @param collectionId Collection id
     * @param options Options arguments
     * @example
     * ```javascript
     * client.deleteCollection('65666565898');
     * ```
     */
    deleteCollection(collectionId: string): Promise<any>;
    /**
     * Set product visibility
     * @param productId Product id
     * @param value True for visibility, false for non visible
     * @example
     * ```javascript
     * client.setProductVisibility('65666565898', false);
     * ```
     */
    setProductVisibility(productId: string, value: boolean): Promise<any>;
    /**
     * Update options to customer cart your products
     * @param value True for enabled, false for non enabled
     * @example
     * ```javascript
     * client.updateCartEnabled(false);
     * ```
     */
    updateCartEnabled(value: boolean): Promise<any>;
}
