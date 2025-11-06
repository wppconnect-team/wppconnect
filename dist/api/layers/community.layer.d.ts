import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { Wid } from '../model';
import { NewsletterLayer } from './newsletter.layer';
export declare class CommunityLayer extends NewsletterLayer {
    page: Page;
    constructor(page: Page, session?: string, options?: CreateConfig);
    /**
     * Create a community
     *
     * @category Community
     * @param groupIds Array with groups id
     */
    createCommunity(name: string, description: string, groupIds: string[] | Wid[]): Promise<any>;
    /**
     * Deactivate a community
     * @category Community
     * @param communityId id
     */
    deactivateCommunity(communityId: string | Wid): Promise<any>;
    /**
     * Add groups to community
     *
     * @category Community
     * @param communityId id
     */
    addSubgroupsCommunity(communityId: string | Wid, groupsIds: string[]): Promise<any>;
    /**
     * Remove groups of community
     *
     * @category Community
     * @param communityId id
     */
    removeSubgroupsCommunity(communityId: string | Wid, groupsIds: string[]): Promise<any>;
    /**
     * Remove admin of community participant
     *
     * @category Community
     * @param communityId id
     */
    demoteCommunityParticipant(communityId: string | Wid, participantId: string[] | string): Promise<any>;
    /**
     * Promote participant of community to admin
     *
     * @category Community
     * @param communityId id
     */
    promoteCommunityParticipant(communityId: string | Wid, participantId: string[] | string): Promise<any>;
    /**
     * Get all participants of a community
     *
     * @category Community
     * @param communityId id
     */
    getCommunityParticipants(communityId: string | Wid): Promise<any>;
}
