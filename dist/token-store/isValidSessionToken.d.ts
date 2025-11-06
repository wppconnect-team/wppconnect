import { SessionToken } from './types';
/**
 * Validate the object to check is a valid token
 * @param token Token to validate
 * @returns Token is valid
 */
export declare function isValidSessionToken(token: any): token is SessionToken;
