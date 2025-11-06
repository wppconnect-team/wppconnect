export interface IncomingCall {
    /** alphanumeric ID of the call, can e.g. usable for hanging up */
    id: string;
    /** ID of the caller, can be used to message them directly */
    peerJid: string;
    /** Epoch timestamp (seconds) */
    offerTime: number;
    isVideo: boolean;
    isGroup: boolean;
    groupJid: string | null;
    canHandleLocally: boolean;
    outgoing: boolean;
    isSilenced: boolean;
    offerReceivedWhileOffline: boolean;
    webClientShouldHandle: boolean;
    participants: any[];
}
