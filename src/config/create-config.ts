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
import { Browser, BrowserContext, LaunchOptions, Page } from 'puppeteer';
import { Logger } from 'winston';
import { defaultLogger } from '../utils/logger';

// Server config
export interface CreateConfig {
  /** folder name when saving tokens
   * @default 'tokens'
   */
  folderNameToken?: string;
  /**
   * folder directory tokens, just inside the wppconnect folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
   */
  mkdirFolderToken?: string;
  /**
   * Headless chrome
   * @default true
   */
  headless?: boolean;
  /**
   * Open devtools by default
   * @default false
   */
  devtools?: boolean;
  /**
   * If false will use Chromium instance
   * @default true
   */
  useChrome?: boolean;
  /**
   * Opens a debug session
   * @default false
   */
  debug?: boolean;
  /**
   * If you want to use browserWSEndpoint
   */
  browserWS?: string;
  /**
   * Parameters to be added into the chrome browser instance
   */
  browserArgs?: string[];
  /**
   * Will be passed to puppeteer.launch
   */
  puppeteerOptions?: LaunchOptions;
  /**
   * Pass a external browser instance, can be used with electron
   */
  browser?: Browser | BrowserContext;
  /**
   * Pass a external page instance, can be used with electron
   */
  page?: Page;
  /**
   * Logs QR automatically in terminal
   * @default true
   */
  logQR?: boolean;
  /**
   * Will disable the welcoming message which appears in the beginning
   * @default false
   */
  disableWelcome?: boolean;
  /**
   * Logs info updates automatically in terminal
   * @default true
   */
  updatesLog?: boolean;
  /**
   * Automatically closes the wppconnect only when scanning the QR code (default 60000 miliseconds, if you want to turn it off, assign 0 or false)
   * @default 60000
   */
  autoClose?: number;
  /**
   * Creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
   * @default true
   */
  createPathFileToken?: boolean;
  /**
   * Wait for in chat to return a instance of {@link Whatsapp}
   * @default false
   */
  waitForLogin?: boolean;
  /**
   * Wait for in chat to return a instance of {@link Whatsapp}
   * @default false
   */
  logger?: Logger;
}
export const defaultOptions: CreateConfig = {
  folderNameToken: 'tokens',
  mkdirFolderToken: '',
  headless: true,
  devtools: false,
  useChrome: true,
  debug: false,
  logQR: true,
  browserWS: '',
  browserArgs: [''],
  puppeteerOptions: {},
  disableWelcome: false,
  updatesLog: true,
  autoClose: 60000,
  createPathFileToken: true,
  waitForLogin: true,
  logger: defaultLogger,
};
