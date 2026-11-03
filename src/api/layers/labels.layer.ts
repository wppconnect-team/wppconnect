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
import {
  AddOrRemoveLabelsOptions,
  DeleteLabelReturn,
  EditLabelOptions,
  Label,
  NewLabelOptions,
} from '../model';
import { ListsLayer } from './lists.layer';

export class LabelsLayer extends ListsLayer {
  constructor(public page: Page, session?: string, options?: CreateConfig) {
    super(page, session, options);
  }

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
  public async addNewLabel(
    name: string,
    options?: NewLabelOptions | string
  ): Promise<Label> {
    return await evaluateAndReturn(
      this.page,
      ({ name, options }) => WPP.labels.addNewLabel(name, options as any),
      { name, options }
    );
  }

  /**
   * Edit an existing Label
   * @category Labels
   *
   * @example
   * ```javascript
   * client.editLabel('1', { name: 'New label name' });
   * //or
   * client.editLabel('1', { labelColor: '#dfaef0' });
   * ```
   * @param id Id of label
   * @param options options of label
   */
  public async editLabel(
    id: string,
    options?: EditLabelOptions
  ): Promise<Label> {
    return await evaluateAndReturn(
      this.page,
      ({ id, options }) => WPP.labels.editLabel(id, options),
      { id, options }
    );
  }

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
  public async addOrRemoveLabels(
    chatIds: string | string[],
    options: AddOrRemoveLabelsOptions | AddOrRemoveLabelsOptions[]
  ): Promise<any> {
    return await evaluateAndReturn(
      this.page,
      ({ chatIds, options }) => WPP.labels.addOrRemoveLabels(chatIds, options),
      { chatIds, options }
    );
  }

  /**
   * Get all Labels
   *
   * @example
   * ```javascript
   * client.getAllLabels();
   * ```
   */
  public async getAllLabels(): Promise<Label[]> {
    return evaluateAndReturn(this.page, () => WPP.labels.getAllLabels());
  }

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
  public async getLabelById(id: string): Promise<Label> {
    return await evaluateAndReturn(
      this.page,
      ({ id }) => WPP.labels.getLabelById(id),
      { id }
    );
  }

  /**
   * Get color palette for labels
   * @category Labels
   *
   * @example
   * ```javascript
   * client.getLabelColorPalette();
   * ```
   */
  public async getLabelColorPalette(): Promise<string[]> {
    return evaluateAndReturn(this.page, () =>
      WPP.labels.getLabelColorPalette()
    );
  }

  /**
   * Delete all Labels
   * @category Labels
   *
   * @example
   * ```javascript
   * client.deleteAllLabels();
   * ```
   */
  public async deleteAllLabels(): Promise<DeleteLabelReturn[]> {
    return await evaluateAndReturn(this.page, () =>
      WPP.labels.deleteAllLabels()
    );
  }

  /**
   * Delete label(s) by id
   * @category Labels
   *
   * @example
   * ```javascript
   * client.deleteLabel('1');
   * ```
   * @param id Id or string array of labels to delete
   */
  public async deleteLabel(
    id: string | string[]
  ): Promise<DeleteLabelReturn | DeleteLabelReturn[]> {
    return await evaluateAndReturn(
      this.page,
      ({ id }) => WPP.labels.deleteLabel(id as any),
      { id }
    );
  }
}
