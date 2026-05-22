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
import * as fs from 'fs';
import * as http from 'http';
import * as net from 'net';
import { Readable } from 'stream';

interface Entry {
  source: string | Buffer;
  mimeType: string;
}

/**
 * Minimal HTTP server bound exclusively to 127.0.0.1 that bridges large files
 * from Node.js to the Puppeteer browser context without serialising them
 * through the Chrome DevTools Protocol (issue #2413).
 *
 * Each registered source gets a single-use UUID token.  The token is consumed
 * on the first byte written to the response, so a second request returns 404.
 *
 * Two source types are supported:
 *   - `string` — file path, streamed from disk via `fs.createReadStream`
 *   - `Buffer` — in-memory bytes, streamed via `Readable.from`
 *
 * Create an instance via the async factory {@link LocalFileServer.create}.
 */
export class LocalFileServer {
  private constructor(
    private readonly server: http.Server,
    private readonly port: number,
    private readonly entries: Map<string, Entry>
  ) {}

  /**
   * Starts the server on an ephemeral port bound to 127.0.0.1 and returns the
   * ready-to-use instance.
   */
  static async create(): Promise<LocalFileServer> {
    const entries = new Map<string, Entry>();

    const server = http.createServer((req, res) => {
      const token = (req.url ?? '').replace(/^\//, '');
      const entry = entries.get(token);

      if (!entry) {
        res.writeHead(404);
        res.end();
        return;
      }

      // Consume the token before streaming so a concurrent retry gets 404.
      entries.delete(token);

      res.writeHead(200, {
        'Content-Type': entry.mimeType,
        'Access-Control-Allow-Origin': '*',
      });

      const stream =
        typeof entry.source === 'string'
          ? fs.createReadStream(entry.source)
          : Readable.from(entry.source);

      stream.pipe(res);
    });

    const port = await new Promise<number>((resolve, reject) => {
      server.listen(0, '127.0.0.1', () =>
        resolve((server.address() as net.AddressInfo).port)
      );
      server.once('error', reject);
    });

    return new LocalFileServer(server, port, entries);
  }

  /**
   * Registers a source and returns the single-use URL the browser should fetch.
   *
   * @param source   File path (string) or decoded bytes (Buffer).
   * @param mimeType MIME type sent in the `Content-Type` response header.
   */
  register(
    source: string | Buffer,
    mimeType = 'application/octet-stream'
  ): string {
    const token = crypto.randomUUID();
    this.entries.set(token, { source, mimeType });
    return `http://127.0.0.1:${this.port}/${token}`;
  }

  /** Stops the server and discards any pending tokens. */
  stop(): void {
    this.entries.clear();
    this.server.close();
  }
}
