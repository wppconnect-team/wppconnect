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
import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { runInNewContext } from 'vm';

import { CallLayer } from '../api/layers/call.layer';

class FakeWPPError extends Error {
  constructor(
    readonly code: string,
    message: string,
    extra: { [key: string]: any } = {}
  ) {
    super(message);
    Object.assign(this, extra);
  }
}

/**
 * Builds a CallLayer whose page runs the evaluated code against a fake WPP
 */
function callLayer(call: { [key: string]: (...args: any[]) => any }) {
  const window: any = {};
  const context = { WPP: { call }, window };
  const layer = Object.assign(Object.create(CallLayer.prototype), {
    listenerEmitter: new EventEmitter(),
    log: () => {},
    page: {
      async evaluate(
        callback: string | ((...args: any[]) => any),
        ...args: any[]
      ) {
        if (typeof callback === 'string') {
          return runInNewContext(callback, context);
        }
        return runInNewContext(`(${callback.toString()})(...args)`, {
          ...context,
          args,
        });
      },
    },
  }) as CallLayer;
  return { layer, window };
}

describe('CallLayer', function () {
  it('passes the arguments to WA-JS', async function () {
    const calls: any[] = [];
    const record =
      (name: string) =>
      (...args: any[]) => {
        calls.push([name, ...args]);
        return true;
      };
    const { layer } = callLayer({
      accept: record('accept'),
      setMute: record('setMute'),
      end: record('end'),
      enableAudioInjection: record('enableAudioInjection'),
    });

    assert.strictEqual(
      await layer.acceptCall('CALL1', { video: false, audioInjection: true }),
      true
    );
    await layer.setCallMute(true);
    await layer.endCall('CALL1');

    assert.deepStrictEqual(JSON.parse(JSON.stringify(calls)), [
      ['enableAudioInjection', true],
      ['accept', 'CALL1', { video: false }],
      ['setMute', true, null],
      ['end', 'CALL1'],
    ]);
  });

  it('returns a plain snapshot of the started call', async function () {
    let offerArgs: any[] = [];
    const wid = (id: string) => ({ _serialized: id, toString: () => id });
    const { layer } = callLayer({
      offer: async (...args: any[]) => {
        offerArgs = args;
        return {
          id: 'CALL1',
          peerJid: wid('5511999999999@c.us'),
          isGroup: false,
          isVideo: true,
          outgoing: true,
          collection: { circular: true },
        };
      },
    });

    const call = await layer.call('5511999999999@c.us', { isVideo: true });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(offerArgs)), [
      '5511999999999@c.us',
      { isVideo: true },
    ]);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(call)), {
      id: 'CALL1',
      peerJid: '5511999999999@c.us',
      isGroup: false,
      isVideo: true,
      isOutgoing: true,
      isCallLink: false,
    });
  });

  it('returns null when there is no active call', async function () {
    const { layer } = callLayer({ getActiveCall: () => undefined });

    assert.strictEqual(await layer.getActiveCall(), null);
  });

  it('keeps the WA-JS error code', async function () {
    const { layer } = callLayer({
      end: async () => {
        throw new FakeWPPError('call_not_found', 'Call not found', {
          callId: 'CALL1',
        });
      },
    });

    await assert.rejects(layer.endCall('CALL1'), (e: any) => {
      assert.strictEqual(Object.prototype.toString.call(e), '[object Error]');
      assert.strictEqual(e.message, 'Call not found');
      assert.strictEqual(e.code, 'call_not_found');
      assert.strictEqual(e.callId, 'CALL1');
      return true;
    });
  });

  describe('media', function () {
    let tmpDir: string;

    before(async function () {
      tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'wpp-call-'));
    });

    after(async function () {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    });

    it('sends a Buffer and a file to playAudio as data URL', async function () {
      const sources: string[] = [];
      const { layer } = callLayer({
        playAudio: async (source: string) => {
          sources.push(source);
        },
      });
      const file = path.join(tmpDir, 'hello.wav');
      await fs.promises.writeFile(file, Buffer.from('RIFF-file'));

      await layer.playCallAudio(Buffer.from('RIFF-buffer'));
      await layer.playCallAudio(file);

      assert.deepStrictEqual(sources, [
        `data:application/octet-stream;base64,${Buffer.from(
          'RIFF-buffer'
        ).toString('base64')}`,
        `data:audio/wav;base64,${Buffer.from('RIFF-file').toString('base64')}`,
      ]);
    });

    it('rejects an invalid audio source with empty_file', async function () {
      const { layer } = callLayer({ playAudio: async () => {} });

      await assert.rejects(
        layer.playCallAudio(path.join(tmpDir, 'missing.mp3')),
        (e: any) => e.code === 'empty_file'
      );
    });

    it('sends Int16 PCM to pushAudio as base64', async function () {
      let pushed: any[] = [];
      const { layer } = callLayer({
        pushAudio: (samples: string, options: any) => {
          pushed = [samples, options];
          return 0.5;
        },
      });
      const pcm = new Int16Array([1, -1, 32767]);

      assert.strictEqual(
        await layer.pushCallAudio(pcm, { sampleRate: 24000 }),
        0.5
      );
      assert.deepStrictEqual(JSON.parse(JSON.stringify(pushed)), [
        Buffer.from(pcm.buffer).toString('base64'),
        { sampleRate: 24000 },
      ]);
    });

    it('saves the recording to disk', async function () {
      const wav = Buffer.from('RIFF....WAVEfmt ');
      const { layer } = callLayer({
        stopRecording: (options: any) => {
          assert.strictEqual(options.format, 'base64');
          return wav.toString('base64');
        },
      });
      const file = path.join(tmpDir, 'call.wav');

      const result = await layer.stopCallRecording(file);

      assert.ok(result.equals(wav));
      assert.ok((await fs.promises.readFile(file)).equals(wav));
    });
  });

  describe('onCallAudioFrame', function () {
    it('only captures while there are listeners', async function () {
      const capture: any[] = [];
      const { layer, window } = callLayer({
        enableAudioCapture: (options: any) => {
          capture.push(JSON.parse(JSON.stringify(options)));
        },
      });

      const first = layer.onCallAudioFrame(() => {});
      const second = layer.onCallAudioFrame(() => {}, { source: 'remote' });
      await new Promise((resolve) => setImmediate(resolve));
      assert.strictEqual(window.__wppconnectCallFrames, true);

      first.dispose();
      await new Promise((resolve) => setImmediate(resolve));
      assert.strictEqual(window.__wppconnectCallFrames, true);

      second.dispose();
      await new Promise((resolve) => setImmediate(resolve));
      assert.strictEqual(window.__wppconnectCallFrames, false);

      assert.deepStrictEqual(capture, [
        { format: 'int16-base64', source: 'both' },
        false,
      ]);
    });

    it('filters the frames by source', async function () {
      const { layer } = callLayer({ enableAudioCapture: () => {} });
      const received: string[] = [];
      layer.onCallAudioFrame((frame) => received.push(frame.source), {
        source: 'remote',
      });

      const emitter: EventEmitter = (layer as any).listenerEmitter;
      emitter.emit('onCallAudioFrame', { source: 'local' });
      emitter.emit('onCallAudioFrame', { source: 'remote' });

      assert.deepStrictEqual(received, ['remote']);
    });
  });
});
