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
import { ConnectionTransport } from 'puppeteer';
import WebSocket from 'ws';

export class WebSocketTransport implements ConnectionTransport {
  static create(url: string, timeout?: number): Promise<WebSocketTransport> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url, [], {
        perMessageDeflate: false,
        maxPayload: 256 * 1024 * 1024, // 256Mb
        handshakeTimeout: timeout,
      });

      ws.addEventListener('open', () => resolve(new WebSocketTransport(ws)));
      ws.addEventListener('error', reject);
    });
  }

  private _ws: WebSocket;
  onmessage?: (message: string) => void;
  onclose?: () => void;

  constructor(ws: WebSocket) {
    this._ws = ws;
    this._ws.addEventListener('message', (event) => {
      if (this.onmessage) this.onmessage.call(null, event.data);
    });
    this._ws.addEventListener('close', () => {
      if (this.onclose) this.onclose.call(null);
    });
    // Silently ignore all errors - we don't know what to do with them.
    this._ws.addEventListener('error', () => {});
    this.onmessage = null;
    this.onclose = null;
  }

  send(message: string): void {
    this._ws.send(message);
  }

  close(): void {
    this._ws.close();
  }
}
