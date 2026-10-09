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
import { CommentApi, Wid } from '../model';
import { NewsletterLayer } from './newsletter.layer';

export class CommunityLayer extends NewsletterLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

  /**
   * Read locally synchronized replies to a community announcement, oldest first.
   * This does not mark the comments as read. Missing linked-device history is not fetched.
   * @category Community
   */
  public async getComments(messageId: string) {
    return evaluateAndReturn(
      this.page,
      (messageId) => {
        const api = WPP.chat as typeof WPP.chat & CommentApi;
        if (typeof api.getComments !== 'function') {
          throw new Error(
            'Community comments require a WA-JS build with comment support'
          );
        }
        return api.getComments(messageId);
      },
      messageId
    );
  }

  /**
   * Send a text reply inside a community announcement.
   * Only messageSendResult === 'OK' confirms sending. Check before retrying any failure.
   * @category Community
   */
  public async sendCommentMessage(messageId: string, text: string) {
    return evaluateAndReturn(
      this.page,
      (messageId, text) => {
        const api = WPP.chat as typeof WPP.chat & CommentApi;
        if (typeof api.sendCommentMessage !== 'function') {
          throw new Error(
            'Community comments require a WA-JS build with comment support'
          );
        }
        return api.sendCommentMessage(messageId, text);
      },
      messageId,
      text
    );
  }

  /**
   * Create a community
   *
   * @category Community
   * @param groupIds Array with groups id
   */
  public async createCommunity(
    name: string,
    description: string,
    groupIds: string[] | Wid[]
  ): Promise<any> {
    return evaluateAndReturn(
      this.page,
      (name, description, groupIds) =>
        WPP.community.create(name, description, groupIds),
      name,
      description,
      groupIds
    );
  }

  /**
   * Deactivate a community
   * @category Community
   * @param communityId id
   */
  public async deactivateCommunity(communityId: string | Wid): Promise<any> {
    return evaluateAndReturn(
      this.page,
      (communityId) => WPP.community.deactivate(communityId),
      communityId
    );
  }

  /**
   * Add groups to community
   *
   * @category Community
   * @param communityId id
   */
  public async addSubgroupsCommunity(
    communityId: string | Wid,
    groupsIds: string[]
  ): Promise<any> {
    return evaluateAndReturn(
      this.page,
      (communityId, groupsIds) =>
        WPP.community.addSubgroups(communityId, groupsIds),
      communityId,
      groupsIds
    );
  }

  /**
   * Remove groups of community
   *
   * @category Community
   * @param communityId id
   */
  public async removeSubgroupsCommunity(
    communityId: string | Wid,
    groupsIds: string[]
  ): Promise<any> {
    return evaluateAndReturn(
      this.page,
      (communityId, groupsIds) =>
        WPP.community.removeSubgroups(communityId, groupsIds),
      communityId,
      groupsIds
    );
  }

  /**
   * Remove admin of community participant
   *
   * @category Community
   * @param communityId id
   */
  public async demoteCommunityParticipant(
    communityId: string | Wid,
    participantId: string[] | string
  ): Promise<any> {
    return evaluateAndReturn(
      this.page,
      (communityId, participantId) =>
        WPP.community.demoteParticipants(communityId, participantId),
      communityId,
      participantId
    );
  }

  /**
   * Promote participant of community to admin
   *
   * @category Community
   * @param communityId id
   */
  public async promoteCommunityParticipant(
    communityId: string | Wid,
    participantId: string[] | string
  ): Promise<any> {
    return evaluateAndReturn(
      this.page,
      (communityId, participantId) =>
        WPP.community.promoteParticipants(communityId, participantId),
      communityId,
      participantId
    );
  }

  /**
   * Get all participants of a community
   *
   * @category Community
   * @param communityId id
   */
  public async getCommunityParticipants(
    communityId: string | Wid
  ): Promise<any> {
    return evaluateAndReturn(
      this.page,
      (communityId) => WPP.community.getParticipants(communityId),
      communityId
    );
  }
}
