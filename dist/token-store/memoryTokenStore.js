"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryTokenStore = void 0;
/**
 * Token Store using im memory
 *
 * ```typescript
 * // Example of typescript with MemoryTokenStore
 * import * as wppconnect from '@wppconnect-team/wppconnect';
 *
 * const myTokenStore = new wppconnect.tokenStore.MemoryTokenStore();
 *
 * wppconnect.create({
 *   session: 'mySession',
 *   tokenStore: myTokenStore,
 * });
 *
 * wppconnect.create({
 *   session: 'otherSession',
 *   tokenStore: myTokenStore,
 * });
 * ```
 */
var MemoryTokenStore = /** @class */ (function () {
    function MemoryTokenStore() {
        this.tokens = {};
    }
    MemoryTokenStore.prototype.getToken = function (sessionName) {
        return this.tokens[sessionName];
    };
    MemoryTokenStore.prototype.setToken = function (sessionName, tokenData) {
        if (!tokenData) {
            return false;
        }
        this.tokens[sessionName] = tokenData;
        return true;
    };
    MemoryTokenStore.prototype.removeToken = function (sessionName) {
        delete this.tokens[sessionName];
        return true;
    };
    MemoryTokenStore.prototype.listTokens = function () {
        return Object.keys(this.tokens);
    };
    return MemoryTokenStore;
}());
exports.MemoryTokenStore = MemoryTokenStore;
