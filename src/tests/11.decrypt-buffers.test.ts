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
import * as assert from 'assert';
import * as crypto from 'crypto';
import hkdf from 'futoin-hkdf';

import { magix } from '../api/helpers/decrypt';

/**
 * Independent reference for the byte conversion inside `magix`: the same AES
 * key schedule and decrypt, but feeding raw Buffers straight into Node's
 * crypto (no hex/atob per-byte round-trips).
 */
function referenceDecrypt(
  fileData: Buffer,
  mediaKeyBase64: string,
  info: string
): Buffer {
  const mediaKeyBytes = Buffer.from(mediaKeyBase64, 'base64');
  const expanded = hkdf(mediaKeyBytes, 112, {
    salt: Buffer.alloc(32),
    info,
    hash: 'sha256',
  });
  const iv = expanded.slice(0, 16);
  const cipherKey = expanded.slice(16, 48);
  const decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, iv);
  return decipher.update(fileData);
}

describe('decrypt buffers', function () {
  const fileData = Buffer.alloc(256 * 1024, 0xab);
  const mediaKeyBase64 = Buffer.alloc(32, 0x01).toString('base64');
  const info = 'WhatsApp Image Keys';

  it('decrypts byte-identically without the hex/atob round-trips', function () {
    const expected = referenceDecrypt(fileData, mediaKeyBase64, info);
    const actual = magix(fileData, mediaKeyBase64, 'image');

    assert.ok(Buffer.isBuffer(actual), 'magix must return a Buffer');
    assert.deepStrictEqual(actual, expected);
  });

  it('keeps the expectedSize path byte-identical', function () {
    const expected = referenceDecrypt(fileData, mediaKeyBase64, info);
    const actual = magix(fileData, mediaKeyBase64, 'image', expected.length);

    assert.deepStrictEqual(actual, expected);
  });
});
