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
import * as fs from 'fs';
import * as http from 'http';
import * as os from 'os';
import * as path from 'path';

import {
  DOWNLOAD_TIMEOUT_MS,
  MAX_DOWNLOAD_BYTES,
  downloadFileToBase64,
} from '../api/helpers/download-file';
import { MAX_FILE_BYTES, fileToBase64 } from '../api/helpers/file-to-base64';
import { DECRYPT_TIMEOUT_MS, getUntilOk } from '../api/whatsapp';

const axiosModule = require('axios');

function listen(server: http.Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve((server.address() as any).port);
    });
  });
}

function close(server: http.Server) {
  (server as any).closeAllConnections?.();
  server.close();
}

describe('media I/O bounds', function () {
  describe('fileToBase64', function () {
    it('returns false for a missing file', async function () {
      assert.strictEqual(
        await fileToBase64(path.join(os.tmpdir(), 'wpp-no-such-file-xyz')),
        false
      );
    });

    it('returns a data URI for a small file', async function () {
      const tmp = path.join(os.tmpdir(), `wpp-media-bounds-${Date.now()}.txt`);
      fs.writeFileSync(tmp, 'hello');
      try {
        const uri = await fileToBase64(tmp);
        assert.ok(String(uri).startsWith('data:text/plain;base64,'));
      } finally {
        fs.unlinkSync(tmp);
      }
    });

    it('returns false for oversized files before allocating the read', async function () {
      const originalStat = fs.promises.stat;
      const originalReadFile = fs.promises.readFile;
      let readCalled = false;
      (fs.promises as any).stat = async () => ({
        size: MAX_FILE_BYTES + 1,
        isFile: () => true,
      });
      (fs.promises as any).readFile = async (...args: any[]) => {
        readCalled = true;
        return originalReadFile(...(args as [any]));
      };
      try {
        assert.strictEqual(await fileToBase64('huge.bin'), false);
        assert.strictEqual(
          readCalled,
          false,
          'an oversized file must not be read'
        );
      } finally {
        (fs.promises as any).stat = originalStat;
        (fs.promises as any).readFile = originalReadFile;
      }
    });
  });

  describe('downloadFileToBase64', function () {
    it('returns false for non-http input without touching the network', async function () {
      assert.strictEqual(await downloadFileToBase64('/tmp/x.png'), false);
    });

    it('bounds the request and converts a small body', async function () {
      const originalGet = axiosModule.get;
      let captured: any;
      axiosModule.get = async (_url: string, config: any) => {
        captured = config;
        return {
          status: 200,
          headers: { 'content-type': 'image/png', 'content-length': '3' },
          data: Buffer.from('abc'),
        };
      };
      try {
        const uri = await downloadFileToBase64('https://example.com/x.png', [
          'image/png',
        ]);
        assert.strictEqual(uri, 'data:image/png;base64,YWJj');
        assert.strictEqual(captured.timeout, DOWNLOAD_TIMEOUT_MS);
        assert.strictEqual(captured.maxContentLength, MAX_DOWNLOAD_BYTES);
      } finally {
        axiosModule.get = originalGet;
      }
    });

    it('returns false when the advertised body exceeds the bound', async function () {
      const originalGet = axiosModule.get;
      axiosModule.get = async () => ({
        status: 200,
        headers: {
          'content-type': 'image/png',
          'content-length': String(MAX_DOWNLOAD_BYTES + 1),
        },
        data: Buffer.alloc(0),
      });
      try {
        assert.strictEqual(
          await downloadFileToBase64('https://example.com/big.png'),
          false
        );
      } finally {
        axiosModule.get = originalGet;
      }
    });

    it('returns false when the request itself fails', async function () {
      const originalGet = axiosModule.get;
      axiosModule.get = async () => {
        throw new Error('timeout');
      };
      try {
        assert.strictEqual(
          await downloadFileToBase64('https://example.com/x.png'),
          false
        );
      } finally {
        axiosModule.get = originalGet;
      }
    });
  });

  describe('getUntilOk', function () {
    it('defaults to a finite timeout and honors an override', async function () {
      const originalGet = axiosModule.get;
      const captured: any[] = [];
      axiosModule.get = async (_url: string, config: any) => {
        captured.push(config);
        return { status: 200, data: 'ok' };
      };
      try {
        await getUntilOk('https://example.com/m', {});
        assert.strictEqual(captured[0].timeout, DECRYPT_TIMEOUT_MS);

        await getUntilOk('https://example.com/m', { timeout: 123 });
        assert.strictEqual(captured[1].timeout, 123);
      } finally {
        axiosModule.get = originalGet;
      }
    });

    it('returns the first 200 response after a transient failure', async function () {
      this.timeout(15000);
      const originalGet = axiosModule.get;
      let calls = 0;
      axiosModule.get = async () => {
        calls += 1;
        if (calls < 2) {
          throw new Error('HTTP 500');
        }
        return { status: 200, data: 'ok' };
      };
      try {
        const res = await getUntilOk('https://example.com/m', {}, 3);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(calls, 2);
      } finally {
        axiosModule.get = originalGet;
      }
    });

    it('retries a real rejected status and gives up after maxAttempts', async function () {
      this.timeout(15000);
      let requests = 0;
      const server = http.createServer((_req, res) => {
        requests += 1;
        res.writeHead(500);
        res.end('nope');
      });
      const port = await listen(server);
      try {
        await assert.rejects(getUntilOk(`http://127.0.0.1:${port}/m`, {}, 2));
        assert.strictEqual(requests, 2);
      } finally {
        close(server);
      }
    });

    it('aborts a stalled response instead of hanging', async function () {
      this.timeout(15000);
      const server = http.createServer(() => {
        // Accept the connection but never respond.
      });
      const port = await listen(server);
      try {
        const started = Date.now();
        await assert.rejects(
          getUntilOk(`http://127.0.0.1:${port}/m`, { timeout: 200 }, 2)
        );
        assert.ok(
          Date.now() - started < 8000,
          'a stalled response must be aborted, not awaited forever'
        );
      } finally {
        close(server);
      }
    });
  });
});
