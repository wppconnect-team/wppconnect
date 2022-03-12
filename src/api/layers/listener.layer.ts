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

import { EventEmitter, captureRejectionSymbol } from 'events';
import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { evaluateAndReturn } from '../helpers';
import { ExposedFn } from '../helpers/exposed.enum';
import {
  Ack,
  Chat,
  LiveLocation,
  Message,
  ParticipantEvent,
  PresenceEvent,
} from '../model';
import { MessageType, SocketState, SocketStream } from '../model/enum';
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
  private listenerEmitter = new EventEmitter({
    captureRejections: true,
  });

  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);

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

  protected async afterPageLoad() {
    await super.afterPageLoad();

    const functions = [
      ...Object.values(ExposedFn),
      'onAddedToGroup',
      'onIncomingCall',
      'onRevokedMessage',
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
        try {
          if (!window['onMessage'].exposed) {
            window.WAPI.waitNewMessages(false, (data) => {
              data.forEach((message) => {
                window['onMessage'](message);
              });
            });
            window['onMessage'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onAck'].exposed) {
            window.WAPI.waitNewAcknowledgements(window['onAck']);
            window['onAck'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onAnyMessage'].exposed) {
            window.WAPI.allNewMessagesListener(window['onAnyMessage']);
            window['onAnyMessage'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onStateChange'].exposed) {
            window.WAPI.onStateChange(window['onStateChange']);
            window['onStateChange'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onStreamChange'].exposed) {
            window.WAPI.onStreamChange(window['onStreamChange']);
            window['onStreamChange'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onAddedToGroup'].exposed) {
            window.WAPI.onAddedToGroup(window['onAddedToGroup']);
            window['onAddedToGroup'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onIncomingCall'].exposed) {
            window.WAPI.onIncomingCall(window['onIncomingCall']);
            window['onIncomingCall'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onInterfaceChange'].exposed) {
            window.WAPI.onInterfaceChange(window['onInterfaceChange']);
            window['onInterfaceChange'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onNotificationMessage'].exposed) {
            window.WAPI.onNotificationMessage(window['onNotificationMessage']);
            window['onNotificationMessage'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onPresenceChanged'].exposed) {
            window.WAPI.onPresenceChanged(window['onPresenceChanged']);
            window['onPresenceChanged'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onLiveLocation'].exposed) {
            window.WAPI.onLiveLocation(window['onLiveLocation']);
            window['onLiveLocation'].exposed = true;
          }
        } catch (error) {
          console.error(error);
        }
        try {
          if (!window['onRevokedMessage'].exposed) {
            WPP.chat.on('msg_revoke', (data) => {
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
      })
      .catch(() => {});
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
   * @event Returns the current state of the connection
   * @returns Disposable object to stop the listening
   */
  public onStreamChange(callback: (state: SocketStream) => void) {
    return this.registerEvent(ExposedFn.onStreamChange, callback);
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
   * @event Listens to messages acknowledgement Changes
   * @returns Disposable object to stop the listening
   */
  public onAck(callback: (ack: Ack) => void) {
    return this.registerEvent(ExposedFn.onAck, callback);
  }

  /**
   * Escuta os eventos de Localização em tempo real de todos os chats
   * @event Eventos de Localização em tempo real
   * @param callback Função para ser executada quando houver alterações
   * @returns Objeto descartável para parar de ouvir
   */
  public onLiveLocation(callback: (liveLocationEvent: LiveLocation) => void): {
    dispose: () => void;
  };
  /**
   * Escuta os eventos de Localização em tempo real
   * @event Eventos de Localização em tempo real
   * @param id Único ID ou lista de IDs de contatos para acompanhar a localização
   * @param callback Função para ser executada quando houver alterações
   * @returns Objeto descartável para parar de ouvir
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
   * @event Listens to participants changed
   * @param to callback
   * @returns Stream of ParticipantEvent
   */
  public onParticipantsChanged(
    callback: (participantChangedEvent: ParticipantEvent) => void
  ): { dispose: () => void };
  /**
   * @event Listens to participants changed
   * @param to group id: xxxxx-yyyy@us.c
   * @param to callback
   * @returns Stream of ParticipantEvent
   */
  public onParticipantsChanged(
    groupId: string,
    callback: (participantChangedEvent: ParticipantEvent) => void
  ): { dispose: () => void };
  public onParticipantsChanged(
    groupId: any,
    callback?: (participantChangedEvent: ParticipantEvent) => void
  ): { dispose: () => void } {
    if (typeof groupId === 'function') {
      callback = groupId;
      groupId = null;
    }

    const subtypeEvents = ['invite', 'add', 'remove', 'leave'];

    return this.registerEvent(
      ExposedFn.onNotificationMessage,
      (message: Message) => {
        // Only group events
        if (
          message.type !== MessageType.GP2 ||
          !subtypeEvents.includes(message.subtype)
        ) {
          return;
        }
        if (groupId && groupId !== message.id) {
          return;
        }
        callback({
          by: message.from,
          groupId: message.chatId,
          action: message.subtype as any,
          who: message.recipients,
        });
      }
    );
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
   * @event Escuta por ligações recebidas, seja de áudio ou vídeo.
   *
   * Para recusar a ligação, basta chamar o `rejectCall` {@link rejectCall}
   *
   * @returns Objeto descartável para parar de ouvir
   */
  public onIncomingCall(callback: (call: any) => any) {
    return this.registerEvent('onIncomingCall', callback);
  }

  /**
   * Listens to presence changed, by default, it will triggered for active chats only or contacts subscribed (see {@link subscribePresence})
   * @event Listens to presence changed
   * @param callback Callback of on presence changed
   * @returns Disposable object to stop the listening
   */
  public onPresenceChanged(
    callback: (presenceChangedEvent: PresenceEvent) => void
  ): { dispose: () => void };
  /**
   * Listens to presence changed, the callback will triggered only for passed IDs
   * @event Listens to presence changed
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
   * @event Listens to revoked messages
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
}
