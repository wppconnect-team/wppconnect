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

async function rejectCallByCallId(callId) {
  const call = WPP.whatsapp.CallStore.get(callId);

  if (!call) {
    throw {
      error: true,
      code: 'call_not_found',
      message: 'Call not found',
    };
  }

  if (call.getState() !== 'INCOMING_RING') {
    throw {
      error: true,
      code: 'call_is_not_incoming_ring',
      message: 'Call is not incoming ring',
    };
  }

  return await WPP.whatsapp.functions.sendCallSignalingMsg({
    common: {
      peer_jid: call.peerJid,
    },
    payload: [
      'reject',
      {
        'call-id': call.id,
        'call-creator': call.peerJid.toString({ legacy: true }),
        count: '0',
      },
      null,
    ],
  });
}

export async function rejectCall(callId) {
  if (callId) {
    await rejectCallByCallId(callId);
    return 1;
  }

  const calls = WPP.whatsapp.CallStore.models.filter(
    (c) => c.getState() === 'INCOMING_RING'
  );

  for (const call of calls) {
    await rejectCallByCallId(call.id).catch((e) => null);
  }

  return calls.lenth;
}
