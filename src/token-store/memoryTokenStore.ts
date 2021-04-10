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
 */
export class MemoryTokenStore implements TokenStore {
  protected tokens: {
    [key: string]: any;
  };

  public async getToken(
    sessionName: string
  ): Promise<SessionToken | undefined> {
    return this.tokens[sessionName];
  }
  public async setToken(
    sessionName: string,
    tokenData: SessionToken | void
  ): Promise<boolean> {
    if (!tokenData) {
      return false;
    }
    this.tokens[sessionName] = tokenData;

    return true;
  }
  public async removeToken(sessionName: string): Promise<boolean> {
    delete this.tokens[sessionName];
    return true;
  }

  public async listTokens(): Promise<string[]> {
    return Object.keys(this.tokens);
  }
}
