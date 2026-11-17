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

import { listenIncomingCall } from '../api/helpers/listen-incoming-call';

/**
 * Wid as found in WhatsApp models: serializes to its string
 */
function wid(id: string) {
  return { _serialized: id, toString: () => id, toJSON: () => id };
}

/**
 * Runs the page function against a fake WPP and returns what reached
 * `window.onIncomingCall`
 */
function page(
  options: { callEvents?: boolean; calls?: any[]; activeCall?: any } = {}
) {
  const received: any[] = [];
  const handlers: { [event: string]: ((data: any) => void)[] } = {};
  const legacyCallbacks: any[] = [];
  const store = new Map((options.calls || []).map((call) => [call.id, call]));

  const onIncomingCall: any = (call: any) =>
    received.push(JSON.parse(JSON.stringify(call)));
  const window: any = {
    onIncomingCall,
    WAPI: { onIncomingCall: (cb: any) => legacyCallbacks.push(cb) },
  };
  const WPP = {
    call:
      options.callEvents === false ? {} : { enableAudioInjection: () => {} },
    on: (event: string, handler: (data: any) => void) => {
      (handlers[event] = handlers[event] || []).push(handler);
    },
    whatsapp: {
      CallStore: {
        get: (id: string) => store.get(id),
        activeCall: options.activeCall,
      },
    },
  };

  const run = () =>
    runInNewContext(`(${listenIncomingCall.toString()})()`, { window, WPP });
  run();

  return {
    window,
    received,
    legacyCallbacks,
    run,
    emit: (data: any) =>
      (handlers['call.incoming_call'] || []).forEach((handler) =>
        handler(data)
      ),
    handlers,
  };
}

describe('onIncomingCall listener', function () {
  it('keeps the serializable fields of the call model', function () {
    const { emit, received } = page({
      calls: [
        {
          id: 'CALL1',
          peerJid: wid('5511999999999@c.us'),
          offerTime: 1700000000,
          isVideo: false,
          isGroup: false,
          canHandleLocally: true,
          isSilenced: false,
          offerReceivedWhileOffline: false,
          webClientShouldHandle: true,
          isVoiceChat: false,
          silenceReason: null,
          groupCallParticipants: null,
          // Minified private fields
          $Call$p_1: 3,
          $1: null,
        },
      ],
    });

    emit({
      id: 'CALL1',
      peerJid: wid('5511999999999@c.us'),
      offerTime: 1700000000,
      isVideo: false,
      isGroup: false,
    });

    assert.deepStrictEqual(received, [
      {
        id: 'CALL1',
        peerJid: '5511999999999@c.us',
        offerTime: 1700000000,
        isVideo: false,
        isGroup: false,
        groupJid: null,
        canHandleLocally: true,
        outgoing: false,
        isSilenced: false,
        offerReceivedWhileOffline: false,
        webClientShouldHandle: true,
        isVoiceChat: false,
        silenceReason: null,
        groupCallParticipants: null,
        participants: [],
      },
    ]);
  });

  it('reads the active call, which the native VoIP stack does not add to the collection', function () {
    const { emit, received } = page({
      activeCall: {
        id: 'CALL2',
        isGroup: true,
        groupCallParticipants: [
          wid('5511999999999@c.us'),
          wid('5511988888888@c.us'),
        ],
        groupCallParticipantStates: new Map([
          ['5511999999999@c.us', 1],
          ['5511988888888@c.us', 3],
        ]),
      },
    });

    emit({
      id: 'CALL2',
      peerJid: wid('5511999999999@c.us'),
      groupJid: wid('120363000000000000@g.us'),
      offerTime: 1700000000,
      isVideo: true,
      isGroup: true,
    });

    assert.strictEqual(received[0].groupJid, '120363000000000000@g.us');
    assert.deepStrictEqual(received[0].groupCallParticipants, [
      '5511999999999@c.us',
      '5511988888888@c.us',
    ]);
    assert.deepStrictEqual(received[0].participants, [
      { jid: '5511999999999@c.us', state: 1 },
      { jid: '5511988888888@c.us', state: 3 },
    ]);
  });

  it('keeps the participants of older WhatsApp call models', function () {
    const participants = [
      { id: wid('5511999999999@c.us'), isVideo: false },
      { id: wid('5511988888888@c.us'), isVideo: true },
    ];
    const { emit, received } = page({
      calls: [
        {
          id: 'CALL3',
          isGroup: true,
          participants: { toJSON: () => participants },
          groupCallParticipants: [wid('5511977777777@c.us')],
        },
      ],
    });

    emit({ id: 'CALL3', peerJid: wid('5511999999999@c.us'), isGroup: true });

    assert.deepStrictEqual(received[0].participants, [
      { id: '5511999999999@c.us', isVideo: false },
      { id: '5511988888888@c.us', isVideo: true },
    ]);
  });

  it('sends the event data when the call is not in the store', function () {
    // Another call is active
    const { emit, received } = page({ activeCall: { id: 'OTHER' } });

    emit({
      id: 'CALL4',
      peerJid: wid('5511999999999@c.us'),
      offerTime: 1700000000,
      isVideo: false,
      isGroup: false,
    });

    assert.deepStrictEqual(received, [
      {
        id: 'CALL4',
        peerJid: '5511999999999@c.us',
        offerTime: 1700000000,
        isVideo: false,
        isGroup: false,
        groupJid: null,
        canHandleLocally: false,
        outgoing: false,
        isSilenced: false,
        offerReceivedWhileOffline: false,
        webClientShouldHandle: false,
        participants: [],
      },
    ]);
  });

  it('uses WAPI.onIncomingCall on WA-JS without call events', function () {
    const { window, legacyCallbacks, handlers } = page({ callEvents: false });

    assert.deepStrictEqual(legacyCallbacks, [window.onIncomingCall]);
    assert.strictEqual(handlers['call.incoming_call'], undefined);
    assert.strictEqual(window.onIncomingCall.exposed, true);
  });

  it('registers the listener only once', function () {
    const { emit, received, run } = page();

    run();
    emit({ id: 'CALL5', peerJid: wid('5511999999999@c.us') });

    assert.strictEqual(received.length, 1);
  });
});
