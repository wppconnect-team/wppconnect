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
 * Group properties
 */
export enum GroupProperty {
  /**
   * Define how can send message in the group
   * `true` only admins
   * `false` everyone
   */
  ANNOUNCEMENT = 'announcement',

  /**
   * Define how can edit the group data
   * `true` only admins
   * `false` everyone
   */
  RESTRICT = 'restrict',

  /**
   * Non-Documented
   */
  NO_FREQUENTLY_FORWARDED = 'no_frequently_forwarded',

  /**
   * Enable or disable temporary messages
   * `true` to enable
   * `false` to disable
   */
  EPHEMERAL = 'ephemeral',
}
