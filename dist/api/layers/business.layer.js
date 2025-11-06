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
exports.BusinessLayer = void 0;
var controls_layer_1 = require("./controls.layer");
var helpers_1 = require("../helpers");
var BusinessLayer = /** @class */ (function (_super) {
    __extends(BusinessLayer, _super);
    function BusinessLayer(page, session, options) {
        var _this = _super.call(this, page, session, options) || this;
        _this.page = page;
        return _this;
    }
    /**
     * Querys product catalog
     * @param id Buisness profile id ('00000@c.us')
     */
    BusinessLayer.prototype.getBusinessProfilesProducts = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var id = _a.id;
                        return WAPI.getBusinessProfilesProducts(id);
                    }, { id: id })];
            });
        });
    };
    /**
     * Get Business Profile
     * @param id Buisness profile id ('00000@c.us')
     */
    BusinessLayer.prototype.getBusinessProfile = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                        var _c, _d, _e, _f;
                        var id = _b.id;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _d = (_c = JSON).parse;
                                    _f = (_e = JSON).stringify;
                                    return [4 /*yield*/, WPP.contact.getBusinessProfile(id)];
                                case 1: return [2 /*return*/, _d.apply(_c, [_f.apply(_e, [_g.sent()])])];
                            }
                        });
                    }); }, { id: id })];
            });
        });
    };
    /**
     * Querys order catalog
     * @param messageId string
     * @returns Message object
     */
    BusinessLayer.prototype.getOrderbyMsg = function (messageId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var messageId = _a.messageId;
                        return WAPI.getOrderbyMsg(messageId);
                    }, { messageId: messageId })];
            });
        });
    };
    /**
   * Update your business profile
   *
   * @example
   * ```javascript
   * await client.editBusinessProfile({description: 'New description for profile'});
   * ```
   *
   * ```javascript
   * await client.editBusinessProfile({categories: {
      id: "133436743388217",
      localized_display_name: "Artes e entretenimento",
      not_a_biz: false,
    }});
   * ```
   *
   * ```javascript
   * await client.editBusinessProfile({address: 'Street 01, New York'});
   * ```
   *
   * ```javascript
   * await client.editBusinessProfile({email: 'test@test.com.br'});
   * ```
   *
   * Change website of profile (max 2 sites)
   * ```javascript
   * await client.editBusinessProfile({website: [
    "https://www.wppconnect.io",
    "https://www.teste2.com.br",
  ]});
   * ```
   *
   * Change businessHours for Specific Hours
   * ```javascript
   * await client.editBusinessProfile({ businessHours: {
   * {
        tue: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
        wed: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
        thu: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
        fri: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
        sat: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
        sun: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
      }
    },
    timezone: "America/Sao_Paulo"
    });
   *
   * Change businessHours for Always Opened
   * ```javascript
   * await client.editBusinessProfile({ businessHours: {
      {
        mon: {
          mode: "open_24h",
        },
        tue: {
          mode: "open_24h",
        },
        wed: {
          mode: "open_24h",
        },
        thu: {
          mode: "open_24h",
        },
        fri: {
          mode: "open_24h",
        },
        sat: {
          mode: "open_24h",
        },
        sun: {
          mode: "open_24h",
        },
      }
      timezone: "America/Sao_Paulo"
    });
   *
   * Change businessHours for Appointment Only
   * ```javascript
   * await client.editBusinessProfile({ businessHours: { {
      mon: {
        mode: "appointment_only",
      },
      tue: {
        mode: "appointment_only",
      },
      wed: {
        mode: "appointment_only",
      },
      thu: {
        mode: "appointment_only",
      },
      fri: {
        mode: "appointment_only",
      },
      sat: {
        mode: "appointment_only",
      },
      sun: {
        mode: "appointment_only",
      },
    }
      timezone: "America/Sao_Paulo"
    });
   *
   *
   * ```
   */
    BusinessLayer.prototype.editBusinessProfile = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var _c, _d, _e, _f;
                            var options = _b.options;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        _d = (_c = JSON).parse;
                                        _f = (_e = JSON).stringify;
                                        return [4 /*yield*/, WPP.profile.editBusinessProfile(options)];
                                    case 1: return [2 /*return*/, _d.apply(_c, [_f.apply(_e, [_g.sent()])])];
                                }
                            });
                        }); }, { options: options })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Sends product with product image to given chat id
     * @param to Chat id
     * @param base64 Base64 image data
     * @param caption Message body
     * @param businessId Business id number that owns the product ('0000@c.us')
     * @param productId Product id, see method getBusinessProfilesProducts for more info
     */
    BusinessLayer.prototype.sendImageWithProduct = function (to, base64, caption, businessId, productId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, helpers_1.evaluateAndReturn)(this.page, function (_a) {
                        var to = _a.to, base64 = _a.base64, businessId = _a.businessId, caption = _a.caption, productId = _a.productId;
                        WAPI.sendImageWithProduct(base64, to, caption, businessId, productId);
                    }, { to: to, base64: base64, businessId: businessId, caption: caption, productId: productId })];
            });
        });
    };
    return BusinessLayer;
}(controls_layer_1.ControlsLayer));
exports.BusinessLayer = BusinessLayer;
