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
