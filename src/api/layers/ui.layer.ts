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

import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { evaluateAndReturn } from '../helpers';
import { Wid, Chat } from '../model';
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
      (chatId: string) => WPP.chat.openChatBottom(chatId),
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
      (chatId: string, messageId) => WPP.chat.openChatAt(chatId, messageId),
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
  public getActiveChat(): Chat {
    return evaluateAndReturn(this.page, () => WPP.chat.getActiveChat());
  }
}
