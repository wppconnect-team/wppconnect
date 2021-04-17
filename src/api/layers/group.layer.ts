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
   * @param groupId group id
   */
  public async leaveGroup(groupId: string) {
    return this.page.evaluate((groupId) => WAPI.leaveGroup(groupId), groupId);
  }

  /**
   * Retrieves group members as [Id] objects
   * @param groupId group id
   */
  public async getGroupMembersIds(groupId: string): Promise<Id[]> {
    return this.page.evaluate(
      (groupId: string) => WAPI.getGroupParticipantIDs(groupId),
      groupId
    );
  }

  /**
   * Returns group members [Contact] objects
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
   * @param chatId
   * @returns Invitation link
   */
  public async getGroupInviteLink(chatId: string) {
    return await this.page.evaluate(
      (chatId) => WAPI.getGroupInviteLink(chatId),
      chatId
    );
  }
  /**
   * Generates group-invite link
   * @param inviteCode
   * @returns Invite code from group link. Example: CMJYfPFqRyE2GxrnkldYED
   */
  public async getGroupInfoFromInviteLink(inviteCode: string) {
    inviteCode = inviteCode.replace('chat.whatsapp.com/', '');
    inviteCode = inviteCode.replace('invite/', '');
    inviteCode = inviteCode.replace('https://', '');
    inviteCode = inviteCode.replace('http://', '');
    return await this.page.evaluate(
      (inviteCode) => WAPI.getGroupInfoFromInviteLink(inviteCode),
      inviteCode
    );
  }

  /**
   * Creates a new chat group
   * @param groupName Group name
   * @param contacts Contacts that should be added.
   */
  public async createGroup(groupName: string, contacts: string | string[]) {
    return await this.page.evaluate(
      ({ groupName, contacts }) => WAPI.createGroup(groupName, contacts),
      { groupName, contacts }
    );
  }

  /**
   * Removes participant from group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async removeParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.removeParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Adds participant to Group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async addParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.addParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Promotes participant as Admin in given group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async promoteParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.promoteParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Demotes admin privileges of participant
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async demoteParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.demoteParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Retrieves group admins
   * @param chatId Group/Chat id ('0000000000-00000000@g.us')
   */
  public async getGroupAdmins(chatId: string) {
    return await this.page.evaluate(
      (chatId) => WAPI.getGroupAdmins(chatId),
      chatId
    );
  }
  /**
   * Join a group with invite code
   * @param inviteCode
   */
  public async joinGroup(inviteCode: string) {
    inviteCode = inviteCode.replace('chat.whatsapp.com/', '');
    inviteCode = inviteCode.replace('invite/', '');
    inviteCode = inviteCode.replace('https://', '');
    inviteCode = inviteCode.replace('http://', '');
    return await this.page.evaluate(
      (inviteCode) => WAPI.joinGroup(inviteCode),
      inviteCode
    );
  }

  /**
   * Set group description (if allowed)
   * @param groupId Group ID ('000000-000000@g.us')
   * @param description New group description
   * @returns empty object
   */
  public async setGroupDescription(groupId: string, description: string) {
    return await evaluateAndReturn(
      this.page,
      ({ groupId, description }) =>
        WAPI.setGroupDescription(groupId, description),
      { groupId, description }
    );
  }

  /**
   * Set group subject (if allowed)
   * @param groupId Group ID ('000000-000000@g.us')
   * @param title New group subject
   * @returns empty object
   */
  public async setGroupSubject(groupId: string, title: string) {
    return await evaluateAndReturn(
      this.page,
      ({ groupId, title }) => WAPI.setGroupSubject(groupId, title),
      { groupId, title }
    );
  }

  /**
   * Enable or disable group properties, see {@link GroupProperty for details}
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
        WAPI.setGroupProperty(groupId, property, value),
      { groupId, property, value }
    );
  }
}
