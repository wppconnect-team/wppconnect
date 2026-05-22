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

/**
 * Regression tests for issue #2413 — large file transfer via CDP timeout.
 *
 * No WhatsApp session is required.  The two describe blocks are independent:
 *
 *   1. LocalFileServer unit tests — pure Node.js, no browser.
 *   2. CDP regression — a real Puppeteer browser against about:blank, proves
 *      that passing large base64 via page.evaluate times out and that the
 *      local-HTTP-server approach avoids the timeout entirely.
 *
 * Run alone with:
 *   npx mocha -r ts-node/register src/tests/06.large-file-transfer.test.ts
 */

import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as tmp from 'tmp';
import { LocalFileServer } from '../api/helpers/local-file-server';

// ── helpers ───────────────────────────────────────────────────────────────────

/** Write SIZE bytes to a temp file using 1 MB chunks (avoids one giant alloc). */
function makeTmpFile(sizeBytes: number, ext = '.bin'): tmp.SynchrounousResult {
  const tmpFile = tmp.fileSync({ postfix: ext });
  const fd = fs.openSync(tmpFile.name, 'w');
  const CHUNK = 1024 * 1024;
  const chunk = Buffer.alloc(CHUNK);
  let remaining = sizeBytes;
  while (remaining > 0) {
    const n = Math.min(remaining, CHUNK);
    fs.writeSync(fd, chunk, 0, n);
    remaining -= n;
  }
  fs.closeSync(fd);
  return tmpFile;
}

// ── 1. LocalFileServer unit tests ─────────────────────────────────────────────

describe('LocalFileServer', function () {
  this.timeout(30_000);

  it('starts on an ephemeral port bound only to 127.0.0.1', async function () {
    const server = await LocalFileServer.create();
    try {
      const url = new URL(server.register('/dev/null'));
      assert.strictEqual(url.hostname, '127.0.0.1');
      assert.ok(parseInt(url.port) > 0, 'port must be a positive integer');
    } finally {
      server.stop();
    }
  });

  it('serves a registered file with the correct Content-Type header', async function () {
    const server = await LocalFileServer.create();

    const tmpFile = tmp.fileSync({ postfix: '.pdf' });
    const content = Buffer.alloc(1024, 0xab);
    fs.writeFileSync(tmpFile.name, content);

    try {
      const url = server.register(tmpFile.name, 'application/pdf');
      const res = await fetch(url);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers.get('content-type'), 'application/pdf');

      const received = Buffer.from(await res.arrayBuffer());
      assert.ok(received.equals(content), 'body content must match exactly');
    } finally {
      server.stop();
      tmpFile.removeCallback();
    }
  });

  it('invalidates token after first request — single-use semantics', async function () {
    const server = await LocalFileServer.create();

    const tmpFile = tmp.fileSync({ postfix: '.bin' });
    fs.writeFileSync(tmpFile.name, Buffer.alloc(64));

    try {
      const url = server.register(tmpFile.name);

      // First request must succeed.
      const r1 = await fetch(url);
      assert.strictEqual(r1.status, 200);
      await r1.arrayBuffer(); // consume the body

      // Second request with the same token must return 404.
      const r2 = await fetch(url);
      assert.strictEqual(
        r2.status,
        404,
        'token must be invalidated after first request'
      );
    } finally {
      server.stop();
      tmpFile.removeCallback();
    }
  });

  it('serves a 70 MB file correctly', async function () {
    this.timeout(60_000);

    const SIZE = 70 * 1024 * 1024;
    const server = await LocalFileServer.create();

    const tmpFile = makeTmpFile(SIZE, '.pdf');

    try {
      const url = server.register(tmpFile.name);
      const res = await fetch(url);

      assert.strictEqual(res.status, 200);
      const buf = Buffer.from(await res.arrayBuffer());
      assert.strictEqual(
        buf.byteLength,
        SIZE,
        'complete file must be received without truncation'
      );
    } finally {
      server.stop();
      tmpFile.removeCallback();
    }
  });
});

