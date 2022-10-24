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
export class MemoryTokenStore implements TokenStore {
  protected tokens: {
    [key: string]: any;
  } = {};

  public getToken(sessionName: string): SessionToken | undefined {
    return this.tokens[sessionName];
  }
  public setToken(
    sessionName: string,
    tokenData: SessionToken | null
  ): boolean {
    if (!tokenData) {
      return false;
    }
    this.tokens[sessionName] = tokenData;

    return true;
  }
  public removeToken(sessionName: string): boolean {
    delete this.tokens[sessionName];
    return true;
  }

  public listTokens(): string[] {
    return Object.keys(this.tokens);
  }
}
