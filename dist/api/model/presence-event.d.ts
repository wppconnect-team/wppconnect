export interface PresenceEvent {
    /**
     * ID of contact or group
     */
    id: string;
    isOnline: boolean;
    isGroup: boolean;
    isUser: boolean;
    state: 'available' | 'composing' | 'recording' | 'unavailable';
    /**
     * Timestramp of event `Date.now()`
     */
    t: number;
    /**
     * If is an user, check is a contact
     */
    isContact?: boolean;
    participants?: {
        id: string;
        state: 'available' | 'composing' | 'recording' | 'unavailable';
        shortName: string;
    }[];
}
