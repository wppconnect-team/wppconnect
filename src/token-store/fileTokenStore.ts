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
/// <reference types="node" />
import * as fs from 'fs';
import * as path from 'path';
import sanitize from 'sanitize-filename';
import { defaultLogger } from '../utils/logger';
import { isValidSessionToken } from './isValidSessionToken';
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

export const defaultFileTokenStoreOptions: FileTokenStoreOptions = {
  decodeFunction: JSON.parse,
  encodeFunction: JSON.stringify,
  encoding: 'utf8',
  fileExtension: '.data.json',
  path: './tokens',
};

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
export class FileTokenStore implements TokenStore {
  protected options: FileTokenStoreOptions;

  constructor(options: Partial<FileTokenStoreOptions> = {}) {
    this.options = Object.assign(
      {},
      defaultFileTokenStoreOptions,
      options
    ) as FileTokenStoreOptions;
  }

  /**
   * Resolve the path of file
   * @param sessionName Name of session
   * @returns Full path of token file
   */
  protected resolverPath(sessionName: string): string {
    const filename = sanitize(sessionName) + this.options.fileExtension;
    return path.resolve(process.cwd(), path.join(this.options.path, filename));
  }

  public async getToken(
    sessionName: string
  ): Promise<SessionToken | undefined> {
    const filePath = this.resolverPath(sessionName);

    if (!fs.existsSync(filePath)) {
      return undefined;
    }

    const text = await fs.promises
      .readFile(filePath, {
        encoding: this.options.encoding,
      })
      .catch(() => null);

    if (!text) {
      return undefined;
    }

    try {
      return this.options.decodeFunction(text);
    } catch (error) {
      defaultLogger.debug(error);
      return undefined;
    }
  }

  public async setToken(
    sessionName: string,
    tokenData: SessionToken | null
  ): Promise<boolean> {
    if (!tokenData || !isValidSessionToken(tokenData)) {
      return false;
    }

    if (!fs.existsSync(this.options.path)) {
      await fs.promises.mkdir(this.options.path, { recursive: true });
    }

    const filePath = this.resolverPath(sessionName);

    try {
      const text = this.options.encodeFunction(tokenData);

      await fs.promises.writeFile(filePath, text, {
        encoding: this.options.encoding,
      });
      return true;
    } catch (error) {
      defaultLogger.debug(error);
      return false;
    }
  }

  public async removeToken(sessionName: string): Promise<boolean> {
    const filePath = this.resolverPath(sessionName);

    if (!fs.existsSync(filePath)) {
      return false;
    }

    try {
      await fs.promises.unlink(filePath);
      return true;
    } catch (error) {
      defaultLogger.debug(error);
      return false;
    }
  }

  public async listTokens(): Promise<string[]> {
    if (!fs.existsSync(this.options.path)) {
      return [];
    }

    try {
      let files = await fs.promises.readdir(this.options.path);

      // Only sessions with same fileExtension
      files = files.filter((file) => file.endsWith(this.options.fileExtension));

      // Return name only
      files = files.map((file) =>
        path.basename(file, this.options.fileExtension)
      );

      return files;
    } catch (error) {
      defaultLogger.debug(error);
      return [];
    }
  }
}
