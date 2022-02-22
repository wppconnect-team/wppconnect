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

import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { evaluateAndReturn } from '../helpers';
import { Id } from '../model';
import { GroupProperty } from '../model/enum';
import { RetrieverLayer } from './retriever.layer';

export class GroupLayer extends RetrieverLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Removes the host device from the group
   * @category Group
   * @param groupId group id
   */
  public async leaveGroup(groupId: string) {
    return evaluateAndReturn(
      this.page,
      (groupId) => WPP.group.leave(groupId),
      groupId
    );
  }

  /**
   * Retrieves group members as [Id] objects
   * @category Group
   * @param groupId group id
   */
  public async getGroupMembersIds(groupId: string): Promise<Id[]> {
    return evaluateAndReturn(
      this.page,
      (groupId: string) =>
        Promise.resolve(WPP.group.getParticipants(groupId)).then(
          (participants) => participants.map((p) => p.id as any)
        ),
      groupId
    );
  }

  /**
   * Returns group members [Contact] objects
   * @category Group
   * @param groupId
   */
  public async getGroupMembers(groupId: string) {
    const membersIds = await this.getGroupMembersIds(groupId);
    const actions = membersIds.map((memberId) => {
      return this.getContact(memberId._serialized);
    });
    return Promise.all(actions);
  }

  /**
   * Generates group-invite link
   * @category Group
   * @param chatId
   * @returns Invitation link
   */
  public async getGroupInviteLink(chatId: string) {
    const code = await evaluateAndReturn(
      this.page,
      (chatId) => WPP.group.getInviteCode(chatId),
      chatId
    );

    return `https://chat.whatsapp.com/${code}`;
  }

  /**
   * Revokes group-invite link and generate new one.
   * @category Group
   * @param chatId
   * @returns Invitation link
   */
  public async revokeGroupInviteLink(chatId: string) {
    const code = await evaluateAndReturn(
      this.page,
      (chatId) => WPP.group.revokeInviteCode(chatId),
      chatId
    );

    return `https://chat.whatsapp.com/${code}`;
  }

  /**
   * Generates group-invite link
   * @category Group
   * @param inviteCode
   * @returns Invite code from group link. Example: CMJYfPFqRyE2GxrnkldYED
   */
  public async getGroupInfoFromInviteLink(inviteCode: string) {
    inviteCode = inviteCode.replace('chat.whatsapp.com/', '');
    inviteCode = inviteCode.replace('invite/', '');
    inviteCode = inviteCode.replace('https://', '');
    inviteCode = inviteCode.replace('http://', '');
    return await evaluateAndReturn(
      this.page,
      (inviteCode) => WPP.group.getGroupInfoFromInviteCode(inviteCode),
      inviteCode
    );
  }

  /**
   * Creates a new chat group
   * @category Group
   * @param groupName Group name
   * @param contacts Contacts that should be added.
   */
  public async createGroup(groupName: string, contacts: string | string[]) {
    return await evaluateAndReturn(
      this.page,
      ({ groupName, contacts }) => WPP.group.create(groupName, contacts),
      { groupName, contacts }
    );
  }

  /**
   * Removes participant from group
   * @category Group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async removeParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    await evaluateAndReturn(
      this.page,
      ({ groupId, participantId }) =>
        WPP.group.removeParticipants(groupId, participantId),
      { groupId, participantId }
    );

    return true;
  }

  /**
   * Adds participant to Group
   * @category Group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async addParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    await evaluateAndReturn(
      this.page,
      ({ groupId, participantId }) =>
        WPP.group.addParticipants(groupId, participantId),
      { groupId, participantId }
    );

    return true;
  }

  /**
   * Promotes participant as Admin in given group
   * @category Group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async promoteParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    await evaluateAndReturn(
      this.page,
      ({ groupId, participantId }) =>
        WPP.group.promoteParticipants(groupId, participantId),
      { groupId, participantId }
    );

    return true;
  }

  /**
   * Demotes admin privileges of participant
   * @category Group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async demoteParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    return await evaluateAndReturn(
      this.page,
      ({ groupId, participantId }) =>
        WPP.group.demoteParticipants(groupId, participantId),
      { groupId, participantId }
    );

    return true;
  }

  /**
   * Retrieves group admins
   * @category Group
   * @param chatId Group/Chat id ('0000000000-00000000@g.us')
   */
  public async getGroupAdmins(chatId: string) {
    const participants = await evaluateAndReturn(
      this.page,
      (chatId) =>
        Promise.resolve(WPP.group.getParticipants(chatId)).then(
          (participants) => participants.map((p) => p.toJSON())
        ),
      chatId
    );

    return participants.filter((p) => p.isAdmin).map((p) => p.id);
  }
  /**
   * Join a group with invite code
   * @category Group
   * @param inviteCode
   */
  public async joinGroup(inviteCode: string) {
    inviteCode = inviteCode.replace('chat.whatsapp.com/', '');
    inviteCode = inviteCode.replace('invite/', '');
    inviteCode = inviteCode.replace('https://', '');
    inviteCode = inviteCode.replace('http://', '');
    return await evaluateAndReturn(
      this.page,
      (inviteCode) => WPP.group.join(inviteCode),
      inviteCode
    );
  }

  /**
   * Set group description (if allowed)
   * @category Group
   * @param groupId Group ID ('000000-000000@g.us')
   * @param description New group description
   * @returns empty object
   */
  public async setGroupDescription(groupId: string, description: string) {
    return await evaluateAndReturn(
      this.page,
      ({ groupId, description }) =>
        WPP.group.setDescription(groupId, description),
      { groupId, description }
    );
  }

  /**
   * Set group subject (if allowed)
   * @category Group
   * @param groupId Group ID ('000000-000000@g.us')
   * @param title New group subject
   * @returns empty object
   */
  public async setGroupSubject(groupId: string, title: string) {
    return await evaluateAndReturn(
      this.page,
      ({ groupId, title }) => WPP.group.setSubject(groupId, title),
      { groupId, title }
    );
  }

  /**
   * Enable or disable group properties, see {@link GroupProperty for details}
   * @category Group
   * @param groupId Group ID ('000000-000000@g.us')
   * @param property
   * @param value true or false
   * @returns empty object
   */
  public async setGroupProperty(
    groupId: string,
    property: GroupProperty,
    value: boolean
  ) {
    return await evaluateAndReturn(
      this.page,
      ({ groupId, property, value }) =>
        WPP.group.setProperty(groupId, property, value),
      { groupId, property, value }
    );
  }
}
