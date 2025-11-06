export interface ParticipantEvent {
    by?: string;
    byPushName?: string;
    groupId: string;
    action: 'add' | 'remove' | 'demote' | 'promote' | 'leaver' | 'join';
    operation: 'add' | 'remove' | 'demote' | 'promote';
    who: string[];
}
