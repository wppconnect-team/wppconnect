import { SessionToken, TokenStore } from './types';
export interface FileTokenStoreOptions {
    /**
     * Decode function to parse token file (Default `JSON.parse`) {@link defaultFileTokenStoreOptions}
     * @default `JSON.parse`
     */
    decodeFunction: (text: string) => any;
    /**
     * Encode function to save tokens (Default `JSON.stringify`)
     * @default `JSON.stringify`
     */
    encodeFunction: (data: any) => string;
    /**
     * Encoding used to read and save files
     * @default 'utf8'
     */
    encoding: BufferEncoding;
    /**
     * @default '.data.json'
     */
    fileExtension: string;
    /**
     * Folder path to store tokens
     * @default './tokens'
     */
    path: string;
}
export declare const defaultFileTokenStoreOptions: FileTokenStoreOptions;
/**
 * Token Store using file
 *
 * ```typescript
 * // Example of typescript with FileTokenStore
 * import * as wppconnect from '@wppconnect-team/wppconnect';
 *
 * const myTokenStore = new wppconnect.tokenStore.FileTokenStore({
 * // decodeFunction: JSON.parse,
 * // encodeFunction: JSON.stringify,
 * // encoding: 'utf8',
 * // fileExtension: '.my.ext',
 * // path: './a_custom_path',
 * });
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
export declare class FileTokenStore implements TokenStore {
    protected options: FileTokenStoreOptions;
    constructor(options?: Partial<FileTokenStoreOptions>);
    /**
     * Resolve the path of file
     * @param sessionName Name of session
     * @returns Full path of token file
     */
    protected resolverPath(sessionName: string): string;
    getToken(sessionName: string): Promise<SessionToken | undefined>;
    setToken(sessionName: string, tokenData: SessionToken | null): Promise<boolean>;
    removeToken(sessionName: string): Promise<boolean>;
    listTokens(): Promise<string[]>;
}
