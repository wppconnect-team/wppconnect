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

export async function downloadFileToBase64(
  _path: string,
  _mines: string[]
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
    const response = await axios.get(_path, {
      responseType: 'arraybuffer',
    });

    const mimeType = response.headers['content-type'];
    if (!_mines.includes(mimeType)) {
      console.error(`Content-Type "${mimeType}" of ${_path} is not allowed`);
      return false;
    }

    const content = Buffer.from(response.data, 'binary').toString('base64');

    return `data:${mimeType};base64,${content}`;
  } catch (error) {}

  return false;
}

export function MINES() {
  const obj = [
    'audio/aac',
    'application/x-abiword',
    'application/octet-stream',
    'video/x-msvideo',
    'application/vnd.amazon.ebook',
    'application/octet-stream',
    'application/x-bzip',
    'application/x-bzip2',
    'application/x-csh',
    'text/css',
    'text/csv',
    'application/msword',
    'application/vnd.ms-fontobject',
    'application/epub+zip',
    'image/gif',
    'text/html',
    'image/x-icon',
    'text/calendar',
    'application/java-archive',
    'image/jpeg',
    'application/javascript',
    'application/json',
    'audio/midi',
    'video/mpeg',
    'application/vnd.apple.installer+xml',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text',
    'audio/ogg',
    'video/ogg',
    'application/ogg',
    'font/otf',
    'image/png',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/x-rar-compressed',
    'application/rtf',
    'application/x-sh',
    'image/svg+xml',
    'application/x-shockwave-flash',
    'application/x-tar',
    'image/tiff',
    'application/typescript',
    'font/ttf',
    'application/vnd.visio',
    'audio/x-wav',
    'audio/webm',
    'video/webm',
    'image/webp',
    'font/woff',
    'font/woff2',
    'application/xhtml+xml',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-',
    'officedocument.spreadsheetml.sheet',
    'application/xml',
    'application/vnd.mozilla.xul+xml',
    'application/zip',
    'video/3gpp',
    'audio/3gpp',
    'video/3gpp2',
    'audio/3gpp2',
    'application/x-7z-compressed',
  ];

  return obj;
}
