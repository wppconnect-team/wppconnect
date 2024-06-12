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

/**
 * ID of user or group
 * "xxxxxxxxxx@c.us" for contacts
 * "xxxxxxxxxx@g.us" for groups
 */
export interface Wid {
  /**
   * "c.us" for contacts
   * "g.us" for groups
   */
  server: string;

  /**
   * number of contact or group
   */
  user: string;

  /**
   * user@server
   */
  _serialized: string;
}
