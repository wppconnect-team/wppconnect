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
import { HostLayer } from './host.layer';

export class NewsletterLayer extends HostLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Create Newsletter
   * @category Newsletter
   *
   * @example
   * ```javascript
   * client.createNewsletter('Name for your newsletter', {description: 'Description for that', picture: '<base64_string',});
   * ```
   * @param name Name Newsletter
   * @param options options Newsletter, description and picture
   */

  public async createNewsletter(
    name: string,
    options?: {
      description?: string;
      picture?: string;
    }
  ) {
    return evaluateAndReturn(
      this.page,
      (name, options) => WPP.newsletter.create(name, options),
      name,
      options
    );
  }

  /**
   * Destroy a Newsletter
   * @category Newsletter
   *
   * @example
   * ```javascript
   * client.destroyNewsletter('[newsletter-id]@newsletter');
   * ```
   * @param name id of Newsletter
   */
  public async destroyNewsletter(id: string) {
    return evaluateAndReturn(this.page, (id) => WPP.newsletter.destroy(id), id);
  }

  /**
   * Edit a Newsletter
   * @category Newsletter
   *
   * @example
   * ```javascript
   * client.editNewsletter('[newsletter-id]@newsletter', {
      description: 'new description';
      name: 'new name';
      picture: '<new pic base64>';
    });
   * ```
   * @param name id of Newsletter
   */
  public async editNewsletter(
    id: string,
    opts?: {
      description?: string;
      name?: string;
      picture?: string | null;
    }
  ) {
    return evaluateAndReturn(
      this.page,
      (id, opts) => WPP.newsletter.edit(id, opts),
      id,
      opts
    );
  }

  /**
   * Mute a Newsletter
   * @category Newsletter
   *
   * @example
   * ```javascript
   * client.muteNewsletter('[newsletter-id]@newsletter');
   * ```
   * @param name id of Newsletter
   */
  public async muteNesletter(id: string) {
    return evaluateAndReturn(this.page, (id) => WPP.newsletter.mute(id), id);
  }
}
