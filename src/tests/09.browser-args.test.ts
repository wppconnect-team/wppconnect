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

import { defaultOptions } from '../config/create-config';
import { puppeteerConfig } from '../config/puppeteer.config';
import { initBrowser, resolveBrowserArgs } from '../controllers/browser';

const silentLogger: any = { log: () => undefined, warn: () => undefined };

describe('browser launch args', function () {
  it('falls back to the hardened chromium args when none are given', function () {
    assert.deepStrictEqual(resolveBrowserArgs(undefined), [
      ...puppeteerConfig.chromiumArgs,
    ]);
    assert.deepStrictEqual(resolveBrowserArgs([]), [
      ...puppeteerConfig.chromiumArgs,
    ]);
  });

  it('uses the caller args when a non-empty list is provided', function () {
    assert.deepStrictEqual(resolveBrowserArgs(['--foo', '--bar']), [
      '--foo',
      '--bar',
    ]);
  });

  it('does not let the default config shadow the hardened args', function () {
    const args = resolveBrowserArgs(defaultOptions.browserArgs);

    assert.ok(
      args.includes('--no-sandbox'),
      'default launch args must include --no-sandbox'
    );
    assert.ok(
      args.includes('--disable-dev-shm-usage'),
      'default launch args must include --disable-dev-shm-usage'
    );
  });

  it('returns a copy so callers can push without mutating the source', function () {
    const source = ['--x'];
    const args = resolveBrowserArgs(source);
    args.push('--proxy-server=http://localhost');
    assert.deepStrictEqual(source, ['--x']);

    const fallback = resolveBrowserArgs(undefined);
    fallback.push('--y');
    assert.ok(!puppeteerConfig.chromiumArgs.includes('--y'));
  });

  it('passes the resolved args to puppeteer.launch', async function () {
    const puppeteerModule = require('puppeteer-extra');
    const originalLaunch = puppeteerModule.launch;
    const launches: any[] = [];
    puppeteerModule.launch = async (opts: any) => {
      launches.push(opts);
      return { process: () => ({ spawnargs: [] }) };
    };

    try {
      await initBrowser(
        'args-smoke-default',
        { browserWS: '', headless: true } as any,
        silentLogger
      );
      assert.deepStrictEqual(launches[0].args, [
        ...puppeteerConfig.chromiumArgs,
      ]);

      await initBrowser(
        'args-smoke-custom',
        { browserWS: '', headless: true, browserArgs: ['--foo'] } as any,
        silentLogger
      );
      assert.deepStrictEqual(
        launches[1].args,
        ['--foo'],
        'a custom browserArgs list must fully replace the default'
      );
    } finally {
      puppeteerModule.launch = originalLaunch;
    }
  });
});
