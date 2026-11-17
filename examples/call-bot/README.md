# Call bot

Answers every incoming call, plays a greeting and records the call to a WAV
file. Send `!call` to the bot and it calls you back.

```sh
npm run build          # in the repository root
cd examples/call-bot
npm start
# or, with your own greeting (file path or http(s) URL)
WELCOME_AUDIO=./welcome.mp3 npm start
```

## How it works

- `client.onIncomingCall` → `startCallRecording()` and
  `acceptCall(id, { video: false, audioInjection: true })`
- `client.onCallAccepted` → `playCallAudio(file)` or `pushCallAudio(pcm)`
- `client.onCallEnded` → `stopCallRecording('call-<id>.wav')`

Audio injection, capture and recording are valid for a single call, so they are
enabled again before each call is accepted or started.

## Video

Audio injection only replaces the microphone: video uses the real camera. When
there is no camera, or Chrome has no permission to use it, the call drops a few
seconds after it is answered. The bot answers every call with `video: false`.
To send video without a camera, start the browser with fake devices.
`browserArgs` replaces the default flags, so keep the autoplay one used to play
the call audio:

```js
create({
  session: 'call-bot',
  browserArgs: [
    '--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
  ],
});
```

Errors keep the code sent by WA-JS, e.g. `error.code === 'call_not_found'`.
