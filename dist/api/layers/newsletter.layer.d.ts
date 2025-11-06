import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { HostLayer } from './host.layer';
export declare class NewsletterLayer extends HostLayer {
    page: Page;
    constructor(page: Page, session?: string, options?: CreateConfig);
    /**
     * Create Newsletter
     * @category Newsletter
     *
     * @example
     * ```javascript
     * client.createNewsletter('Name for your newsletter', {description: 'Description for that', picture: '<base64_string',});
     * ```
     * @param name Name Newsletter
     * @param options options Newsletter, description and picture
     */
    createNewsletter(name: string, options?: {
        description?: string;
        picture?: string;
    }): Promise<import("@wppconnect/wa-js/dist/newsletter/functions/create").ResultCreateNewsletter>;
    /**
     * Destroy a Newsletter
     * @category Newsletter
     *
     * @example
     * ```javascript
     * client.destroyNewsletter('[newsletter-id]@newsletter');
     * ```
     * @param name id of Newsletter
     */
    destroyNewsletter(id: string): Promise<boolean>;
    /**
     * Edit a Newsletter
     * @category Newsletter
     *
     * @example
     * ```javascript
     * client.editNewsletter('[newsletter-id]@newsletter', {
        description: 'new description';
        name: 'new name';
        picture: '<new pic base64>';
      });
     * ```
     * @param name id of Newsletter
     */
    editNewsletter(id: string, opts?: {
        description?: string;
        name?: string;
        picture?: string | null;
    }): Promise<import("@wppconnect/wa-js/dist/newsletter/functions/edit").ResultCreateNewsletter>;
    /**
     * Mute a Newsletter
     * @category Newsletter
     *
     * @example
     * ```javascript
     * client.muteNewsletter('[newsletter-id]@newsletter');
     * ```
     * @param name id of Newsletter
     */
    muteNesletter(id: string): Promise<import("@wppconnect/wa-js/dist/whatsapp").ChatModel>;
}
