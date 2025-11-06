import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { CatalogLayer } from './catalog.layer';
export declare class LabelsLayer extends CatalogLayer {
    page: Page;
    constructor(page: Page, session?: string, options?: CreateConfig);
    /**
     * Create New Label
     * @category Labels
     *
     * @example
     * ```javascript
     * client.addNewLabel(`Name of label`);
     * //or
     * client.addNewLabel(`Name of label`, { labelColor: '#dfaef0' });
     * //or
     * client.addNewLabel(`Name of label`, { labelColor: 4292849392 });
     * ```
     * @param name Name of label
     * @param options options of label
     */
    addNewLabel(name: string, options?: string): Promise<void>;
    /**
     * Add or delete label of chatId
     * @category Labels
     *
     * @example
     * ```javascript
     * client.addOrRemoveLabels(['[number]@c.us','[number]@c.us'],
     * [
     *   { labelId:'76', type:'add' },
     *   { labelId:'75', type:'remove' }
     * ]);
     * //or
     * ```
     * @param chatIds ChatIds
     * @param options options to remove or add
     */
    addOrRemoveLabels(chatIds: string, options: {
        labelId: string;
        type: 'add' | 'remove';
    }[]): Promise<void>;
    /**
     * Get all Labels
     *
     * @example
     * ```javascript
     * client.getAllLabels();
     * ```
     */
    getAllLabels(): Promise<import("@wppconnect/wa-js/dist/labels").Label[]>;
    /**
     * Get Label by id
     * @category Labels
     * @param id - Id of label
     *
     * @example
     * ```javascript
     * client.getLabelById('1');
     * ```
     */
    getLabelById(id: string): Promise<void>;
    /**
     * Delete all Labels
     * @category Labels
     *
     * @example
     * ```javascript
     * client.deleteAllLabels();
     * ```
     */
    deleteAllLabels(): Promise<void>;
    /**
     * Add or delete label of chatId
     * @category Labels
     *
     * @example
     * ```javascript
     * client.deleteLabel();
     * ```
     * @param id Id or string to labels to delete
     */
    deleteLabel(id: string | string[]): Promise<void>;
}
