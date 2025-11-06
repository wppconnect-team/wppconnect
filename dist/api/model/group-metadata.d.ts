import { Wid } from './wid';
export interface GroupMetadata {
    /** unique identifier for the group */
    id: Wid;
    /** timestamp of when the group was created */
    creation: number;
    owner: Wid;
    /** title/name of the group */
    subject: string;
    subjectTime: number;
    /** description of the group */
    desc: string;
    descId: string;
    descTime: number;
    descOwner: Wid;
    restrict: boolean;
    /** whether it is an announcement channel of a community */
    announce: boolean;
    noFrequentlyForwarded: boolean;
    ephemeralDuration: number;
    membershipApprovalMode: boolean;
    memberAddMode: 'admin_add' | string;
    reportToAdminMode: boolean;
    /** current amount of members including admins */
    size: number;
    support: boolean;
    suspended: boolean;
    terminated: boolean;
    uniqueShortNameMap: Object;
    isLidAddressingMode: boolean;
    isParentGroup: boolean;
    isParentGroupClosed: boolean;
    /** serialized chat ID of the parent group (community) */
    parentGroup: string | undefined;
    defaultSubgroup: boolean;
    generalSubgroup: boolean;
    generalChatAutoAddDisabled: boolean;
    allowNonAdminSubGroupCreation: boolean;
    lastActivityTimestamp: number;
    lastSeenActivityTimestamp: number;
    incognito: boolean;
    hasCapi: boolean;
    displayCadminPromotion: boolean;
    /** Current members of the group. See `pastParticipants` for former members. */
    participants: {
        id: Wid;
        isAdmin: boolean;
        isSuperAdmin: boolean;
    }[];
    /** members who applied for membership but still need admin approval */
    pendingParticipants: any[];
    /** former members who left the group or were kicked out */
    pastParticipants: {
        id: Wid;
        /** UNIX timestamp in seconds of when the leaving occurred */
        leaveTs: number;
        /** was leaving volumtary (`"Left"`) or forceful (`"Removed"`) */
        leaveReason: 'Left' | 'Removed';
    }[];
    membershipApprovalRequests: any[];
    subgroupSuggestions: any[];
}
