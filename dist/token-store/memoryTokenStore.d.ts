import { SessionToken, TokenStore } from './types';
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
export declare class MemoryTokenStore implements TokenStore {
    protected tokens: {
        [key: string]: any;
    };
    getToken(sessionName: string): SessionToken | undefined;
    setToken(sessionName: string, tokenData: SessionToken | null): boolean;
    removeToken(sessionName: string): boolean;
    listTokens(): string[];
}
