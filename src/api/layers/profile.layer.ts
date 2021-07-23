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
import { HostLayer } from './host.layer';
import {
  base64MimeType,
  fileToBase64,
  downloadFileToBase64,
  resizeImg,
  evaluateAndReturn,
} from '../helpers';
import { CreateConfig } from '../../config/create-config';

export class ProfileLayer extends HostLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * @category Chat
   * @param contactsId Example: 0000@c.us | [000@c.us, 1111@c.us]
   * @param time duration of silence
   * @param type kind of silence "hours" "minutes" "year"
   * To remove the silence, just enter the contact parameter
   */
  public async sendMute(
    id: string,
    time: number,
    type: string
  ): Promise<object> {
    const result = await evaluateAndReturn(
      this.page,
      (id, time, type) => WAPI.sendMute(id, time, type),
      id,
      time,
      type
    );
    if (result['erro'] == true) {
      throw result;
    }
    return result;
  }

  /**
   * Change the theme
   * @category Host
   * @param string types "dark" or "light"
   */
  public setTheme(type: string) {
    return evaluateAndReturn(this.page, (type) => WAPI.setTheme(type), type);
  }

  /**
   * Sets current user profile status
   * @category Profile
   * @param status
   */
  public async setProfileStatus(status: string) {
    return await evaluateAndReturn(
      this.page,
      ({ status }) => {
        WAPI.setMyStatus(status);
      },
      { status }
    );
  }

  /**
   * Sets the user's current profile photo
   * @category Profile
   * @param name
   */
  public async setProfilePic(path: string, to?: string) {
    let b64 = await downloadFileToBase64(path, [
      'image/gif',
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/webp',
    ]);
    if (!b64) {
      b64 = await fileToBase64(path);
    }
    if (b64) {
      const buff = Buffer.from(
        b64.replace(/^data:image\/(png|jpe?g|webp);base64,/, ''),
        'base64'
      );
      const mimeInfo = base64MimeType(b64);

      if (!mimeInfo || mimeInfo.includes('image')) {
        let _webb64_96 = await resizeImg(buff, { width: 96, height: 96 }),
          _webb64_640 = await resizeImg(buff, { width: 640, height: 640 });
        let obj = { a: _webb64_640, b: _webb64_96 };

        return await evaluateAndReturn(
          this.page,
          ({ obj, to }) => WAPI.setProfilePic(obj, to),
          {
            obj,
            to,
          }
        );
      } else {
        console.log('Not an image, allowed formats png, jpeg and webp');
        return false;
      }
    }
  }

  /**
   * Sets current user profile name
   * @category Profile
   * @param name
   */
  public async setProfileName(name: string) {
    return evaluateAndReturn(
      this.page,
      ({ name }) => {
        WAPI.setMyName(name);
      },
      { name }
    );
  }
}
