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
import { CreateConfig } from '../../config/create-config';
import { SessionToken } from '../../token-store';
import { StatusFind } from './enum';

/**
 * A callback will be received, informing the status of the qrcode
 */
export type CatchQRCallback = (
  qrCode: string,
  asciiQR: string,
  attempt: number,
  urlCode?: string
) => void;

/**
 * A callback will be received, informing the customer's status
 */
export type StatusFindCallback = (
  status: StatusFind | keyof typeof StatusFind,
  session: string
) => void;

/**
 * A callback will be received, informing data as percentage and loading screen message
 */
export type LoadingScreenCallback = (percent: number, message: string) => void;

/**
 * A callback will be received, informing a code to you connect
 */
export type LinkByCodeCallback = (code: string) => void;

export interface CreateOptions extends CreateConfig {
  /**
   * You must pass a string type parameter, this parameter will be the name of the client's session. If the parameter is not passed, the section name will be "session".
   */
  session?: string;
  /**
   * A callback will be received, informing the status of the qrcode
   */
  catchQR?: CatchQRCallback;

  /**
   * A callback will be received, informing a code to you connect
   */
  catchLinkCode?: LinkByCodeCallback;

  /**
   * A callback will be received, informing the customer's status
   */
  statusFind?: StatusFindCallback;

  /**
   * A callback will be received, informing data as percentage and loading screen message
   */
  onLoadingScreen?: LoadingScreenCallback;
  /**
   * Pass the session token information you can receive this token with the await client.getSessionTokenBrowser () function
   * @deprecated in favor of `sessionToken`
   */
  browserSessionToken?: SessionToken;
}
