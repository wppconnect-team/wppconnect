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

export enum AckType {
  MD_DOWNGRADE = -7,
  INACTIVE = -6,
  CONTENT_UNUPLOADABLE = -5,
  CONTENT_TOO_BIG = -4,
  CONTENT_GONE = -3,
  EXPIRED = -2,
  FAILED = -1,
  CLOCK = 0,
  SENT = 1,
  RECEIVED = 2,
  READ = 3,
  PLAYED = 4,
}
