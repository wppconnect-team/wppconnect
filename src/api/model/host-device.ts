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

import { Wid } from './wid';

export interface HostDevice {
  id: string;
  ref: string;
  refTTL: number;
  wid: Wid;
  connected: boolean;
  me: Wid;
  protoVersion: number[];
  clientToken: string;
  serverToken: string;
  isResponse: string;
  battery: number;
  plugged: boolean;
  lc: string;
  lg: string;
  locales: string;
  is24h: boolean;
  platform: string;
  phone: Phone;
  tos: number;
  smbTos: number;
  pushname: string;
  blockStoreAdds: boolean;
}

export interface Phone {
  wa_version: string;
  mcc: string;
  mnc: string;
  os_version: string;
  device_manufacturer: string;
  device_model: string;
  os_build_number: string;
}
