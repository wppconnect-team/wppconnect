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

import * as crypto from 'crypto';
import hkdf from 'futoin-hkdf';
import atob from 'atob';
import { ResponseType } from 'axios';
import { Transform } from 'stream';

export const makeOptions = (
  useragentOverride: string,
  responseType: ResponseType = 'arraybuffer'
) => ({
  responseType: responseType,
  headers: {
    'User-Agent': processUA(useragentOverride),
    DNT: '1',
    'Upgrade-Insecure-Requests': '1',
    origin: 'https://web.whatsapp.com/',
    referer: 'https://web.whatsapp.com/',
  },
});

export const timeout = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));
export const mediaTypes = {
  IMAGE: 'Image',
  VIDEO: 'Video',
  AUDIO: 'Audio',
  PTT: 'Audio',
  DOCUMENT: 'Document',
  STICKER: 'Image',
};

const processUA = (userAgent: string) => {
  let ua =
    userAgent ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36';
  if (!ua.includes('WhatsApp')) ua = 'WhatsApp/2.16.352 ' + ua;
  return ua;
};

export const magix = (
  fileData: any,
  mediaKeyBase64: any,
  mediaType: any,
  expectedSize?: number
) => {
  const encodedHex = fileData.toString('hex');
  const encodedBytes = hexToBytes(encodedHex);
  const mediaKeyBytes: any = base64ToBytes(mediaKeyBase64);
  const info = `WhatsApp ${mediaTypes[mediaType.toUpperCase()]} Keys`;
  const hash: string = 'sha256';
  const salt: any = new Uint8Array(32);
  const expandedSize = 112;
  const mediaKeyExpanded = hkdf(mediaKeyBytes, expandedSize, {
    salt,
    info,
    hash,
  });
  const iv = mediaKeyExpanded.slice(0, 16);
  const cipherKey = mediaKeyExpanded.slice(16, 48);
  const decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, iv);
  const decoded: Buffer = decipher.update(encodedBytes);
  const mediaDataBuffer = expectedSize
    ? fixPadding(decoded, expectedSize)
    : decoded;
  return mediaDataBuffer;
};

const fixPadding = (data: Buffer, expectedSize: number) => {
  let padding = (16 - (expectedSize % 16)) & 0xf;
  if (padding > 0) {
    if (expectedSize + padding == data.length) {
      //  console.log(`trimmed: ${padding} bytes`);
      data = data.slice(0, data.length - padding);
    } else if (data.length + padding == expectedSize) {
      // console.log(`adding: ${padding} bytes`);
      let arr = new Uint16Array(padding).map((b) => padding);
      data = Buffer.concat([data, Buffer.from(arr as any)]);
    }
  }
  //@ts-ignore
  return Buffer.from(data, 'utf-8');
};

const hexToBytes = (hexStr: any) => {
  const intArray = [];
  for (let i = 0; i < hexStr.length; i += 2) {
    intArray.push(parseInt(hexStr.substr(i, 2), 16));
  }
  return new Uint8Array(intArray);
};

const base64ToBytes = (base64Str: any) => {
  const binaryStr = atob(base64Str);
  const byteArray = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    byteArray[i] = binaryStr.charCodeAt(i);
  }
  return byteArray;
};

export const newMagix = (
  mediaKeyBase64: string,
  mediaType: string,
  expectedSize: number
) => {
  const mediaKeyBytes = newBase64ToBytes(mediaKeyBase64);
  const info = `WhatsApp ${mediaTypes[mediaType.toUpperCase()]} Keys`;
  const hash = 'sha256';
  const salt = Buffer.alloc(32);
  const expandedSize = 112;
  const mediaKeyExpanded = hkdf(mediaKeyBytes, expandedSize, {
    salt,
    info,
    hash,
  });
  const iv = mediaKeyExpanded.slice(0, 16);
  const cipherKey = mediaKeyExpanded.slice(16, 48);

  const decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, iv);
  let processedBytes: number = 0;
  let buffer = Buffer.alloc(0);

  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
      try {
        const decryptedChunk = decipher.update(chunk);
        processedBytes += decryptedChunk.length;
        if (processedBytes > expectedSize) {
          const paddedChunk = Buffer.from(decryptedChunk).slice(
            0,
            buffer.length - (processedBytes - expectedSize)
          );
          callback(null, paddedChunk);
        } else {
          callback(null, decryptedChunk);
        }
      } catch (error: any) {
        callback(error);
      }
    },
  });

  transformStream.on('error', (error) => {
    console.error('Error during decryption:', error);
  });

  return transformStream;
};

const newBase64ToBytes = (base64Str: string) =>
  Buffer.from(base64Str, 'base64');
