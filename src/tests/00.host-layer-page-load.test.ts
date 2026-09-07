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
import { injectApi } from '../controllers/browser';

class FakePage {
  evaluateCalls = 0;
  private listeners = new Map<string, Array<() => void>>();

  on(event: string, listener: () => void) {
    const listeners = this.listeners.get(event) || [];
    listeners.push(listener);
    this.listeners.set(event, listeners);
    return this;
  }

  emit(event: string) {
    for (const listener of this.listeners.get(event) || []) {
      listener();
    }
  }

  async evaluate() {
    this.evaluateCalls += 1;
    return true;
  }

  isClosed() {
    return false;
  }

  async waitForFunction() {
    return true;
  }
}

class DelayedInjectionHostLayer extends HostLayer {
  private completeInjection?: () => void;

  protected log() {}

  protected async afterPageLoad() {
    await new Promise<void>((resolve) => {
      this.completeInjection = resolve;
    });
    this.isInjected = true;
  }

  finishInjection() {
    this.completeInjection?.();
  }
}

describe('HostLayer page reinjection', function () {
  it('waits for the current page injection before evaluating WAPI', async function () {
    const page = new FakePage();
    const client = new DelayedInjectionHostLayer(
      page as unknown as Page,
      'reinjection-test'
    );

    page.emit('load');
    const connected = client.isConnected();
    await Promise.resolve();

    assert.strictEqual(page.evaluateCalls, 0);

    client.finishInjection();
    assert.strictEqual(await connected, true);
    assert.strictEqual(page.evaluateCalls, 1);
  });

  it('propagates a WAPI readiness timeout instead of marking injection complete', async function () {
    const page = {
      evaluate: async () => false,
      addScriptTag: async () => undefined,
      exposeFunction: async () => undefined,
      waitForFunction: async () => {
        throw new Error('WAPI readiness timeout');
      },
    };

    await assert.rejects(
      injectApi(page as unknown as Page),
      /WAPI readiness timeout/
    );
  });
});

class AuthenticationPage extends FakePage {
  constructor(private results: Array<boolean | Error>) {
    super();
  }

  async evaluate() {
    this.evaluateCalls += 1;
    const result = this.results.shift();
    if (result instanceof Error) throw result;
    return result ?? false;
  }
}

class AuthenticationHostLayer extends HostLayer {
  protected log() {}

  begin(logged = false) {
    this.isStarted = true;
    this.isLogged = logged;
  }

  get logged() {
    return this.isLogged;
  }

  readQr() {
    return this.checkQrCode();
  }
}

describe('HostLayer authentication during navigation', function () {
  this.timeout(5000);

  it('keeps waiting for registration after a destroyed execution context', async function () {
    const page = new AuthenticationPage([
      new Error(
        'Execution context was destroyed, most likely because of a navigation.'
      ),
      false,
      true,
    ]);
    const client = new AuthenticationHostLayer(
      page as unknown as Page,
      'navigation'
    );
    client.begin();

    await client.waitForQrCodeScan();

    assert.strictEqual(page.evaluateCalls, 3);
    assert.strictEqual(client.logged, true);
  });

  it('does not mark a QR session authenticated when a QR callback races navigation', async function () {
    const page = new AuthenticationPage([
      new Error('Execution context was destroyed'),
    ]);
    const client = new AuthenticationHostLayer(
      page as unknown as Page,
      'qr-callback'
    );
    client.begin();

    await client.readQr();

    assert.strictEqual(client.logged, false);
  });

  it('waits for the resolved chat readiness value', async function () {
    const page = new AuthenticationPage([false, true]);
    const client = new AuthenticationHostLayer(
      page as unknown as Page,
      'chat-ready'
    );
    client.begin(true);

    assert.strictEqual(await client.waitForInChat(), true);
    assert.strictEqual(page.evaluateCalls, 2);
  });
});
