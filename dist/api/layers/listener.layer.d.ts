import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { Ack, Chat, LiveLocation, Message, ParticipantEvent, PresenceEvent, Wid, IncomingCall } from '../model';
import { SocketState, SocketStream } from '../model/enum';
import { InterfaceMode } from '../model/enum/interface-mode';
import { InterfaceState } from '../model/enum/interface-state';
import { ProfileLayer } from './profile.layer';
import { Label } from '../model/label';
import { MsgKey } from '@wppconnect/wa-js/dist/whatsapp';
declare global {
    interface Window {
        onMessage: any;
        onAnyMessage: any;
        onStateChange: any;
        onStreamChange: any;
        onIncomingCall: any;
        onAck: any;
        onMessageEdit: any;
    }
}
export declare class ListenerLayer extends ProfileLayer {
    page: Page;
    private listenerEmitter;
    constructor(page: Page, session?: string, options?: CreateConfig);
    protected afterPageScriptInjected(): Promise<void>;
    /**
     * Register the event and create a disposable object to stop the listening
     * @param event Name of event
     * @param listener The function to execute
     * @returns Disposable object to stop the listening
     */
    protected registerEvent(event: string | symbol, listener: (...args: any[]) => void): {
        dispose: () => void;
    };
    /**
     * @event Listens to all new messages received only.
     * @returns Disposable object to stop the listening
     */
    onMessage(callback: (message: Message) => void): {
        dispose: () => void;
    };
    /**
     * @event Listens to all new messages, sent and received.
     * @param to callback
     * @fires Message
     * @returns Disposable object to stop the listening
     */
    onAnyMessage(callback: (message: Message) => void): {
        dispose: () => void;
    };
    /**
     * @event Listens to all notification messages, like group changes, join, leave
     * @param to callback
     * @fires Message
     * @returns Disposable object to stop the listening
     */
    onNotificationMessage(callback: (message: Message) => void): {
        dispose: () => void;
    };
    /**
     * @event Listens List of mobile states
     * @returns Disposable object to stop the listening
     */
    onStateChange(callback: (state: SocketState) => void): {
        dispose: () => void;
    };
    /**
     * @event Returns the current state of the connection
     * @returns Disposable object to stop the listening
     */
    onStreamChange(callback: (state: SocketStream) => void): {
        dispose: () => void;
    };
    /**
     * @event Listens to interface mode change See {@link InterfaceState} and {@link InterfaceMode} for details
     * @returns Disposable object to stop the listening
     */
    onInterfaceChange(callback: (state: {
        displayInfo: InterfaceState;
        mode: InterfaceMode;
    }) => void): {
        dispose: () => void;
    };
    /**
     * @event Listens to message acknowledgement changes
     * @returns Disposable object to stop the listening
     */
    onAck(callback: (ack: Ack) => void): {
        dispose: () => void;
    };
    /**
     * @event Listens to message edited changes
     * @returns Disposable object to stop the listening
     */
    onMessageEdit(callback: (chat: Wid, id: string, msg: Message) => void): {
        dispose: () => void;
    };
    /**
     * Listens to real-time location events of all chats
     * @event Real-time location events
     * @param callback Function to be executed when changes are made
     * @returns Disposable object to stop listening
     */
    onLiveLocation(callback: (liveLocationEvent: LiveLocation) => void): {
        dispose: () => void;
    };
    /**
     * Listens to location events in real time
     * @event Location events in real time
     * @param id Unique ID or list of contact IDs to track location
     * @param callback Function to be executed when changes are made
     * @returns Disposable object to stop listening
     */
    onLiveLocation(id: string | string[], callback: (liveLocationEvent: LiveLocation) => void): {
        dispose: () => void;
    };
    /**
     * @event Listens to participant changes
     * @param callback Function to be executed when participant changes occur
     * @returns Stream of ParticipantEvent
     */
    onParticipantsChanged(callback: (evData: ParticipantEvent) => void): {
        dispose: () => void;
    };
    /**
     * @event Listens to participant changes in a certain group
     * @param groupId xxxxx-yyyy@us.c
     * @param callback Function to be executed when participant changes occur
     * @returns Stream of ParticipantEvent
     */
    onParticipantsChanged(groupId: string, callback: (evData: ParticipantEvent) => void): {
        dispose: () => void;
    };
    /**
     * @event Fires callback with Chat object every time the host phone is added to a group.
     * @param to callback
     * @returns Disposable object to stop the listening
     */
    onAddedToGroup(callback: (chat: Chat) => any): {
        dispose: () => void;
    };
    /**
     * @event Listen for incoming calls, whether audio or video (pending a reaction).
     * To reject the call, simply call `rejectCall` {@link rejectCall}
     * @returns Disposable object to stop listening
     */
    onIncomingCall(callback: (call: IncomingCall) => any): {
        dispose: () => void;
    };
    /**
     * Listens to presence changed, by default, it will be triggered for active chats only or contacts subscribed (see {@link subscribePresence})
     * @event Listens to presence changed
     * @param callback Callback of on presence changed
     * @returns Disposable object to stop the listening
     */
    onPresenceChanged(callback: (presenceChangedEvent: PresenceEvent) => void): {
        dispose: () => void;
    };
    /**
     * Listens to presence changes, the callback will triggered only for passed IDs
     * @event Listens to presence changes
     * @param id contact id (xxxxx@c.us) or group id: xxxxx-yyyy@g.us
     * @param callback Callback of on presence changed
     * @returns Disposable object to stop the listening
     */
    onPresenceChanged(id: string | string[], callback: (presenceChangedEvent: PresenceEvent) => void): {
        dispose: () => void;
    };
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
    subscribePresence(id: string | string[]): Promise<number>;
    /**
     * Unsubscribe presence of a contact or group to use in onPresenceChanged (see {@link onPresenceChanged})
     * @param id contact id (xxxxx@c.us) or group id: xxxxx-yyyy@g.us
     * @returns number of unsubscribed
     */
    unsubscribePresence(id: string | string[]): Promise<number>;
    /**
     * @event Listens to message revocation
     * @returns Disposable object to stop the listening
     */
    onRevokedMessage(callback: (data: {
        author?: string;
        from: string;
        to: string;
        id: string;
        refId: String;
    }) => any): {
        dispose: () => void;
    };
    /**
     * @event Listens to message reactions
     * @returns Disposable object to stop the listening
     */
    onReactionMessage(callback: (data: {
        id: string;
        msgId: string;
        reactionText: string;
        read: boolean;
        orphan: number;
        orphanReason: any;
        timestamp: number;
    }) => any): {
        dispose: () => void;
    };
    /**
     * @event Listens to poll response messages
     * @returns Disposable object to stop the listening
     */
    onPollResponse(callback: (data: {
        msgId: string;
        chatId: Wid;
        selectedOptions: any;
        timestamp: number;
        sender: Wid;
    }) => any): {
        dispose: () => void;
    };
    /**
     * @event Listens to update label
     * @returns Disposable object to stop the listening
     */
    onUpdateLabel(callback: (data: {
        chat: Chat;
        ids: string[];
        labels: Label[];
        type: 'add' | 'remove';
    }) => any): {
        dispose: () => void;
    };
    /**
     * @event Listens to update order status
     * @returns Disposable object to stop the listening
     */
    onOrderStatusUpdate(callback: (data: {
        method: string;
        timestamp: number;
        reference_id: string;
        msgId: MsgKey;
    }) => any): {
        dispose: () => void;
    };
}
