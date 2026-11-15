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
 * Which side of the call audio to capture or record.
 * `local` is what this session sends, `remote` is what the other side sends.
 */
export type CallAudioSource = 'both' | 'remote' | 'local';

/**
 * Plain snapshot of a call, safe to use outside the browser
 */
export interface CallInfo {
  id: string;
  peerJid?: string;
  groupJid?: string;
  isGroup: boolean;
  isVideo: boolean;
  isOutgoing: boolean;
  /** Whether the call was started from a call link */
  isCallLink?: boolean;
}

/**
 * Common payload of the call events
 */
export interface CallEvent {
  id: string;
  peerJid?: string;
  groupJid?: string;
  isGroup: boolean;
  isVideo: boolean;
  isOutgoing: boolean;
}

export interface CallStateChangedEvent extends CallEvent {
  state: number;
  stateName: string;
  previousState?: number;
}

export interface CallEndedEvent extends CallEvent {
  wasConnected: boolean;
  endedByMe?: boolean;
  result?: number;
  /**
   * One of: canceled, missed, unavailable, rejected, connected,
   * accepted_elsewhere, failed, connected_lonely
   */
  resultName?: string;
  /** Total call duration in milliseconds */
  duration?: number;
  /** Connected time in milliseconds */
  activeDuration?: number;
}

export interface CallMuteStateEvent {
  id: string;
  selfMuted?: boolean;
  peerMuted?: boolean;
  participants: { jid?: string; isSelf: boolean; isMuted: boolean }[];
}

export interface CallVideoStateEvent {
  id: string;
  isSelf: boolean;
  jid?: string;
  state: number;
  stateName?: string;
}

/**
 * One frame of call audio: 60 ms of 16 kHz mono PCM
 */
export interface CallAudioFrame {
  id?: string;
  source: 'remote' | 'local';
  sampleRate: number;
  format: 'int16-base64';
  /** Base64 of little-endian Int16 PCM samples */
  samples: string;
  timestamp: number;
}

export interface CallOptions {
  /** Start a video call (default: false), uses the real camera */
  isVideo?: boolean;
  /**
   * Enable audio injection for this call before starting it,
   * so {@link CallLayer.playCallAudio} and {@link CallLayer.pushCallAudio} can be used
   */
  audioInjection?: boolean;
}

export interface AcceptCallOptions {
  /** Send audio (default: true) */
  audio?: boolean;
  /**
   * Send video (default: same as the call), uses the real camera.
   * Use `false` on machines without a camera
   */
  video?: boolean;
  /** Enable audio injection for this call before accepting it */
  audioInjection?: boolean;
}

export interface CreateCallLinkOptions {
  isVideo?: boolean;
  requireApproval?: boolean;
}

export interface JoinCallLinkOptions {
  isVideo?: boolean;
  /** Enable audio injection for this call before joining it */
  audioInjection?: boolean;
}

export interface PlayCallAudioOptions {
  loop?: boolean;
  /** Volume from 0 to 1 (default: 1) */
  volume?: number;
}

export interface PushCallAudioOptions {
  /** Sample rate of the PCM data (default: 16000) */
  sampleRate?: number;
}

export interface CallRecordingOptions {
  /** Which side to record (default: both, mixed) */
  source?: CallAudioSource;
}

export interface CallAudioFrameOptions {
  /** Which side to capture (default: both) */
  source?: CallAudioSource;
}
