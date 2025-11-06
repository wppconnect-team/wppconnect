/**
 * Session token of WhatsApp to authenticate the web interface
 * ```typescript
 * // Example of SessionToken
 * {
 *   WABrowserId: '"UnXjH....."',
 *   WASecretBundle: '{"key":"+i/nRgWJ....","encKey":"kGdMR5t....","macKey":"+i/nRgW...."}',
 *   WAToken1: '"0i8...."',
 *   WAToken2: '"1@lPpzwC...."',
 * }
 * ```
 */
export interface SessionToken {
    WABrowserId: string;
    WAToken1: string;
    WAToken2: string;
    WASecretBundle: string;
}
/**
 * Standard interface to manage tokens
 *
 * ```typescript
 * // Example of typescript with TokenStore and redis
 * import * as wppconnect from '@wppconnect-team/wppconnect';
 * import * as redis from 'redis';
 *
 * const redisClient = redis.createClient(6379, '127.0.0.1');
 *
 * // Base of interface:
 * const myTokenStore: wppconnect.tokenStore.TokenStore = {
 *   getToken: (sessionName: string) => {
 *       // Your logic here
 *     }),
 *   setToken: (sessionName: string, tokenData: wppconnect.tokenStore.SessionToken) => {
 *       // Your logic here
 *     }),
 *   removeToken: (sessionName: string) => {
 *       // Your logic here
 *     }),
 *   listTokens: () => {
 *       // Your logic here
 *     }),
 * };
 *
 * // Example with redis
 * const myTokenStore: wppconnect.tokenStore.TokenStore = {
 *   getToken: (sessionName: string) =>
 *     new Promise((resolve, reject) => {
 *       redisClient.get(sessionName, (err, reply) => {
 *         if (err) {
 *           return reject(err);
 *         }
 *         resolve(JSON.parse(reply));
 *       });
 *     }),
 *   setToken: (sessionName: string, tokenData: wppconnect.tokenStore.SessionToken) =>
 *     new Promise((resolve) => {
 *       redisClient.set(sessionName, JSON.stringify(tokenData), (err, reply) => {
 *         return resolve(err ? false : true);
 *       });
 *     }),
 *   removeToken: (sessionName: string) =>
 *     new Promise((resolve) => {
 *       redisClient.del(sessionName, (err) => {
 *         return resolve(err ? false : true);
 *       });
 *     }),
 *   listTokens: () =>
 *     new Promise((resolve) => {
 *       redisClient.keys('*', (err, keys) => {
 *         if (err) {
 *           return resolve([]);
 *         }
 *         return resolve(keys);
 *       });
 *     }),
 * };
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
export interface TokenStore<T extends SessionToken = SessionToken> {
    /**
     * Return the session data if exists
     * @param sessionName Name of session
     */
    getToken(sessionName: string): Promise<T | undefined> | T | undefined;
    /**
     * Store the session token data
     * @param sessionName Name of session
     * @param tokenData Session token data
     */
    setToken(sessionName: string, tokenData: T | null): Promise<boolean> | boolean;
    /**
     * Remove the session
     * @param sessionName Name of session
     * @returns Token was removed
     */
    removeToken(sessionName: string): Promise<boolean> | boolean;
    /**
     * A liste of avaliable sessions
     */
    listTokens(): Promise<string[]> | string[];
}