// ── 2. CDP regression tests ───────────────────────────────────────────────────
//
// These tests use a real Chromium browser (about:blank) but do NOT require a
// WhatsApp session.  They prove:
//
//   a) passing a large base64 string via page.evaluate() triggers the CDP
//      protocol timeout that users report in issue #2413.
//
//   b) passing a tiny URL string and letting the browser fetch the file via
//      HTTP does not trigger any timeout, regardless of file size.
//
// Calibration (measured on the CI machine with this Chrome build):
//   10 MB →  ~690 ms   |  30 MB → ~1 940 ms
//   60 MB → ~4 856 ms  | 100 MB → crash (Target closed)
//
// We pick FILE_SIZE = 60 MB and PROTOCOL_TIMEOUT = 3 000 ms so that:
//   • the base64 test reliably exceeds the timeout (~4 856 ms >> 3 000 ms)
//   • the URL test completes well within the timeout (URL ≈ 40 chars → <1 ms)
//
// If the "FAIL (bug)" test unexpectedly passes on your machine, increase
// FILE_SIZE or decrease PROTOCOL_TIMEOUT until it fails again.

describe('Large file via CDP (issue #2413 regression)', function () {
  this.timeout(60_000);

  // Must be short enough that the base64 round-trip exceeds it but long
  // enough that normal CDP operations (e.g. page navigation) do not time out.
  const PROTOCOL_TIMEOUT_MS = 3_000;

  // 60 MB binary → ~80 MB base64 string.  Serialising this through a 3 s
  // CDP window reliably fails on every machine we tested.  Increase this
  // constant if your machine is faster and the first test passes.
  const FILE_SIZE = 60 * 1024 * 1024;

  let browser: Browser;

  before(async function () {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        // Allow fetch() from about:blank to http://127.0.0.1 (loopback).
        // Only needed for the isolated test context; not used in production.
        '--disable-web-security',
      ],
      protocolTimeout: PROTOCOL_TIMEOUT_MS,
    });
  });

  after(async function () {
    await browser?.close();
  });

  /** Open a fresh about:blank page for each test to avoid shared state. */
  async function newBlankPage(): Promise<Page> {
    const p = await browser.newPage();
    await p.goto('about:blank');
    return p;
  }

  it('FAIL (bug): passing 30 MB as base64 via page.evaluate times out', async function () {
    const page = await newBlankPage();

    const largeBase64 =
      'data:application/pdf;base64,' +
      Buffer.alloc(FILE_SIZE).toString('base64');

    await assert.rejects(
      () =>
        page.evaluate(({ b }: { b: string }) => b.length, { b: largeBase64 }),
      (err: Error) => {
        // Puppeteer throws one of:
        //   "ProtocolError: Runtime.callFunctionOn timed out …"
        //   "ProtocolError: … Target closed"  (OOM on very large payloads)
        assert.match(
          err.message,
          /timed out|target closed/i,
          `Expected a protocol-timeout or crash error but got: ${err.message}`
        );
        return true;
      }
    );

    await page.close();
  });

  it('PASS (fix): same 60 MB served via local HTTP — no timeout, full data received', async function () {
    const server = await LocalFileServer.create();
    const tmpFile = makeTmpFile(FILE_SIZE, '.pdf');
    const page = await newBlankPage();

    try {
      const url = server.register(tmpFile.name, 'application/pdf');

      // The URL is ~40 chars — trivially within any CDP timeout.
      // The browser fetches the actual bytes over HTTP, bypassing CDP for
      // the data transfer entirely.
      const byteLength = await page.evaluate(
        async ({ u }: { u: string }) => {
          const r = await fetch(u);
          const b = await r.arrayBuffer();
          return b.byteLength;
        },
        { u: url }
      );

      assert.strictEqual(
        byteLength,
        FILE_SIZE,
        'browser must receive the complete file without truncation'
      );
    } finally {
      await page.close();
      server.stop();
      tmpFile.removeCallback();
    }
  });
});
