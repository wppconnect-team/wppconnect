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
import { create } from '../../dist/index.js';

// Optional audio played when a call is answered (file path or http(s) URL).
// Without it, a short tone is streamed with pushCallAudio.
const WELCOME_AUDIO = process.env.WELCOME_AUDIO;

create({
  session: 'call-bot',
  headless: false,
  autoClose: 0,
})
  .then((client) => start(client))
  .catch((error) => {
    console.log(error);
  });

/**
 * One second of a 440 Hz tone, as 16 kHz Int16 PCM
 */
function tone(seconds = 1, frequency = 440, sampleRate = 16000) {
  const pcm = new Int16Array(seconds * sampleRate);
  for (let i = 0; i < pcm.length; i++) {
    pcm[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * 8000;
  }
  return pcm;
}

function start(client) {
  // Answer every call, greet and record it
  client.onIncomingCall(async (call) => {
    console.log('Incoming call from', call.peerJid);
    try {
      // Injection and recording are valid for one call: arm them before accepting
      await client.startCallRecording();
      // Audio only, also for video calls: the bot has no camera
      await client.acceptCall(call.id, { video: false, audioInjection: true });
    } catch (error) {
      console.error('Could not answer the call:', error.code, error.message);
    }
  });

  client.onCallAccepted(async (call) => {
    console.log('Call connected', call.id);
    if (WELCOME_AUDIO) {
      await client.playCallAudio(WELCOME_AUDIO);
    } else {
      await client.pushCallAudio(tone());
    }
  });

  client.onCallMuteState((state) => {
    console.log('Peer muted:', state.peerMuted);
  });

  client.onCallEnded(async (call) => {
    console.log('Call ended:', call.resultName, `${call.duration} ms`);
    if (await client.isCallRecording()) {
      const file = `call-${call.id}.wav`;
      await client.stopCallRecording(file);
      console.log('Recording saved to', file);
    }
  });

  // Send "!call" to the bot to receive a call
  client.onMessage(async (message) => {
    if (message.body === '!call' && !message.isGroupMsg) {
      try {
        await client.call(message.from, { audioInjection: true });
      } catch (error) {
        console.error('Could not start the call:', error.code, error.message);
      }
    }
  });
}
