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
import { Page } from 'puppeteer';
import { HostLayer } from '../api/layers/host.layer';

class TestHostLayer extends HostLayer {
  private qrSequence = 0;

  public async registerPageListeners() {
    await this.afterPageScriptInjected();
  }

  public forwardLinkCode(code: string) {
    this.onLinkCode(code);
  }

  public scanQrCode() {
    return this.checkQrCode();
  }

  public async getQrCode() {
    this.qrSequence++;
    return {
      base64Image: `qr-image-${this.qrSequence}`,
      urlCode: `qr-code-${this.qrSequence}`,
    };
  }

  public async getWAVersion() {
    return 'test';
  }

  public async getWAJSVersion() {
    return 'test';
  }

  protected async checkInChat() {}
}

describe('Phone link code lifecycle', function () {
  it('does not regenerate the phone link code when the QR code rotates', async function () {
    const listeners = new Map<string, (...args: any[]) => void>();
    const receivedCodes: string[] = [];
    let generationCalls = 0;

    const page = {
      on: () => page,
      evaluate: async (pageFunction: (...args: any[]) => any, ...args: any[]) =>
        pageFunction(...args),
    } as unknown as Page;

    const client = new TestHostLayer(page, 'phone-link-test', {
      logQR: false,
      phoneNumber: '5511999999999',
    } as any);
    client.catchLinkCode = (code) => receivedCodes.push(code);

    const previousWPP = (globalThis as any).WPP;
    const previousWindow = (globalThis as any).window;

    (globalThis as any).window = {
      checkQrCode: () => client.scanQrCode(),
      checkInChat: () => undefined,
      onLinkCode: (code: string) => client.forwardLinkCode(code),
      onLinkCodeError: () => undefined,
      onLinkCodeExpired: () => undefined,
    };
    (globalThis as any).WPP = {
      on: (event: string, listener: (...args: any[]) => void) =>
        listeners.set(event, listener),
      conn: {
        isRegistered: () => false,
        genLinkDeviceCodeForPhoneNumber: async () => {
          generationCalls++;
          return `LEGACY${generationCalls}`;
        },
        startLinkDeviceCodeForPhoneNumber: async () => {
          generationCalls++;
          listeners.get('conn.link_code_change')?.('INITIAL123');
          return 'INITIAL123';
        },
      },
    };

    try {
      await client.registerPageListeners();

      await listeners.get('conn.auth_code_change')?.('qr-1');
      await listeners.get('conn.auth_code_change')?.('qr-2');
      await listeners.get('conn.auth_code_change')?.('qr-3');

      assert.strictEqual(generationCalls, 1);
      assert.deepStrictEqual(receivedCodes, ['INITIAL123']);

      listeners.get('conn.link_code_change')?.('REFRESH456');
      assert.deepStrictEqual(receivedCodes, ['INITIAL123', 'REFRESH456']);
    } finally {
      (globalThis as any).WPP = previousWPP;
      (globalThis as any).window = previousWindow;
    }
  });
});
