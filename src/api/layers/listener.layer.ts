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

import { EventEmitter } from 'events';
import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { ExposedFn } from '../helpers/exposed.enum';
import { Ack, Chat, LiveLocation, Message, ParticipantEvent } from '../model';
import { SocketState, SocketStream } from '../model/enum';
import { InterfaceMode } from '../model/enum/interface-mode';
import { InterfaceState } from '../model/enum/interface-state';
import { ProfileLayer } from './profile.layer';

declare global {
  interface Window {
    onMessage: any;
    onAnyMessage: any;
    onStateChange: any;
    onStreamChange: any;
    onIncomingCall: any;
    onAck: any;
  }
}

export class ListenerLayer extends ProfileLayer {
  private listenerEmitter = new EventEmitter();

  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);

    this.listenerEmitter.on(ExposedFn.onInterfaceChange, (state) => {
      this.log('http', `Current state: ${state.mode} (${state.displayInfo})`);
    });
  }

  protected async initialize() {
    await super.initialize();

    const functions = [
      ...Object.values(ExposedFn),
      'onAddedToGroup',
      'onIncomingCall',
    ];

    for (const func of functions) {
      const has = await this.page
        .evaluate((func) => typeof window[func] === 'function', func)
        .catch(() => false);

      if (!has) {
        this.log('debug', `Exposing ${func} function`);
        await this.page
          .exposeFunction(func, (...args) =>
            this.listenerEmitter.emit(func, ...args)
          )
          .catch(() => {});
      }
    }

    await this.page
      .evaluate(() => {
        if (!window['onMessage'].exposed) {
          window.WAPI.waitNewMessages(false, (data) => {
            data.forEach((message) => {
              window['onMessage'](message);
            });
          });
          window['onMessage'].exposed = true;
        }
        if (!window['onAck'].exposed) {
          window.WAPI.waitNewAcknowledgements(window['onAck']);
          window['onAck'].exposed = true;
        }
        if (!window['onAnyMessage'].exposed) {
          window.WAPI.allNewMessagesListener(window['onAnyMessage']);
          window['onAnyMessage'].exposed = true;
        }
        if (!window['onStateChange'].exposed) {
          window.WAPI.onStateChange(window['onStateChange']);
          window['onStateChange'].exposed = true;
        }
        if (!window['onStreamChange'].exposed) {
          window.WAPI.onStreamChange(window['onStreamChange']);
          window['onStreamChange'].exposed = true;
        }
        if (!window['onAddedToGroup'].exposed) {
          window.WAPI.onAddedToGroup(window['onAddedToGroup']);
          window['onAddedToGroup'].exposed = true;
        }
        if (!window['onIncomingCall'].exposed) {
          window.WAPI.onIncomingCall(window['onIncomingCall']);
          window['onIncomingCall'].exposed = true;
        }
        if (!window['onInterfaceChange'].exposed) {
          window.WAPI.onInterfaceChange(window['onInterfaceChange']);
          window['onInterfaceChange'].exposed = true;
        }
      })
      .catch(() => {});
  }

  /**
   * @event Listens to messages received
   * @returns Observable stream of messages
   */
  public async onMessage(fn: (message: Message) => void) {
    this.listenerEmitter.on(ExposedFn.OnMessage, (state: Message) => {
      fn(state);
    });
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.OnMessage, fn);
      },
    };
  }

  /**
   * @event Listens to all new messages
   * @param to callback
   * @fires Message
   */
  public async onAnyMessage(fn: (message: Message) => void) {
    this.listenerEmitter.on(ExposedFn.OnAnyMessage, (state: Message) => {
      fn(state);
    });
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.OnAnyMessage, fn);
      },
    };
  }

  /**
   * @event Listens List of mobile states
   * @returns Observable status flow
   */
  public async onStateChange(fn: (state: SocketState) => void) {
    this.listenerEmitter.on(ExposedFn.onStateChange, (state: SocketState) => {
      fn(state);
    });
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onStateChange, fn);
      },
    };
  }

  /**
   * @returns Returns the current state of the connection
   */
  public async onStreamChange(fn: (state: SocketStream) => void) {
    this.listenerEmitter.on(ExposedFn.onStreamChange, (state: SocketStream) => {
      fn(state);
    });
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onStreamChange, fn);
      },
    };
  }

  /**
   * @event Listens to interface mode change See {@link InterfaceState} and {@link InterfaceMode} for details
   * @returns A disposable object to cancel the event
   */
  public onInterfaceChange(
    fn: (state: { displayInfo: InterfaceState; mode: InterfaceMode }) => void
  ) {
    this.listenerEmitter.on(ExposedFn.onInterfaceChange, fn);
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onInterfaceChange, fn);
      },
    };
  }

  /**
   * @event Listens to messages acknowledgement Changes
   * @returns Observable stream of messages
   */
  public async onAck(fn: (ack: Ack) => void) {
    this.listenerEmitter.on(ExposedFn.onAck, (state: Ack) => {
      fn(state);
    });
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onAck, fn);
      },
    };
  }

  /**
   * @event Listens to live locations from a chat that already has valid live locations
   * @param chatId the chat from which you want to subscribes to live location updates
   * @param fn callback that takes in a LiveLocation
   * @returns boolean, if returns false then there were no valid live locations in the chat of chatId
   * @emits <LiveLocation> LiveLocation
   */
  public async onLiveLocation(
    chatId: string,
    fn: (liveLocationChangedEvent: LiveLocation) => void
  ) {
    const method = 'onLiveLocation_' + chatId.replace('_', '').replace('_', '');
    return this.page
      .exposeFunction(method, (liveLocationChangedEvent: LiveLocation) =>
        fn(liveLocationChangedEvent)
      )
      .then((_) =>
        this.page.evaluate(
          ({ chatId, method }) => {
            //@ts-ignore
            return WAPI.onLiveLocation(chatId, window[method]);
          },
          { chatId, method }
        )
      );
  }

  /**
   * @event Listens to participants changed
   * @param to group id: xxxxx-yyyy@us.c
   * @param to callback
   * @returns Stream of ParticipantEvent
   */
  public async onParticipantsChanged(
    groupId: string,
    fn: (participantChangedEvent: ParticipantEvent) => void
  ) {
    const method =
      'onParticipantsChanged_' + groupId.replace('_', '').replace('_', '');
    return this.page
      .exposeFunction(method, (participantChangedEvent: ParticipantEvent) =>
        fn(participantChangedEvent)
      )
      .then((_) =>
        this.page.evaluate(
          ({ groupId, method }) => {
            //@ts-ignore
            WAPI.onParticipantsChanged(groupId, window[method]);
          },
          { groupId, method }
        )
      );
  }

  /**
   * @event Fires callback with Chat object every time the host phone is added to a group.
   * @param to callback
   * @returns Observable stream of Chats
   */
  public async onAddedToGroup(fn: (chat: Chat) => any) {
    this.listenerEmitter.on('onAddedToGroup', (state: Chat) => {
      fn(state);
    });
    return {
      dispose: () => {
        this.listenerEmitter.off('onAddedToGroup', fn);
      },
    };
  }

  /**
   * @event Listens to messages received
   * @returns Observable stream of messages
   */
  public async onIncomingCall(fn: (call: any) => any) {
    this.listenerEmitter.on('onIncomingCall', (state: any) => {
      fn(state);
    });
    return {
      dispose: () => {
        this.listenerEmitter.off('onIncomingCall', fn);
      },
    };
  }
}
