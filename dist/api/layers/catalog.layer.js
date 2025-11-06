"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogLayer = void 0;
var helpers_1 = require("../helpers");
var community_layer_1 = require("./community.layer");
var CatalogLayer = /** @class */ (function (_super) {
    __extends(CatalogLayer, _super);
    function CatalogLayer(page, session, options) {
        var _this = _super.call(this, page, session, options) || this;
        _this.page = page;
        return _this;
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
    CatalogLayer.prototype.createProduct = function (name, image, description, price, isHidden, url, retailerId, currency) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var name = _a.name, image = _a.image, description = _a.description, price = _a.price, isHidden = _a.isHidden, url = _a.url, retailerId = _a.retailerId, currency = _a.currency;
                        return WPP.catalog.createProduct({
                            name: name,
                            image: image,
                            description: description,
                            price: price,
                            isHidden: isHidden,
                            url: url,
                            retailerId: retailerId,
                            currency: currency,
                        });
                    }, { name: name, image: image, description: description, price: price, isHidden: isHidden, url: url, retailerId: retailerId, currency: currency })];
            });
        });
    };
    /**
     * Querys all products
     * @param id Buisness profile id ('00000@c.us')
     * @param qnt limit to load products - Default: 10
     */
    CatalogLayer.prototype.getProducts = function (id, qnt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var id = _a.id, qnt = _a.qnt;
                        return WPP.catalog.getProducts(id, qnt);
                    }, { id: id, qnt: qnt })];
            });
        });
    };
    /**
     * Create a new product on catalog
     * @param id Buisness profile id ('00000@c.us')
     * @param productId ID of Product
     */
    CatalogLayer.prototype.getProductById = function (id, productId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var id = _a.id, productId = _a.productId;
                        return WPP.catalog.getProductById(id, productId);
                    }, { id: id, productId: productId })];
            });
        });
    };
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
    CatalogLayer.prototype.editProduct = function (productId, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var productId = _a.productId, options = _a.options;
                        return WPP.catalog.editProduct(productId, options);
                    }, { productId: productId, options: options })];
            });
        });
    };
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
    CatalogLayer.prototype.delProducts = function (productsId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var productsId = _a.productsId;
                        return WPP.catalog.delProducts(productsId);
                    }, { productsId: productsId })];
            });
        });
    };
    /**
     * Add image on product This function change main image of product, for change additional images use client.addImage
     * @param productId Product ID
     * @param image Image in base64
     * @example
     * ```javascript
     * client.changeProductImage('56989897878', 'base64/string');
     * ```
     */
    CatalogLayer.prototype.changeProductImage = function (productId, image) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var productId = _a.productId, image = _a.image;
                        return WPP.catalog.changeProductImage(productId, image);
                    }, { productId: productId, image: image })];
            });
        });
    };
    /**
     * Add image on product This function include additional images on product for change main image use client.changeProductImage
     * @param productId Product ID
     * @param image Image in base64
     * @example
     * ```javascript
     * client.addProductImage('56989897878', 'base64/string');
     * ```
     */
    CatalogLayer.prototype.addProductImage = function (productId, image) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var productId = _a.productId, image = _a.image;
                        return WPP.catalog.addProductImage(productId, image);
                    }, { productId: productId, image: image })];
            });
        });
    };
    /**
     * Remove image on product This function remove additional images of product for change main image use client.changeProductImage
     * @param productId Product ID
     * @param index Index array of additional imagens
     * @example
     * ```javascript
     * client.removeProductImage('56989897878', '1');
     * ```
     */
    CatalogLayer.prototype.removeProductImage = function (productId, index) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var productId = _a.productId, index = _a.index;
                        return WPP.catalog.removeProductImage(productId, index);
                    }, { productId: productId, index: index })];
            });
        });
    };
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
    CatalogLayer.prototype.getCollections = function (id, qnt, maxProducts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var id = _a.id, qnt = _a.qnt, maxProducts = _a.maxProducts;
                        return WPP.catalog.getCollections(id, qnt, maxProducts);
                    }, { id: id, qnt: qnt, maxProducts: maxProducts })];
            });
        });
    };
    /**
     * Create new collection
     * @param collectionName Product ID
     * @param productsId Index array of additional imagens
     * @example
     * ```javascript
     * client.createCollection('Name of collection', ['655632565','5689859898']);
     * ```
     */
    CatalogLayer.prototype.createCollection = function (collectionName, productsId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var collectionName = _a.collectionName, productsId = _a.productsId;
                        return WPP.catalog.createCollection(collectionName, productsId);
                    }, { collectionName: collectionName, productsId: productsId })];
            });
        });
    };
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
    CatalogLayer.prototype.editCollection = function (collectionId, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var collectionId = _a.collectionId, options = _a.options;
                        return WPP.catalog.editCollection(collectionId, options);
                    }, { collectionId: collectionId, options: options })];
            });
        });
    };
    /**
     * Delete a collection
     * @param collectionId Collection id
     * @param options Options arguments
     * @example
     * ```javascript
     * client.deleteCollection('65666565898');
     * ```
     */
    CatalogLayer.prototype.deleteCollection = function (collectionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var collectionId = _a.collectionId;
                        return WPP.catalog.deleteCollection(collectionId);
                    }, { collectionId: collectionId })];
            });
        });
    };
    /**
     * Set product visibility
     * @param productId Product id
     * @param value True for visibility, false for non visible
     * @example
     * ```javascript
     * client.setProductVisibility('65666565898', false);
     * ```
     */
    CatalogLayer.prototype.setProductVisibility = function (productId, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var productId = _a.productId, value = _a.value;
                        return WPP.catalog.setProductVisibility(productId, value);
                    }, { productId: productId, value: value })];
            });
        });
    };
    /**
     * Update options to customer cart your products
     * @param value True for enabled, false for non enabled
     * @example
     * ```javascript
     * client.updateCartEnabled(false);
     * ```
     */
    CatalogLayer.prototype.updateCartEnabled = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var value = _a.value;
                        return WPP.catalog.updateCartEnabled(value);
                    }, { value: value })];
            });
        });
    };
    return CatalogLayer;
}(community_layer_1.CommunityLayer));
exports.CatalogLayer = CatalogLayer;
