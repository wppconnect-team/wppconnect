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

import axios from 'axios';

/** Upper bound so one remote file cannot exhaust a small host (100 MB). */
export const MAX_DOWNLOAD_BYTES = 100 * 1024 * 1024;

/** Remote fetches must not wedge a send forever. */
export const DOWNLOAD_TIMEOUT_MS = 30000;

export async function downloadFileToBase64(
  _path: string,
  _mines: (string | RegExp)[] = []
): Promise<string | false> {
  if (!Array.isArray(_mines)) {
    console.error(`set mines string array, not "${typeof _mines}" `);
    return false;
  }

  const reHttp = /^https?:/;

  if (!reHttp.test(_path)) {
    return false;
  }

  try {
    const response = await axios.get<any>(_path, {
      responseType: 'arraybuffer',
      timeout: DOWNLOAD_TIMEOUT_MS,
      maxContentLength: MAX_DOWNLOAD_BYTES,
    });

    // Refuse to materialize a huge body (headers arrive before the bytes)
    const contentLength = Number(response.headers['content-length']);
    if (Number.isFinite(contentLength) && contentLength > MAX_DOWNLOAD_BYTES) {
      return false;
    }

    const mimeType = String(response.headers['content-type'] ?? '');

    if (_mines.length) {
      const isValidMime = _mines.some((m) => {
        if (typeof m === 'string') {
          return m === mimeType;
        }
        return m.exec(mimeType);
      });
      if (!isValidMime) {
        console.error(`Content-Type "${mimeType}" of ${_path} is not allowed`);
        return false;
      }
    }

    const content = Buffer.from(response.data, 'binary').toString('base64');

    return `data:${mimeType};base64,${content}`;
  } catch (error) {}

  return false;
}
