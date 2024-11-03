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
 * Parameters for returning messages
 */
export interface GetMessagesParam {
  /**
   * Number of messages to return.
   * Set it to `-1` to return everything (may take a while and crash the interface).
   *
   * @default 20
   */
  count?: number;
  /**
   * ID of the last message to continue the search.
   * This works like pagination, so when you get an ID,
   * you can use it to get the next messages from it.
   */
  id?: string;
  fromMe?: boolean;
  /**
   * Whether you want to retrieve the messages before or after the ID entered.
   *
   * @default 'before'
   */
  direction?: 'before' | 'after';
}
