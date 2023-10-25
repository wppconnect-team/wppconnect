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
import { LabelsLayer } from './labels.layer';
import {
  evaluateAndReturn,
  base64MimeType,
  fileToBase64,
  downloadFileToBase64,
} from '../helpers';

export class NewsletterLayer extends LabelsLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Create Newsletter
   * @category newsletter
   *
   * @example
   * ```javascript
   * client.createNewsletter('Name for your newsletter', {description: 'Description for that',picture: '<base64_string',});
   * ```
   * @param name Name Newsletter
   * @param options options Newsletter, description and picture
   */

  public async createNewsletter(name: string, options: string) {
    return await evaluateAndReturn(
      this.page,
      ({ name, options }) => {
        WPP.newsletter.create(name, options);
      },
      { name, options }
    );
  }
}
