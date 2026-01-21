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

import { AutoDownloadSettings, Theme } from '@wppconnect/wa-js/dist/conn';
import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { evaluateAndReturn } from '../helpers';
import { Wid } from '../model';
import { GroupLayer } from './group.layer';

export class UILayer extends GroupLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Opens given chat at last message (bottom)
   * Will fire natural workflow events of whatsapp web
   * @category UI
   * @param chatId
   */
  public async openChat(chatId: string | Wid) {
    return evaluateAndReturn(
      this.page,
      (chatId: string) => WPP.chat.openChatBottom(chatId, undefined),
      chatId
    );
  }

  /**
   * Opens chat at given message position
   * @category UI
   * @param chatId Chat id
   * @param messageId Message id (For example: '06D3AB3D0EEB9D077A3F9A3EFF4DD030')
   */
  public async openChatAt(chatId: string | Wid, messageId: string) {
    return evaluateAndReturn(
      this.page,
      (chatId: string, messageId) =>
        WPP.chat.openChatAt(chatId, messageId, undefined),
      chatId,
      messageId
    );
  }

  /**
   * Closes the currently opened chat (if any).
   * The boolean result reflects if there was any chat that got closed.
   * @category UI
   */
  public async closeChat() {
    return evaluateAndReturn(this.page, () => WPP.chat.closeChat());
  }

  /**
   * Return the currently active chat (visually open)
   * @category UI
   */
  public getActiveChat() {
    return evaluateAndReturn(this.page, () => WPP.chat.getActiveChat());
  }

  /**
   * Get current theme
   * @category UI
   * @returns Current theme ('dark' or 'light')
   */
  public async getTheme() {
    return await evaluateAndReturn(this.page, () => WPP.conn.getTheme());
  }

  /**
   * Set theme
   * Note: This will force a reload of WhatsApp Web to take effect
   * @category UI
   * @param theme Theme to set ('dark' or 'light')
   * @returns void
   */
  public async setTheme(theme: Theme) {
    return await evaluateAndReturn(
      this.page,
      (theme) => WPP.conn.setTheme(theme),
      theme
    );
  }

  /**
   * Get auto download settings
   * @category UI
   * @returns Auto download settings
   */
  public async getAutoDownloadSettings() {
    return await evaluateAndReturn(this.page, () =>
      WPP.conn.getAutoDownloadSettings()
    );
  }

  /**
   * Set auto download settings
   * Note: This will force a reload of WhatsApp Web to take effect
   * @category UI
   * @param settings Auto download settings to set
   * @returns void
   */
  public async setAutoDownloadSettings(settings: AutoDownloadSettings) {
    return await evaluateAndReturn(
      this.page,
      (settings) => WPP.conn.setAutoDownloadSettings(settings),
      settings
    );
  }
}
