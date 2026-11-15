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

import { BackendEventName, MsgKey } from '@wppconnect/wa-js/dist/whatsapp';
import { StreamInfo, StreamMode } from '@wppconnect/wa-js/dist/whatsapp/enums';
import { EventEmitter, captureRejectionSymbol } from 'events';
import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { evaluateAndReturn } from '../helpers';
import { ExposedFn } from '../helpers/exposed.enum';
import {
  Ack,
  CallAudioFrame,
  CallAudioFrameOptions,
  CallEndedEvent,
  CallEvent,
  CallMuteStateEvent,
  CallStateChangedEvent,
  CallVideoStateEvent,
  Chat,
  IncomingCall,
  LiveLocation,
  Message,
  ParticipantEvent,
  PresenceEvent,
  Wid,
} from '../model';
import { SocketState, SocketStream } from '../model/enum';
import { InterfaceMode } from '../model/enum/interface-mode';
import { InterfaceState } from '../model/enum/interface-state';
import { Label } from '../model/label';
import { ProfileLayer } from './profile.layer';

declare global {
  interface Window {
    onMessage: any;
    onAnyMessage: any;
    onStateChange: any;
    onStreamChange: any;
    onStreamModeChanged: any;
    onStreamInfoChanged: any;
    onIncomingCall: any;
    onAck: any;
    onMessageEdit: any;
  }
}

