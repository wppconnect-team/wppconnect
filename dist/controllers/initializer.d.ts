import { Whatsapp } from '../api/whatsapp';
import { CreateConfig } from '../config/create-config';
import { CatchQRCallback, CreateOptions, LinkByCodeCallback, LoadingScreenCallback, StatusFindCallback } from '../api/model/initializer';
import { SessionToken } from '../token-store';
/**
 * Start the bot
 * @returns Whatsapp page, with this parameter you will be able to access the bot functions
 */
export declare function create(createOption: CreateOptions): Promise<Whatsapp>;
/**
 * Start the bot
 * You must pass a string type parameter, this parameter will be the name of the client's session. If the parameter is not passed, the section name will be "session".
 * @returns Whatsapp page, with this parameter you will be able to access the bot functions
 * @deprecated Deprecated in favor of create with {@link CreateOptions} (e.g., wppconnect.create({session: 'test'})).
 */
export declare function create(sessionName: string, catchQR?: CatchQRCallback, statusFind?: StatusFindCallback, onLoadingScreen?: LoadingScreenCallback, catchLinkCode?: LinkByCodeCallback, options?: CreateConfig, browserSessionToken?: SessionToken): Promise<Whatsapp>;
