"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSessionToken = isValidSessionToken;
/**
 * Validate the object to check is a valid token
 * @param token Token to validate
 * @returns Token is valid
 */
function isValidSessionToken(token) {
    var requiredAttribbutes = [
        'WABrowserId',
        'WASecretBundle',
        'WAToken1',
        'WAToken2',
    ];
    return (token &&
        requiredAttribbutes.every(function (attr) { return typeof token[attr] === 'string' && token[attr].length > 0; }));
}
