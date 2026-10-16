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

import * as mimeTypes from 'mime-types';
import * as fs from 'fs';

/**
 * Upper bound for a single file read. A base64 data URI is ~1.37x the file
 * size in one contiguous string, so an unbounded read can exhaust a small
 * host on a single send.
 */
export const MAX_FILE_BYTES = 100 * 1024 * 1024;

/**
 * Converts given file into base64 string
 * @param path file path
 * @param mime Optional, will retrieve file mime automatically if not defined (Example: 'image/png')
 */
export async function fileToBase64(path: string, mime?: string | false) {
  let size: number;
  try {
    const stat = await fs.promises.stat(path);
    if (!stat.isFile()) {
      return false;
    }
    size = stat.size;
  } catch {
    return false;
  }

  if (size > MAX_FILE_BYTES) {
    console.error(
      `fileToBase64: "${path}" is ${size} bytes, exceeding the ${MAX_FILE_BYTES} byte limit.`
    );
    return false;
  }

  const base64 = (await fs.promises.readFile(path)).toString('base64');
  if (mime === undefined) {
    mime = mimeTypes.lookup(path);
  }
  if (!mime) {
    mime = 'application/octet-stream';
  }
  const data = `data:${mime};base64,${base64}`;
  return data;
}

export async function Mine(path: string) {
  if (fs.existsSync(path)) {
    const mime = await mimeTypes.lookup(path);
    return mime;
  } else {
    return false;
  }
}
