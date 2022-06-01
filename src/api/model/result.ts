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

import { HostDevice } from './host-device';
import { MessageId } from './message-id';

export interface ScopeResult {
  me: HostDevice;
  to: MessageId & {
    formattedName: string;
    isBusiness: boolean;
    isMyContact: boolean;
    verifiedName: string;
    pushname?: string;
  };
  erro?: boolean;
  text?: string | null;
  status?: number | string;
}

export interface SendFileResult extends ScopeResult {
  type: string;
  filename: string;
  text?: string;
  mimeType?: string;
}

export interface SendStickerResult extends ScopeResult {
  type: string;
}

export interface SendPttResult extends ScopeResult {
  type: string;
  filename: string;
  text?: string;
}
