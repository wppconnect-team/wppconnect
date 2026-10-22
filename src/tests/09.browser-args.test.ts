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

const protectionFlags = puppeteerConfig.protectionDisablingChromiumArgs;

function assertNoProtectionFlags(args: string[]) {
  for (const flag of protectionFlags) {
    assert.ok(
      !args.includes(flag),
      `the default launch args must not include ${flag}`
    );
  }
}

describe('browser launch args', function () {
  it('falls back to the default chromium args when none are given', function () {
    for (const requested of [undefined, []]) {
      const args = resolveBrowserArgs(requested);

      assert.deepStrictEqual(args, [...puppeteerConfig.chromiumArgs]);
      assert.ok(args.includes('--disable-dev-shm-usage'));
      assert.ok(args.includes('--disable-gpu'));
      assertNoProtectionFlags(args);
    }
  });

  it('uses the caller args when a non-empty list is provided', function () {
    assert.deepStrictEqual(resolveBrowserArgs(['--foo', '--bar']), [
      '--foo',
      '--bar',
    ]);
  });

  it('does not let the default config shadow the default args', function () {
    assert.strictEqual(defaultOptions.browserArgs, undefined);

    const args = resolveBrowserArgs(defaultOptions.browserArgs);

    assert.ok(args.includes('--disable-dev-shm-usage'));
    assertNoProtectionFlags(args);
  });

  it('merges the protection-disabling flags only when explicitly enabled', function () {
    const args = resolveBrowserArgs(undefined, true);

    for (const flag of protectionFlags) {
      assert.ok(args.includes(flag), `opt-in args must include ${flag}`);
    }

    const custom = resolveBrowserArgs(['--foo', '--no-sandbox'], true);
    assert.strictEqual(
      custom.filter((arg) => arg === '--no-sandbox').length,
      1,
      'opt-in merging must not duplicate an argument'
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
      assertNoProtectionFlags(launches[0].args);

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

      await initBrowser(
        'args-smoke-opt-in',
        {
          browserWS: '',
          headless: true,
          useInsecureChromiumArgs: true,
        } as any,
        silentLogger
      );
      for (const flag of protectionFlags) {
        assert.ok(
          launches[2].args.includes(flag),
          `the opt-in launch must include ${flag}`
        );
      }
    } finally {
      puppeteerModule.launch = originalLaunch;
    }
  });
});
