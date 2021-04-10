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
import { SessionToken } from './types';

/**
 * Validate the object to check is a valid token
 * @param token Token to validate
 * @returns Token is valid
 */
export function isValidSessionToken(token: any): token is SessionToken {
  const requiredAttribbutes = [
    'WABrowserId',
    'WASecretBundle',
    'WAToken1',
    'WAToken2',
  ];

  return (
    token &&
    requiredAttribbutes.every(
      (attr) => typeof token[attr] === 'string' && token[attr].length > 0
    )
  );
}
