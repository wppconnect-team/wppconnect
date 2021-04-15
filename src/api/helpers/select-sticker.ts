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

import sharp from 'sharp';

interface selectOutput {
  webpBase64: string;
  metadata: {
    width?: number;
    height?: number;
  };
}

export async function stickerSelect(_B: Buffer, _t: number) {
  let _w: sharp.Sharp, _ins: Buffer;
  switch (_t) {
    case 0:
      _ins = await sharp(_B, { failOnError: false })
        .resize({ width: 512, height: 512 })
        .toBuffer();
      _w = sharp(_ins, { failOnError: false }).webp();
      break;
    case 1:
      _w = sharp(_B, { animated: true }).webp();
      break;
    default:
      console.error('Enter a valid number 0 or 1');
      return false;
  }

  const metadata = await _w.metadata();

  if (metadata.width > 512 || metadata.pageHeight > 512) {
    console.error(
      `Invalid image size (max 512x512):${metadata.width}x${metadata.pageHeight}`
    );
    return false;
  }

  const obj: selectOutput = {
    webpBase64: (await _w.toBuffer()).toString('base64'),
    metadata: {
      width: metadata.width,
      height: metadata.pageHeight,
    },
  };

  return obj;
}

interface CreateSize {
  width?: number;
  height?: number;
}
export async function resizeImg(buff: Buffer, size: CreateSize) {
  const _ins = await sharp(buff, { failOnError: false })
      .resize({ width: size.width, height: size.height })
      .toBuffer(),
    _w = sharp(_ins, { failOnError: false }).jpeg(),
    _webb64 = (await _w.toBuffer()).toString('base64');

  return _webb64;
}
