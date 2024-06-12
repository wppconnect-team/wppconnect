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

import * as path from 'path';
import * as mime from 'mime-types';

export function filenameFromMimeType(
  filename: string,
  mimeType: string
): string {
  const filenameExtension = path.extname(filename);
  const mimeExtension = mime.extension(mimeType);

  if (!mimeExtension || filenameExtension === mimeExtension) {
    return filename;
  }

  return path.basename(filename, filenameExtension) + '.' + mimeExtension;
}
