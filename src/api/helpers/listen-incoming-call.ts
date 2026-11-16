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
 * Page function that forwards incoming calls to `window.onIncomingCall`.
 *
 * It runs in the browser, so it must not use anything from its module scope.
 *
 * The native VoIP stack does not add incoming calls to `CallStore` (so `add`
 * is never triggered), so WA-JS with call events is listened through
 * `call.incoming_call`. The payload starts from the
 * same JSON that `page.exposeFunction` sent for the `CallModel` (every
 * serializable field is kept) and fills the `IncomingCall` fields on top.
 */
export function listenIncomingCall() {
  const w = window as any;
  if (typeof w.onIncomingCall !== 'function' || w.onIncomingCall.exposed) {
    return;
  }

  if (typeof (WPP.call as any)?.enableAudioInjection !== 'function') {
    w.WAPI.onIncomingCall(w.onIncomingCall);
    w.onIncomingCall.exposed = true;
    return;
  }

  const wid = (value: any) =>
    value ? value._serialized || value.toString() : null;
  // Minified private fields ($Call$p_1, $1, ...) change on every WhatsApp
  // version, they are not part of the payload
  const toJSON = (value: any) => {
    try {
      const json = value ? JSON.parse(JSON.stringify(value)) || {} : {};
      for (const key of Object.keys(json)) {
        if (key.startsWith('$')) {
          delete json[key];
        }
      }
      return json;
    } catch (error) {
      return {};
    }
  };
  // Older WhatsApp versions have a `participants` collection, newer ones the
  // group call participants and a map with their state
  const toParticipants = (call: any, json: any) => {
    if (Array.isArray(json.participants)) {
      return json.participants;
    }
    if (!Array.isArray(call?.groupCallParticipants)) {
      return [];
    }
    const states = call.groupCallParticipantStates;
    return call.groupCallParticipants.map((participant: any) => {
      const jid = wid(participant);
      const state =
        typeof states?.get === 'function' ? states.get(jid) : undefined;
      return { jid, state: state ?? null };
    });
  };

  WPP.on('call.incoming_call' as any, (data: any) => {
    // The native VoIP stack registers the call with setActiveCall, without
    // adding it to the collection
    const store: any = (WPP.whatsapp as any).CallStore;
    const call: any =
      store?.get?.(data.id) ||
      (store?.activeCall?.id === data.id ? store.activeCall : undefined);
    const json = toJSON(call);
    w.onIncomingCall({
      ...json,
      id: data.id,
      peerJid: wid(data.peerJid),
      offerTime: data.offerTime,
      isVideo: data.isVideo,
      isGroup: data.isGroup,
      groupJid: wid(data.groupJid),
      canHandleLocally: !!call?.canHandleLocally,
      outgoing: false,
      isSilenced: !!call?.isSilenced,
      offerReceivedWhileOffline: !!call?.offerReceivedWhileOffline,
      webClientShouldHandle: !!call?.webClientShouldHandle,
      participants: toParticipants(call, json),
    });
  });
  w.onIncomingCall.exposed = true;
}
