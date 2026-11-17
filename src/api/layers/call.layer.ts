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

import * as fs from 'fs';
import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import {
  downloadFileToBase64,
  evaluateWithErrorCode,
  fileToBase64,
} from '../helpers';
import {
  AcceptCallOptions,
  CallInfo,
  CallOptions,
  CallRecordingOptions,
  CreateCallLinkOptions,
  JoinCallLinkOptions,
  PlayCallAudioOptions,
  PushCallAudioOptions,
} from '../model';
import { ControlsLayer } from './controls.layer';

/**
 * Voice and video calls.
 *
 * Audio injection, capture and recording are armed for a single call: the
 * active one, or the next one to start. They are released when that call ends,
 * so enable them again before each {@link CallLayer.call},
 * {@link CallLayer.acceptCall} or {@link CallLayer.joinCallLink}.
 *
 * Audio injection only replaces the microphone: video uses the real camera.
 * Without a camera, or without the camera permission (Chrome asks for it and
 * the call drops), accept with `video: false` or start the browser with
 * `--use-fake-ui-for-media-stream` and `--use-fake-device-for-media-stream`.
 *
 * Errors keep the `code` sent by WA-JS (e.g. `call_not_found`,
 * `call_start_in_progress`, `invalid_call_link`).
 */
export class CallLayer extends ControlsLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Runs a WA-JS call function that resolves to a CallModel and returns a
   * plain snapshot of it
   */
  private async startCall(
    method: 'offer' | 'offerGroup' | 'joinCallLink' | 'getActiveCall',
    args: any[],
    audioInjection?: boolean
  ): Promise<CallInfo | null> {
    return evaluateWithErrorCode(
      this.page,
      ({ method, args, audioInjection }) => {
        if (audioInjection) {
          WPP.call.enableAudioInjection(true);
        }
        return Promise.resolve((WPP.call as any)[method](...args)).then(
          (call: any) => {
            if (!call) {
              return null;
            }
            const wid = (w: any) =>
              w ? w._serialized || w.toString() : undefined;
            return {
              id: call.id,
              peerJid: wid(call.peerJid),
              groupJid: wid(call.groupJid),
              isGroup: !!call.isGroup,
              isVideo: !!call.isVideo,
              isOutgoing: !!call.outgoing,
              isCallLink: !!call.isCallLink,
            };
          }
        );
      },
      { method, args, audioInjection: !!audioInjection }
    );
  }

  /**
   * Starts a voice or video call
   *
   * @category Call
   * @example
   * ```javascript
   * const call = await client.call('5511999999999@c.us', { audioInjection: true });
   * await client.playCallAudio('./welcome.mp3');
   * ```
   * @param to Contact ID
   * @returns The started call, or null if WhatsApp did not create it in time
   */
  public async call(to: string, options: CallOptions = {}) {
    return this.startCall(
      'offer',
      [to, { isVideo: !!options.isVideo }],
      options.audioInjection
    );
  }

  /**
   * Starts a group call, from a group ID or a list of contacts
   *
   * @category Call
   * @example
   * ```javascript
   * await client.callGroup(['5511999999999@c.us', '5511988888888@c.us']);
   * ```
   */
  public async callGroup(to: string | string[], options: CallOptions = {}) {
    return this.startCall(
      'offerGroup',
      [to, { isVideo: !!options.isVideo }],
      options.audioInjection
    );
  }

  /**
   * Accepts an incoming call
   *
   * Video calls are accepted with the camera on by default, which needs a
   * camera (see {@link CallLayer}). Pass `video: false` to answer with audio only.
   *
   * @category Call
   * @example
   * ```javascript
   * client.onIncomingCall(async (call) => {
   *   await client.acceptCall(call.id, { video: false, audioInjection: true });
   * });
   * ```
   * @param callId Call ID, defaults to the ringing call
   */
  public async acceptCall(
    callId?: string,
    options: AcceptCallOptions = {}
  ): Promise<boolean> {
    const { audioInjection, ...acceptOptions } = options;
    return evaluateWithErrorCode(
      this.page,
      ({ callId, acceptOptions, audioInjection }) => {
        if (audioInjection) {
          WPP.call.enableAudioInjection(true);
        }
        return WPP.call.accept(callId || undefined, acceptOptions);
      },
      { callId, acceptOptions, audioInjection: !!audioInjection }
    );
  }

  /**
   * Rejects a call received via WhatsApp
   *
   * @category Call
   * @example
   * ```javascript
   * client.onIncomingCall((call) => client.rejectCall(call.id));
   * ```
   * @param callId Call ID, defaults to the ringing call
   */
  public async rejectCall(callId?: string): Promise<boolean> {
    return evaluateWithErrorCode(
      this.page,
      ({ callId }) => WPP.call.rejectCall(callId || undefined),
      { callId }
    );
  }

  /**
   * Ends a call
   *
   * @category Call
   * @example
   * ```javascript
   * await client.endCall();
   * ```
   * @param callId Call ID, defaults to the active call
   */
  public async endCall(callId?: string): Promise<boolean> {
    return evaluateWithErrorCode(
      this.page,
      ({ callId }) => WPP.call.end(callId || undefined),
      { callId }
    );
  }

  /**
   * Returns the active call, if any
   *
   * @category Call
   * @example
   * ```javascript
   * const call = await client.getActiveCall();
   * ```
   */
  public async getActiveCall() {
    return this.startCall('getActiveCall', []);
  }

  /**
   * Returns the details of a call reported by WhatsApp
   * (duration, participants, ...)
   *
   * @category Call
   * @example
   * ```javascript
   * const info = await client.getCallInfo();
   * ```
   * @param callId Call ID, defaults to the active call
   */
  public async getCallInfo(callId?: string): Promise<any> {
    return evaluateWithErrorCode(
      this.page,
      ({ callId }) => WPP.call.getCallInfo(callId || undefined),
      { callId }
    );
  }

  /**
   * Mutes or unmutes the microphone in a call
   *
   * @category Call
   * @example
   * ```javascript
   * await client.setCallMute(true);
   * ```
   */
  public async setCallMute(muted: boolean, callId?: string): Promise<boolean> {
    return evaluateWithErrorCode(
      this.page,
      ({ muted, callId }) => WPP.call.setMute(muted, callId || undefined),
      { muted, callId }
    );
  }

  /**
   * Turns the camera on or off in a call, the camera must be available
   * (see {@link CallLayer})
   *
   * @category Call
   * @example
   * ```javascript
   * await client.setCallVideo(false);
   * ```
   */
  public async setCallVideo(
    enabled: boolean,
    callId?: string
  ): Promise<boolean> {
    return evaluateWithErrorCode(
      this.page,
      ({ enabled, callId }) =>
        WPP.call.setVideoEnabled(enabled, callId || undefined),
      { enabled, callId }
    );
  }

  /**
   * Sends a reaction in a call, an empty string clears it
   *
   * @category Call
   * @example
   * ```javascript
   * await client.sendCallReaction('👍');
   * ```
   */
  public async sendCallReaction(
    emoji: string,
    callId?: string
  ): Promise<boolean> {
    return evaluateWithErrorCode(
      this.page,
      ({ emoji, callId }) => WPP.call.sendReaction(emoji, callId || undefined),
      { emoji, callId }
    );
  }

  /**
   * Raises or lowers the hand in a group call
   *
   * @category Call
   * @example
   * ```javascript
   * await client.raiseCallHand(true);
   * ```
   */
  public async raiseCallHand(
    raised: boolean,
    callId?: string
  ): Promise<boolean> {
    return evaluateWithErrorCode(
      this.page,
      ({ raised, callId }) => WPP.call.raiseHand(raised, callId || undefined),
      { raised, callId }
    );
  }

  /**
   * Creates a call link
   *
   * @category Call
   * @example
   * ```javascript
   * const link = await client.createCallLink({ isVideo: true });
   * // https://call.whatsapp.com/video/...
   * ```
   */
  public async createCallLink(
    options: CreateCallLinkOptions = {}
  ): Promise<string> {
    return evaluateWithErrorCode(
      this.page,
      ({ options }) => WPP.call.createCallLink(options),
      { options }
    );
  }

  /**
   * Joins a call from a call link
   *
   * @category Call
   * @example
   * ```javascript
   * await client.joinCallLink('https://call.whatsapp.com/voice/xxxx');
   * ```
   */
  public async joinCallLink(link: string, options: JoinCallLinkOptions = {}) {
    return this.startCall(
      'joinCallLink',
      [link, { isVideo: options.isVideo }],
      options.audioInjection
    );
  }

  /**
   * Replaces the microphone of the next (or active) call with audio sent by
   * {@link CallLayer.playCallAudio} and {@link CallLayer.pushCallAudio}.
   * Call it before starting or accepting each call.
   *
   * @category Call
   * @example
   * ```javascript
   * await client.enableCallAudioInjection();
   * await client.acceptCall();
   * ```
   */
  public async enableCallAudioInjection(enabled = true): Promise<void> {
    await evaluateWithErrorCode(
      this.page,
      ({ enabled }) => WPP.call.enableAudioInjection(enabled),
      { enabled }
    );
  }

  /**
   * @category Call
   * @returns Whether audio injection is enabled
   */
  public async isCallAudioInjectionEnabled(): Promise<boolean> {
    return evaluateWithErrorCode(this.page, () =>
      WPP.call.isAudioInjectionEnabled()
    );
  }

  /**
   * Plays an audio file in the call, resolving when it finishes or is stopped
   *
   * @category Call
   * @example
   * ```javascript
   * await client.playCallAudio('./welcome.mp3');
   * await client.playCallAudio('https://example.com/welcome.ogg', { volume: 0.5 });
   * await client.playCallAudio(fs.readFileSync('./welcome.wav'));
   * ```
   * @param source File path, http(s) URL, data URL or Buffer with the file content
   */
  public async playCallAudio(
    source: string | Buffer,
    options: PlayCallAudioOptions = {}
  ): Promise<void> {
    const dataUrl = await this.toAudioDataUrl(source);
    await evaluateWithErrorCode(
      this.page,
      ({ dataUrl, options }) => WPP.call.playAudio(dataUrl, options),
      { dataUrl, options }
    );
  }

  /**
   * Streams raw PCM audio to the call (TTS, voice bots).
   * Chunks are played back to back.
   *
   * @category Call
   * @example
   * ```javascript
   * // pcm: Buffer with 16-bit little-endian mono samples at 16 kHz
   * const queued = await client.pushCallAudio(pcm);
   * ```
   * @param pcm Int16 little-endian mono samples, as Buffer, Int16Array or base64
   * @returns Seconds of audio still queued
   */
  public async pushCallAudio(
    pcm: Buffer | Int16Array | string,
    options: PushCallAudioOptions = {}
  ): Promise<number> {
    let samples: string;
    if (typeof pcm === 'string') {
      samples = pcm;
    } else if (Buffer.isBuffer(pcm)) {
      samples = pcm.toString('base64');
    } else {
      samples = Buffer.from(
        pcm.buffer,
        pcm.byteOffset,
        pcm.byteLength
      ).toString('base64');
    }

    return evaluateWithErrorCode(
      this.page,
      ({ samples, options }) => WPP.call.pushAudio(samples, options),
      { samples, options }
    );
  }

  /**
   * Stops the audio being played or streamed to the call
   *
   * @category Call
   * @example
   * ```javascript
   * await client.stopCallAudio();
   * ```
   */
  public async stopCallAudio(): Promise<void> {
    await evaluateWithErrorCode(this.page, () => WPP.call.stopAudio());
  }

  /**
   * Starts recording the next (or active) call.
   * Call it before starting or accepting each call.
   *
   * @category Call
   * @example
   * ```javascript
   * await client.startCallRecording({ source: 'both' });
   * ```
   */
  public async startCallRecording(
    options: CallRecordingOptions = {}
  ): Promise<void> {
    await evaluateWithErrorCode(
      this.page,
      ({ options }) => WPP.call.startRecording(options),
      { options }
    );
  }

  /**
   * @category Call
   * @returns Whether a call is being recorded
   */
  public async isCallRecording(): Promise<boolean> {
    return evaluateWithErrorCode(this.page, () => WPP.call.isRecording());
  }

  /**
   * Stops the recording. It still works after the call has ended.
   *
   * @category Call
   * @example
   * ```javascript
   * client.onCallEnded(async () => {
   *   await client.stopCallRecording('./call.wav');
   * });
   * ```
   * @param filePath Where to save the WAV file (optional)
   * @returns WAV file content (16 kHz, mono, 16-bit)
   */
  public async stopCallRecording(filePath?: string): Promise<Buffer> {
    const base64 = await evaluateWithErrorCode(this.page, () =>
      WPP.call.stopRecording({ format: 'base64' })
    );
    const wav = Buffer.from(base64, 'base64');
    if (filePath) {
      await fs.promises.writeFile(filePath, wav);
    }
    return wav;
  }

  /**
   * Converts a file path, URL or Buffer to a data URL, so the page does not
   * need to reach the file (and is not blocked by its CSP)
   */
  private async toAudioDataUrl(source: string | Buffer): Promise<string> {
    if (Buffer.isBuffer(source)) {
      if (source.length) {
        return `data:application/octet-stream;base64,${source.toString(
          'base64'
        )}`;
      }
    } else if (source.startsWith('data:')) {
      return source;
    } else {
      const data =
        (await downloadFileToBase64(source, [
          /^audio\//,
          /^video\//,
          'application/octet-stream',
        ])) || (await fileToBase64(source));
      if (data) {
        return data;
      }
    }

    throw Object.assign(new Error('Empty or invalid audio source'), {
      code: 'empty_file',
    });
  }
}