export class ListenerLayer extends ProfileLayer {
  private listenerEmitter = new EventEmitter({
    captureRejections: true,
  });

  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);

    this.listenerEmitter.setMaxListeners(0);

    this.listenerEmitter.on(ExposedFn.onInterfaceChange, (state) => {
      this.log('http', `Current state: ${state.mode} (${state.displayInfo})`);
    });
    this.listenerEmitter[captureRejectionSymbol] = (
      reason: any,
      event: string
    ) => {
      let message = `Unhandled Rejection in a ${event} event: `;
      if (reason instanceof Error) {
        if (reason.stack) {
          message += reason.stack;
        } else {
          message += reason.toString();
        }
      } else {
        message += JSON.stringify(reason);
      }
      this.log('error', reason);
    };
  }

  protected async afterPageScriptInjected() {
    await super.afterPageScriptInjected();

    const functions = [
      ...Object.values(ExposedFn),
      'onAddedToGroup',
      'onIncomingCall',
      'onRevokedMessage',
      'onReactionMessage',
      'onPollResponse',
      'onUpdateLabel',
      'onOrderStatusUpdate',
      'onParticipantsChanged',
      'onNewChat',
    ];

    for (const func of functions) {
      const has = await this.page
        .evaluate((func) => typeof window[func] === 'function', func)
        .catch(() => false);

      if (!has) {
        this.log('debug', `Exposing ${func} function`);
        await this.page
          .exposeFunction(func, (...args) => {
            Promise.resolve().then(() => {
              const count = this.listenerEmitter.listenerCount(func);
              if (count > 0) {
                this.log(
                  'debug',
                  `Emitting ${func} event (${count} registered)`
                );
              }
              this.listenerEmitter.emit(func, ...args);
            });
          })
          .catch(() => {});
      }
    }

    await this.page
      .evaluate(() => {
        try {
          if (!window['onMessage']?.exposed) {
            WPP.on('chat.new_message', (msg) => {
              if (msg.isSentByMe || msg.isStatusV3) {
                return;
              }
              const serialized = WAPI.processMessageObj(msg, false, false);
              if (serialized) {
                window['onMessage'](serialized);
              }
            });

            window['onMessage'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onAck']?.exposed) {
            window.WAPI.waitNewAcknowledgements(window['onAck']);
            window['onAck'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onMessageEdit']?.exposed) {
            WPP.on('chat.msg_edited', (data) => {
              const eventData = {
                chat: data.chat,
                id: data.id,
                msg: WAPI.processMessageObj(data.msg, true, false),
              };
              window['onMessageEdit'](eventData);
            });
            window['onMessageEdit'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onAnyMessage']?.exposed) {
            WPP.on('chat.new_message', (msg) => {
              const serialized = WAPI.processMessageObj(msg, true, false);
              if (serialized) {
                window['onAnyMessage'](serialized);
              }
            });
            window['onAnyMessage'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onStateChange']?.exposed) {
            window.WAPI.onStateChange(window['onStateChange']);
            window['onStateChange'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onStreamChange']?.exposed) {
            window.WAPI.onStreamChange(window['onStreamChange']);
            window['onStreamChange'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onStreamModeChanged']?.exposed) {
            window.WAPI.onStreamModeChanged(window['onStreamModeChanged']);
            window['onStreamModeChanged'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onStreamInfoChanged']?.exposed) {
            window.WAPI.onStreamInfoChanged(window['onStreamInfoChanged']);
            window['onStreamInfoChanged'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onAddedToGroup']?.exposed) {
            window.WAPI.onAddedToGroup(window['onAddedToGroup']);
            window['onAddedToGroup'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        // Wid objects do not cross to Node, send them as strings
        const wid = (w: any) => (w ? w._serialized || w.toString() : undefined);
        const toCallEvent = (data: any) => ({
          ...data,
          peerJid: wid(data.peerJid),
          groupJid: wid(data.groupJid),
        });
        // WA-JS with native call support emits call.* events
        const hasCallEvents =
          typeof (WPP.call as any)?.enableAudioInjection === 'function';
        try {
          if (!window['onIncomingCall']?.exposed) {
            if (hasCallEvents) {
              // CallStore 'add' is not triggered by the native VoIP stack,
              // keep the IncomingCall payload for compatibility
              WPP.on('call.incoming_call', (data: any) => {
                const call: any = WPP.whatsapp.CallStore.get(data.id);
                window['onIncomingCall']({
                  id: data.id,
                  peerJid: wid(data.peerJid),
                  offerTime: data.offerTime,
                  isVideo: data.isVideo,
                  isGroup: data.isGroup,
                  groupJid: wid(data.groupJid) || null,
                  canHandleLocally: !!call?.canHandleLocally,
                  outgoing: false,
                  isSilenced: !!call?.isSilenced,
                  offerReceivedWhileOffline: !!call?.offerReceivedWhileOffline,
                  webClientShouldHandle: !!call?.webClientShouldHandle,
                  participants: [],
                });
              });
            } else {
              window.WAPI.onIncomingCall(window['onIncomingCall']);
            }
            window['onIncomingCall'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          const callEvents = {
            onCallOutgoing: 'call.outgoing_call',
            onCallRinging: 'call.ringing',
            onCallAccepted: 'call.accepted',
            onCallStateChanged: 'call.state_changed',
            onCallEnded: 'call.ended',
            onCallVideoState: 'call.video_state',
          };
          for (const [name, event] of Object.entries(callEvents)) {
            if (hasCallEvents && !window[name]?.exposed) {
              WPP.on(event as any, (data: any) => {
                const payload = toCallEvent(data);
                if ('jid' in data) {
                  payload.jid = wid(data.jid);
                }
                window[name](payload);
              });
              window[name].exposed = true;
            }
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (hasCallEvents && !window['onCallMuteState']?.exposed) {
            WPP.on('call.mute_state' as any, (data: any) => {
              window['onCallMuteState']({
                ...data,
                participants: (data.participants || []).map((p: any) => ({
                  ...p,
                  jid: wid(p.jid),
                })),
              });
            });
            window['onCallMuteState'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (hasCallEvents && !window['onCallAudioFrame']?.exposed) {
            // Capture is only enabled while Node has listeners
            // (window.__wppconnectCallFrames), and is armed for a single
            // call, so it is armed again for the next one
            const arm = () => {
              if ((window as any).__wppconnectCallFrames) {
                WPP.call.enableAudioCapture({
                  format: 'int16-base64',
                  source: 'both',
                });
              }
            };
            WPP.on('call.audio_frame' as any, (frame: any) => {
              if (
                (window as any).__wppconnectCallFrames &&
                frame.format === 'int16-base64'
              ) {
                window['onCallAudioFrame'](frame);
              }
            });
            WPP.on('call.ended' as any, () => setTimeout(arm, 0));
            window['onCallAudioFrame'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onInterfaceChange']?.exposed) {
            window.WAPI.onInterfaceChange(window['onInterfaceChange']);
            window['onInterfaceChange'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onNotificationMessage']?.exposed) {
            window.WAPI.onNotificationMessage(window['onNotificationMessage']);
            window['onNotificationMessage'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onPresenceChanged']?.exposed) {
            WPP.on('chat.presence_change', window['onPresenceChanged']);
            window['onPresenceChanged'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onLiveLocation']?.exposed) {
            window.WAPI.onLiveLocation(window['onLiveLocation']);
            window['onLiveLocation'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onRevokedMessage']?.exposed) {
            WPP.on('chat.msg_revoke', (data) => {
              const eventData = {
                author: data.author,
                from: data.from,
                to: data.to,
                id: data.id._serialized,
                refId: data.refId._serialized,
              };
              window['onRevokedMessage'](eventData);
            });
            window['onRevokedMessage'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onReactionMessage']?.exposed) {
            WPP.on('chat.new_reaction', (data) => {
              const eventData = {
                id: data.id,
                msgId: data.msgId,
                reactionText: data.reactionText,
                read: data.read,
                sender: data.sender,
                orphan: data.orphan,
                orphanReason: data.orphanReason,
                timestamp: data.timestamp,
              };
              window['onReactionMessage'](eventData);
            });
            window['onReactionMessage'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onPollResponse']?.exposed) {
            WPP.on('chat.poll_response', (data) => {
              const eventData = {
                msgId: data.msgId,
                chatId: data.chatId,
                selectedOptions: data.selectedOptions,
                timestamp: data.timestamp,
                sender: data.sender,
              };
              window['onPollResponse'](eventData);
            });
            window['onPollResponse'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onUpdateLabel']?.exposed) {
            WPP.on('chat.update_label', (data) => {
              const eventData = {
                chat: data.chat,
                ids: data.ids,
                labels: data.labels,
                type: data.type,
              };
              window['onUpdateLabel'](eventData);
            });
            window['onUpdateLabel'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onOrderStatusUpdate']?.exposed) {
            WPP.on('order.payment_status', (data) => {
              const eventData = {
                method: data.method,
                timestamp: data.timestamp,
                reference_id: data.reference_id,
                msgId: data.msgId,
              };
              window['onOrderStatusUpdate'](eventData);
            });
            window['onOrderStatusUpdate'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onParticipantsChanged']?.exposed) {
            WPP.on('group.participant_changed', (participantChangedEvent) => {
              window['onParticipantsChanged'](participantChangedEvent);
            });
            window['onParticipantsChanged'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onNewChat']?.exposed) {
            WPP.on('chat.new_chat', (chat) => {
              window['onNewChat'](chat);
            });
            window['onNewChat'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onBackendEvent']?.exposed) {
            WPP.on('conn.backend_event', (eventName, ...args) => {
              window['onBackendEvent'](eventName, ...args);
            });
            window['onBackendEvent'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
      })
      .catch(() => {});

    // The page was reloaded, restore the call audio capture
    if (this.listenerEmitter.listenerCount(ExposedFn.onCallAudioFrame) > 0) {
      await this.setCallAudioCapture(true);
    }
  }

  /**
   * Enables or disables the call audio capture used by {@link onCallAudioFrame}
   */
  private async setCallAudioCapture(enabled: boolean) {
    await this.page
      .evaluate((enabled) => {
        (window as any).__wppconnectCallFrames = enabled;
        WPP.call.enableAudioCapture(
          enabled ? { format: 'int16-base64', source: 'both' } : false
        );
      }, enabled)
      .catch((error) => this.log('debug', `Call audio capture: ${error}`));
  }

  /**
   * Register the event and create a disposable object to stop the listening
   * @param event Name of event
   * @param listener The function to execute
   * @returns Disposable object to stop the listening
   */
  protected registerEvent(
    event: string | symbol,
    listener: (...args: any[]) => void
  ) {
    this.log('debug', `Registering ${event.toString()} event`);
    this.listenerEmitter.on(event, listener);
    return {
      dispose: () => {
        this.listenerEmitter.off(event, listener);
      },
    };
  }

  /**
   * @event Listens to all new messages received only.
   * @returns Disposable object to stop the listening
   */
  public onMessage(callback: (message: Message) => void) {
    return this.registerEvent(ExposedFn.OnMessage, callback);
  }

  /**
   * @event Listens to all new messages, sent and received.
   * @param to callback
   * @fires Message
   * @returns Disposable object to stop the listening
   */
  public onAnyMessage(callback: (message: Message) => void) {
    return this.registerEvent(ExposedFn.OnAnyMessage, callback);
  }

  /**
   * @event Listens to all notification messages, like group changes, join, leave
   * @param to callback
   * @fires Message
   * @returns Disposable object to stop the listening
   */
  public onNotificationMessage(callback: (message: Message) => void) {
    return this.registerEvent(ExposedFn.onNotificationMessage, callback);
  }

  /**
   * @event Listens List of mobile states
   * @returns Disposable object to stop the listening
   */
  public onStateChange(callback: (state: SocketState) => void) {
    return this.registerEvent(ExposedFn.onStateChange, callback);
  }

  /**
   * @deprecated in favor of {@link onStreamModeChanged}
   * @event Returns the current state of the connection
   * @returns Disposable object to stop the listening
   */
  public onStreamChange(callback: (state: SocketStream) => void) {
    return this.registerEvent(ExposedFn.onStreamChange, callback);
  }

  /**
   * @event Listens to Stream mode changes
   * @returns Disposable object to stop the listening
   */
  public onStreamModeChanged(callback: (mode: StreamMode) => void) {
    return this.registerEvent(ExposedFn.onStreamModeChanged, callback);
  }

  /**
   * @event Listens to Stream info changes
   * @returns Disposable object to stop the listening
   */
  public onStreamInfoChanged(callback: (info: StreamInfo) => void) {
    return this.registerEvent(ExposedFn.onStreamInfoChanged, callback);
  }

  /**
   * @event Listens to all internal WhatsApp Web BackendEventBus events.
   * The first argument is the event name; additional arguments vary by event.
   * @returns Disposable object to stop the listening
   */
  public onBackendEvent(
    callback: (eventName: BackendEventName, ...args: any[]) => void
  ) {
    return this.registerEvent(ExposedFn.onBackendEvent, callback);
  }

  /**
   * @event Listens to interface mode change See {@link InterfaceState} and {@link InterfaceMode} for details
   * @returns Disposable object to stop the listening
   */
  public onInterfaceChange(
    callback: (state: {
      displayInfo: InterfaceState;
      mode: InterfaceMode;
    }) => void
  ) {
    return this.registerEvent(ExposedFn.onInterfaceChange, callback);
  }

  /**
   * @event Listens to message acknowledgement changes
   * @returns Disposable object to stop the listening
   */
  public onAck(callback: (ack: Ack) => void) {
    return this.registerEvent(ExposedFn.onAck, callback);
  }

  /**
   * @event Listens to message edited changes
   * @param callback Receives the edited message data
   * @returns Disposable object to stop the listening
   */
  public onMessageEdit(
    callback: (data: { chat: Wid; id: string; msg: Message }) => void
  ) {
    return this.registerEvent(ExposedFn.onMessageEdit, callback);
  }

  /**
   * Listens to real-time location events of all chats
   * @event Real-time location events
   * @param callback Function to be executed when changes are made
   * @returns Disposable object to stop listening
   */
  public onLiveLocation(callback: (liveLocationEvent: LiveLocation) => void): {
    dispose: () => void;
  };
  /**
   * Listens to location events in real time
   * @event Location events in real time
   * @param id Unique ID or list of contact IDs to track location
   * @param callback Function to be executed when changes are made
   * @returns Disposable object to stop listening
   */
  public onLiveLocation(
    id: string | string[],
    callback: (liveLocationEvent: LiveLocation) => void
  ): { dispose: () => void };
  public onLiveLocation(
    id: any,
    callback?: (liveLocationEvent: LiveLocation) => void
  ) {
    const ids: string[] = [];

    if (typeof id === 'function') {
      callback = id;
    } else if (Array.isArray(id)) {
      ids.push(...id);
    } else {
      ids.push(id);
    }

    return this.registerEvent(
      ExposedFn.onLiveLocation,
      (event: LiveLocation) => {
        // Only group events
        if (ids.length && !ids.includes(event.id)) {
          return;
        }
        callback(event);
      }
    );
  }

  /**
   * @event Listens to participant changes
   * @param callback Function to be executed when participant changes occur
   * @returns Stream of ParticipantEvent
   */
  public onParticipantsChanged(callback: (evData: ParticipantEvent) => void): {
    dispose: () => void;
  };
  /**
   * @event Listens to participant changes in a certain group
   * @param groupId xxxxx-yyyy@us.c
   * @param callback Function to be executed when participant changes occur
   * @returns Stream of ParticipantEvent
   */
  public onParticipantsChanged(
    groupId: string,
    callback: (evData: ParticipantEvent) => void
  ): { dispose: () => void };
  public onParticipantsChanged(
    groupId: any,
    callback?: (evData: ParticipantEvent) => void
  ): { dispose: () => void } {
    if (typeof groupId === 'function') {
      callback = groupId;
      groupId = null;
    }

    return this.registerEvent(ExposedFn.onParticipantsChanged, (evData) => {
      if (groupId && groupId !== evData.groupId) {
        return;
      }
      callback({
        by: evData.author,
        byPushName: evData.authorPushName,
        groupId: evData.groupId,
        action: evData.action,
        operation: evData.operation,
        who: evData.participants,
      });
    });
  }

  /**
   * @event Fires callback with Chat object every time the host phone is added to a group.
   * @param to callback
   * @returns Disposable object to stop the listening
   */
  public onAddedToGroup(callback: (chat: Chat) => any) {
    return this.registerEvent('onAddedToGroup', callback);
  }

  /**
   * @event Listen for incoming calls, whether audio or video (pending a reaction).
   * To reject the call, simply call `rejectCall` {@link rejectCall}
   * @returns Disposable object to stop listening
   */
  public onIncomingCall(callback: (call: IncomingCall) => any) {
    return this.registerEvent('onIncomingCall', callback);
  }

  /**
   * @event Listens to calls started by this session
   * @category Call
   * @example
   * ```javascript
   * client.onCallOutgoing((call) => console.log('Calling', call.peerJid));
   * ```
   * @returns Disposable object to stop listening
   */
  public onCallOutgoing(callback: (call: CallEvent) => any) {
    return this.registerEvent(ExposedFn.onCallOutgoing, callback);
  }

  /**
   * @event Listens to calls ringing on the other side
   * @category Call
   * @example
   * ```javascript
   * client.onCallRinging((call) => console.log('Ringing', call.id));
   * ```
   * @returns Disposable object to stop listening
   */
  public onCallRinging(callback: (call: CallEvent) => any) {
    return this.registerEvent(ExposedFn.onCallRinging, callback);
  }

  /**
   * @event Listens to calls being connected, incoming or outgoing
   * @category Call
   * @example
   * ```javascript
   * client.onCallAccepted(() => client.playCallAudio('./welcome.mp3'));
   * ```
   * @returns Disposable object to stop listening
   */
  public onCallAccepted(callback: (call: CallEvent) => any) {
    return this.registerEvent(ExposedFn.onCallAccepted, callback);
  }

  /**
   * @event Listens to every call state change
   * @category Call
   * @example
   * ```javascript
   * client.onCallStateChanged((call) => console.log(call.id, call.stateName));
   * ```
   * @returns Disposable object to stop listening
   */
  public onCallStateChanged(callback: (call: CallStateChangedEvent) => any) {
    return this.registerEvent(ExposedFn.onCallStateChanged, callback);
  }

  /**
   * @event Listens to calls ending, with the result and duration
   * @category Call
   * @example
   * ```javascript
   * client.onCallEnded((call) => {
   *   console.log(call.resultName, call.duration);
   * });
   * ```
   * @returns Disposable object to stop listening
   */
  public onCallEnded(callback: (call: CallEndedEvent) => any) {
    return this.registerEvent(ExposedFn.onCallEnded, callback);
  }

  /**
   * @event Listens to microphone mute changes of the call participants
   * @category Call
   * @example
   * ```javascript
   * client.onCallMuteState((state) => console.log(state.peerMuted));
   * ```
   * @returns Disposable object to stop listening
   */
  public onCallMuteState(callback: (state: CallMuteStateEvent) => any) {
    return this.registerEvent(ExposedFn.onCallMuteState, callback);
  }

  /**
   * @event Listens to camera changes of the call participants
   * @category Call
   * @example
   * ```javascript
   * client.onCallVideoState((state) => console.log(state.stateName));
   * ```
   * @returns Disposable object to stop listening
   */
  public onCallVideoState(callback: (state: CallVideoStateEvent) => any) {
    return this.registerEvent(ExposedFn.onCallVideoState, callback);
  }

  /**
   * Listens to the call audio, in frames of 60 ms of 16 kHz mono PCM
   * (about 16 frames per second for each side).
   *
   * The capture is only enabled while there is a listener, and is armed again
   * for each call. Register it before the call starts to get every frame.
   *
   * @event Listens to the call audio
   * @category Call
   * @example
   * ```javascript
   * client.onCallAudioFrame(
   *   (frame) => {
   *     const pcm = Buffer.from(frame.samples, 'base64'); // Int16 LE
   *   },
   *   { source: 'remote' }
   * );
   * ```
   * @returns Disposable object to stop listening
   */
  public onCallAudioFrame(
    callback: (frame: CallAudioFrame) => any,
    options: CallAudioFrameOptions = {}
  ) {
    const source = options.source || 'both';
    const listener = (frame: CallAudioFrame) => {
      if (source === 'both' || frame.source === source) {
        return callback(frame);
      }
    };

    const isFirst =
      this.listenerEmitter.listenerCount(ExposedFn.onCallAudioFrame) === 0;
    const subscription = this.registerEvent(
      ExposedFn.onCallAudioFrame,
      listener
    );
    if (isFirst) {
      this.setCallAudioCapture(true);
    }

    return {
      dispose: () => {
        subscription.dispose();
        if (
          this.listenerEmitter.listenerCount(ExposedFn.onCallAudioFrame) === 0
        ) {
          this.setCallAudioCapture(false);
        }
      },
    };
  }

  /**
   * Listens to presence changed, by default, it will be triggered for active chats only or contacts subscribed (see {@link subscribePresence})
   * @event Listens to presence changed
   * @param callback Callback of on presence changed
   * @returns Disposable object to stop the listening
   */
  public onPresenceChanged(
    callback: (presenceChangedEvent: PresenceEvent) => void
  ): { dispose: () => void };
  /**
   * Listens to presence changes, the callback will triggered only for passed IDs
   * @event Listens to presence changes
   * @param id contact id (xxxxx@c.us) or group id: xxxxx-yyyy@g.us
   * @param callback Callback of on presence changed
   * @returns Disposable object to stop the listening
   */
  public onPresenceChanged(
    id: string | string[],
    callback: (presenceChangedEvent: PresenceEvent) => void
  ): { dispose: () => void };
  public onPresenceChanged(
    id: any,
    callback?: (presenceChangedEvent: PresenceEvent) => void
  ): { dispose: () => void } {
    const ids = [];

    if (typeof id === 'function') {
      callback = id;
    } else if (Array.isArray(id)) {
      ids.push(...id);
    } else {
      ids.push(id);
    }

    if (ids.length) {
      this.subscribePresence(ids);
    }

    return this.registerEvent(
      ExposedFn.onPresenceChanged,
      (presence: PresenceEvent) => {
        // Only group events
        if (ids.length && !ids.includes(presence.id)) {
          return;
        }
        callback(presence);
      }
    );
  }

  /**
   * Subscribe presence of a contact or group to use in onPresenceChanged (see {@link onPresenceChanged})
   *
   * ```typescript
   * // subcribe all contacts
   * const contacts = await client.getAllContacts();
   * await client.subscribePresence(contacts.map((c) => c.id._serialized));
   *
   * // subcribe all groups participants
   * const chats = await client.getAllGroups(false);
   * for (const c of chats) {
   *   const ids = c.groupMetadata.participants.map((p) => p.id._serialized);
   *   await client.subscribePresence(ids);
   * }
   * ```
   *
   * @param id contact id (xxxxx@c.us) or group id: xxxxx-yyyy@g.us
   * @returns number of subscribed
   */
  public async subscribePresence(id: string | string[]): Promise<number> {
    return await evaluateAndReturn(
      this.page,
      (id) => WAPI.subscribePresence(id),
      id
    );
  }
  /**
   * Unsubscribe presence of a contact or group to use in onPresenceChanged (see {@link onPresenceChanged})
   * @param id contact id (xxxxx@c.us) or group id: xxxxx-yyyy@g.us
   * @returns number of unsubscribed
   */
  public async unsubscribePresence(id: string | string[]): Promise<number> {
    return await evaluateAndReturn(
      this.page,
      (id) => WAPI.unsubscribePresence(id),
      id
    );
  }

  /**
   * @event Listens to message revocation
   * @returns Disposable object to stop the listening
   */
  public onRevokedMessage(
    callback: (data: {
      author?: string;
      from: string;
      to: string;
      id: string;
      refId: String;
    }) => any
  ) {
    return this.registerEvent('onRevokedMessage', callback);
  }

  /**
   * @event Listens to message reactions
   * @returns Disposable object to stop the listening
   */
  public onReactionMessage(
    callback: (data: {
      id: MsgKey;
      msgId: MsgKey;
      reactionText: string;
      read: boolean;
      sender: Wid;
      orphan: number;
      orphanReason: any;
      timestamp: number;
    }) => any
  ) {
    return this.registerEvent('onReactionMessage', callback);
  }

  /**
   * @event Listens to poll response messages
   * @returns Disposable object to stop the listening
   */
  public onPollResponse(
    callback: (data: {
      msgId: string;
      chatId: Wid;
      selectedOptions: any;
      timestamp: number;
      sender: Wid;
    }) => any
  ) {
    return this.registerEvent('onPollResponse', callback);
  }

  /**
   * @event Listens to update label
   * @returns Disposable object to stop the listening
   */
  public onUpdateLabel(
    callback: (data: {
      chat: Chat;
      ids: string[];
      labels: Label[];
      type: 'add' | 'remove';
    }) => any
  ) {
    return this.registerEvent('onUpdateLabel', callback);
  }

  /**
   * @event Listens to update order status
   * @returns Disposable object to stop the listening
   */
  public onOrderStatusUpdate(
    callback: (data: {
      method: string;
      timestamp: number;
      reference_id: string;
      msgId: MsgKey;
    }) => any
  ) {
    return this.registerEvent('onOrderStatusUpdate', callback);
  }

  /**
   * @event Listens to chats being added to ChatStore (Cache Layer)
   * @returns Disposable object to stop the listening
   */
  public onNewChat(callback: (chat: Chat) => any) {
    return this.registerEvent('onNewChat', callback);
  }
}
