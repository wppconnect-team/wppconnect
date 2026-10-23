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
import { runInNewContext } from 'vm';
import { Page } from 'puppeteer';
import { HostLayer } from '../api/layers/host.layer';
import { defaultOptions } from '../config/create-config';
import { isInsideChat } from '../controllers/auth';

class SessionPage {
  registered = false;
  ready = true;
  evaluations = 0;
  isClosed() {
    return false;
  }
  async evaluate(fn: () => unknown) {
    this.evaluations++;
    return runInNewContext(`(${fn.toString()})()`, {
      WPP: {
        conn: {
          isRegistered: () => this.registered,
          isMainReady: () => this.ready,
        },
      },
    });
  }
}

class SessionHost extends HostLayer {
  errors: string[] = [];
  protected async initialize() {}
  protected log(_level?: string, message?: unknown) {
    if (message) this.errors?.push(String(message));
  }
  checkChat() {
    return this.checkInChat();
  }
  get inChat() {
    return this.isInChat;
  }
  begin() {
    this.isStarted = true;
    this.isLogged = true;
  }
}

describe('QR session chat readiness', () => {
  it('loads the current WhatsApp version by default instead of an unavailable pin', () => {
    assert.strictEqual(defaultOptions.whatsappVersion, '');
    const page = new SessionPage();
    const client = new SessionHost(page as unknown as Page, 'current-version');
    assert.strictEqual(client.options.whatsappVersion, '');
  });

  it('preserves an explicit WhatsApp version override', () => {
    const page = new SessionPage();
    const version = '2.3000.1051471615';
    const client = new SessionHost(page as unknown as Page, 'pinned-version', {
      whatsappVersion: version,
    });
    assert.strictEqual(client.options.whatsappVersion, version);
  });
  it('does not fail login when a status callback throws during the readiness poll', async () => {
    const page = new SessionPage();
    page.registered = true;
    const client = new SessionHost(page as unknown as Page, 'throwing-status');
    client.statusFind = () => {
      throw new Error('status callback failed');
    };
    client.begin();
    assert.strictEqual(await client.waitForInChat(), true);
    assert.ok(
      client.errors.some((message) =>
        message.includes('status callback failed')
      )
    );
  });
  it('reports real chat entry when registration completes after the early ready event', async () => {
    const page = new SessionPage();
    page.registered = true;
    const client = new SessionHost(page as unknown as Page, 'paired');
    const statuses: string[] = [];
    client.statusFind = (status) => statuses.push(status);
    client.begin();
    assert.strictEqual(await client.waitForInChat(), true);
    assert.deepStrictEqual(statuses, ['inChat']);
  });

  it('emits one inChat notification when the event and readiness poll both observe readiness', async () => {
    const page = new SessionPage();
    page.registered = true;
    const client = new SessionHost(page as unknown as Page, 'deduplicated');
    const statuses: string[] = [];
    client.statusFind = (status) => statuses.push(status);
    await client.checkChat();
    await client.checkChat();
    assert.deepStrictEqual(statuses, ['inChat']);
  });
  it('does not emit inChat for an unpaired session with a latched main_ready', async () => {
    const page = new SessionPage();
    const client = new SessionHost(page as unknown as Page, 'unpaired');
    const statuses: string[] = [];
    client.statusFind = (status) => statuses.push(status);
    await client.checkChat();
    assert.strictEqual(client.inChat, false);
    assert.deepStrictEqual(statuses, []);
  });

  it('requires registration and ready state together in one page evaluation', async () => {
    const page = new SessionPage();
    assert.strictEqual(await isInsideChat(page as unknown as Page), false);
    page.registered = true;
    page.ready = false;
    assert.strictEqual(await isInsideChat(page as unknown as Page), false);
    page.ready = true;
    assert.strictEqual(await isInsideChat(page as unknown as Page), true);
    page.registered = false;
    assert.strictEqual(await isInsideChat(page as unknown as Page), false);
    assert.strictEqual(page.evaluations, 4);
  });
});
