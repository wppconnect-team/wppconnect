import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { Id, Wid } from '../model';
import { GroupProperty } from '../model/enum';
import { RetrieverLayer } from './retriever.layer';
export declare class GroupLayer extends RetrieverLayer {
    page: Page;
    constructor(page: Page, session?: string, options?: CreateConfig);
    /**
     * Removes the host device from the group
     * @category Group
     * @param groupId group id
     */
    leaveGroup(groupId: string): Promise<void>;
    /**
     * Retrieves group members as [Id] objects
     * @category Group
     * @param groupId group id
     */
    getGroupMembersIds(groupId: string): Promise<Id[]>;
    /**
     * Returns current group members as [Contact] objects
     * For previous members, see `groupMetadata.pastParticipants`.
     * @category Group
     * @param groupId
     */
    getGroupMembers(groupId: string): Promise<import("../model").Contact[]>;
    /**
     * Generates group-invite link
     * @category Group
     * @param chatId
     * @returns Invitation link
     */
    getGroupInviteLink(chatId: string): Promise<string>;
    /**
     * Revokes group-invite link and generates a new one.
     * @category Group
     * @param chatId
     * @returns Invitation link
     */
    revokeGroupInviteLink(chatId: string): Promise<string>;
    /**
     * Displays group info from an invitation link (or invitation ID)
     * @category Group
     * @param inviteCode
     * @returns Invite code or group link. Example: CMJYfPFqRyE2GxrnkldYED
     * @example getGroupInfoFromInviteLink('https://chat.whatsapp.com/invite/CMJYfPFqRyE2GxrnkldYED')
     * @example getGroupInfoFromInviteLink('CMJYfPFqRyE2GxrnkldYED')
     */
    getGroupInfoFromInviteLink(inviteCode: string): Promise<{
        descOwner: string | undefined;
        id: string;
        owner: string | undefined;
        participants: {
            id: string;
            isAdmin: boolean;
            isSuperAdmin: boolean;
        }[];
        subjectOwner: string | undefined;
        announce: boolean;
        creation: number;
        desc: string;
        descId: string;
        descTime: number;
        noFrequentlyForwarded: boolean;
        parent: boolean;
        pvId?: string;
        restrict: boolean;
        size: number;
        status: number;
        subject: string;
        subjectTime: number;
        support: boolean;
        suspended: boolean;
        isParentGroup: boolean;
        isParentGroupClosed: boolean;
        defaultSubgroup: boolean;
        generalSubgroup: boolean;
        membershipApprovalMode: boolean;
        isLidAddressingMode: boolean;
        generalChatAutoAddDisabled: boolean;
    }>;
    /**
     * Creates a new chat group
     * @category Group
     * @param groupName Group name
     * @param contacts Contacts that should be added.
     */
    createGroup(groupName: string, contacts: string | string[]): Promise<{
        gid: import("@wppconnect/wa-js/dist/whatsapp").Wid;
        participants: {
            [key: `${number}@c.us`]: {
                wid: string;
                code: number;
                invite_code: string | null;
                invite_code_exp: number | null;
            };
        };
    }>;
    /**
     * Removes participant from group
     * @category Group
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    removeParticipant(groupId: string, participantId: string | string[]): Promise<void>;
    /**
     * Adds participant to Group
     * @category Group
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    addParticipant(groupId: string, participantId: string | string[]): Promise<{
        [key: `${number}@c.us`]: {
            wid: string;
            code: number;
            message: string;
            invite_code: string | null;
            invite_code_exp: number | null;
        };
    }>;
    /**
     * Promotes participant as Admin in given group
     * @category Group
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    promoteParticipant(groupId: string, participantId: string | string[]): Promise<boolean>;
    /**
     * Demotes admin privileges of participant
     * @category Group
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    demoteParticipant(groupId: string, participantId: string | string[]): Promise<true | void>;
    /**
     * Retrieves group admins
     * @category Group
     * @param chatId Group/Chat id ('0000000000-00000000@g.us')
     */
    getGroupAdmins(chatId: string): Promise<import("@wppconnect/wa-js/dist/whatsapp").Wid[]>;
    /**
     * Join a group with an invite code or link
     * @category Group
     * @param inviteCode
     * @example joinGroup('https://chat.whatsapp.com/invite/CMJYfPFqRyE2GxrnkldYED')
     * @example joinGroup('CMJYfPFqRyE2GxrnkldYED')
     */
    joinGroup(inviteCode: string): Promise<{
        id: string;
    }>;
    /**
     * Set group description (if allowed)
     * @category Group
     * @param groupId Group ID ('000000-000000@g.us')
     * @param description New group description
     * @returns empty object
     */
    setGroupDescription(groupId: string, description: string): Promise<boolean>;
    /**
     * Set group subject (if allowed)
     * @category Group
     * @param groupId Group ID ('000000-000000@g.us')
     * @param title New group subject
     * @returns empty object
     */
    setGroupSubject(groupId: string, title: string): Promise<boolean>;
    /**
     * Enable or disable group properties, see {@link GroupProperty for details}
     * @category Group
     * @param groupId Group ID ('000000-000000@g.us')
     * @param property
     * @param value true or false
     * @returns empty object
     */
    setGroupProperty(groupId: string, property: GroupProperty, value: boolean): Promise<boolean>;
    /**
     * Set group icon
     * @category Group
     * @param groupId Group ID ('000000-000000@g.us')
     * @param base64 Image in base64 ( data:image/jpeg;base64,..... )
     * @returns empty object
     */
    setGroupIcon(groupId: string, pathOrBase64: string): Promise<{
        eurl: string;
        status: number;
        tag: string;
        token: string;
        _duplicate: boolean;
    }>;
    /**
     * Set group subject (if allowed)
     * @category Group
     * @param groupId Group ID ('0000000000@g.us')
     * @returns empty object
     */
    removeGroupIcon(groupId: string): Promise<boolean>;
    /**
     * Get the max number of participants for a group
     * @category Group
     * @returns number
     */
    getGroupSizeLimit(): Promise<number>;
    /**
     * Approve a membership request to group
     * @category Group
     * @param groupId Group ID ('000000-000000@g.us')
     * @param wid <number>@c.us
     * @returns Promise
     */
    approveGroupMembershipRequest(groupId: string, membershipIds: string | string[]): Promise<{
        error: any;
        wid: Wid;
    }[]>;
    /**
     * Reject a membership request to group
     * @category Group
     * @param groupId Group ID ('000000-000000@g.us')
     * @param wid <number>@c.us
     * @returns Promise
     */
    rejectGroupMembershipRequest(groupId: string, membershipIds: string | string[]): Promise<{
        error: any;
        wid: Wid;
    }[]>;
    /**
     * Retrieve a list of a membership approval requests
     * @category Group
     * @param groupId Group ID ('000000-000000@g.us')
     * @returns Promise
     */
    getGroupMembershipRequests(groupId: string): Promise<{
        addedBy: Wid;
        id: Wid;
        parentGroupId?: Wid;
        requestMethod: 'InviteLink' | 'LinkedGroupJoin' | 'NonAdminAdd';
        t: number;
    }[]>;
}
