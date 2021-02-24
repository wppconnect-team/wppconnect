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

export interface PartialMessage {
  id: ID;
  body: string;
  type: string;
  t: number;
  notifyName: string;
  from: string;
  to: string;
  self: string;
  ack: number;
  invis: boolean;
  star: boolean;
  broadcast: boolean;
  mentionedJidList: any[];
  isForwarded: boolean;
  labels: any[];
}

interface ID {
  fromMe: boolean;
  remote: string;
  id: string;
  _serialized: string;
}
