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

import * as assert from 'assert';
import { runInNewContext } from 'vm';

import { LabelsLayer } from '../api/layers/labels.layer';

function createLabelsLayer(mockWppLabels: Record<string, unknown>) {
  return Object.assign(Object.create(LabelsLayer.prototype), {
    page: {
      evaluate(callback: (...args: unknown[]) => unknown, ...args: unknown[]) {
        return runInNewContext(`(${callback.toString()})(...args)`, {
          WPP: { labels: mockWppLabels },
          args,
        });
      },
    },
  }) as LabelsLayer;
}

describe('LabelsLayer', function () {
  describe('addNewLabel', function () {
    it('creates a new label with name only and returns the created Label', async function () {
      let passedName = '';
      let passedOptions: unknown = undefined;
      const expectedLabel = {
        id: '10',
        name: 'Urgent',
        color: 1,
        count: 0,
        hexColor: '#ff0000',
        colorIndex: 1,
      };

      const layer = createLabelsLayer({
        addNewLabel: async (name: string, options: unknown) => {
          passedName = name;
          passedOptions = options;
          return expectedLabel;
        },
      });

      const result = await layer.addNewLabel('Urgent');
      assert.strictEqual(passedName, 'Urgent');
      assert.strictEqual(passedOptions, undefined);
      assert.deepStrictEqual(result, expectedLabel);
    });

    it('creates a new label with color options and returns the created Label', async function () {
      let passedName = '';
      let passedOptions: unknown = undefined;
      const expectedLabel = {
        id: '11',
        name: 'VIP',
        color: null,
        count: 0,
        hexColor: '#dfaef0',
        colorIndex: 0,
      };

      const layer = createLabelsLayer({
        addNewLabel: async (name: string, options: unknown) => {
          passedName = name;
          passedOptions = options;
          return expectedLabel;
        },
      });

      const result = await layer.addNewLabel('VIP', { labelColor: '#dfaef0' });
      assert.strictEqual(passedName, 'VIP');
      assert.deepStrictEqual(passedOptions, { labelColor: '#dfaef0' });
      assert.deepStrictEqual(result, expectedLabel);
    });

    it('propagates failure when addNewLabel rejects', async function () {
      const error = new Error('Label creation failed');
      const layer = createLabelsLayer({
        addNewLabel: async () => {
          throw error;
        },
      });

      await assert.rejects(layer.addNewLabel('Fail'), (e) => e === error);
    });
  });

  describe('editLabel', function () {
    it('edits a label and returns the updated Label', async function () {
      let passedId = '';
      let passedOptions: unknown = undefined;
      const expectedLabel = {
        id: '10',
        name: 'Renamed',
        color: 2,
        count: 5,
        hexColor: '#00ff00',
        colorIndex: 2,
      };

      const layer = createLabelsLayer({
        editLabel: async (id: string, options: unknown) => {
          passedId = id;
          passedOptions = options;
          return expectedLabel;
        },
      });

      const result = await layer.editLabel('10', {
        name: 'Renamed',
        labelColor: '#00ff00',
      });
      assert.strictEqual(passedId, '10');
      assert.deepStrictEqual(passedOptions, {
        name: 'Renamed',
        labelColor: '#00ff00',
      });
      assert.deepStrictEqual(result, expectedLabel);
    });

    it('propagates failure when editLabel rejects', async function () {
      const error = new Error('Label not found');
      const layer = createLabelsLayer({
        editLabel: async () => {
          throw error;
        },
      });

      await assert.rejects(
        layer.editLabel('99', { name: 'None' }),
        (e) => e === error
      );
    });
  });

  describe('addOrRemoveLabels', function () {
    it('delegates string chatIds and options to browser WPP.labels.addOrRemoveLabels', async function () {
      let passedChatIds: unknown;
      let passedOptions: unknown;

      const layer = createLabelsLayer({
        addOrRemoveLabels: async (chatIds: unknown, options: unknown) => {
          passedChatIds = chatIds;
          passedOptions = options;
          return { status: 200 };
        },
      });

      const result = await layer.addOrRemoveLabels('123@c.us', [
        { labelId: '1', type: 'add' },
      ]);
      assert.strictEqual(passedChatIds, '123@c.us');
      assert.deepStrictEqual(passedOptions, [{ labelId: '1', type: 'add' }]);
      assert.deepStrictEqual(result, { status: 200 });
    });

    it('delegates array of chatIds to browser WPP.labels.addOrRemoveLabels', async function () {
      let passedChatIds: unknown;
      let passedOptions: unknown;

      const layer = createLabelsLayer({
        addOrRemoveLabels: async (chatIds: unknown, options: unknown) => {
          passedChatIds = chatIds;
          passedOptions = options;
          return { status: 200 };
        },
      });

      const result = await layer.addOrRemoveLabels(
        ['123@c.us', '456@c.us'],
        [
          { labelId: '1', type: 'add' },
          { labelId: '2', type: 'remove' },
        ]
      );
      assert.deepStrictEqual(passedChatIds, ['123@c.us', '456@c.us']);
      assert.deepStrictEqual(passedOptions, [
        { labelId: '1', type: 'add' },
        { labelId: '2', type: 'remove' },
      ]);
      assert.deepStrictEqual(result, { status: 200 });
    });

    it('waits for the browser promise before resolving', async function () {
      let complete!: () => void;
      const action = new Promise<void>((resolve) => {
        complete = resolve;
      });
      const layer = createLabelsLayer({
        addOrRemoveLabels: () => action,
      });

      let returned = false;
      const result = layer
        .addOrRemoveLabels('123@c.us', [{ labelId: '1', type: 'add' }])
        .then(() => {
          returned = true;
        });

      await Promise.resolve();
      assert.strictEqual(returned, false);
      complete();
      await result;
      assert.strictEqual(returned, true);
    });

    it('propagates rejection when addOrRemoveLabels throws', async function () {
      const error = new Error('Failed to update labels');
      const layer = createLabelsLayer({
        addOrRemoveLabels: async () => {
          throw error;
        },
      });

      await assert.rejects(
        layer.addOrRemoveLabels('123@c.us', [{ labelId: '1', type: 'add' }]),
        (e) => e === error
      );
    });
  });

  describe('getAllLabels', function () {
    it('returns all labels', async function () {
      const expectedLabels = [
        {
          id: '1',
          name: 'New customer',
          color: 1,
          count: 2,
          hexColor: '#00a884',
        },
        {
          id: '2',
          name: 'Order complete',
          color: 2,
          count: 0,
          hexColor: '#34b7f1',
        },
      ];

      const layer = createLabelsLayer({
        getAllLabels: async () => expectedLabels,
      });

      const result = await layer.getAllLabels();
      assert.deepStrictEqual(result, expectedLabels);
    });
  });

  describe('getLabelById', function () {
    it('returns the label when found instead of undefined', async function () {
      const expectedLabel = {
        id: '1',
        name: 'New customer',
        color: 1,
        count: 2,
        hexColor: '#00a884',
      };

      const layer = createLabelsLayer({
        getLabelById: async (id: string) => {
          if (id === '1') return expectedLabel;
          return null;
        },
      });

      const result = await layer.getLabelById('1');
      assert.deepStrictEqual(result, expectedLabel);
    });

    it('propagates rejection when getLabelById fails', async function () {
      const error = new Error('Error retrieving label');
      const layer = createLabelsLayer({
        getLabelById: async () => {
          throw error;
        },
      });

      await assert.rejects(layer.getLabelById('1'), (e) => e === error);
    });
  });

  describe('getLabelColorPalette', function () {
    it('returns the color palette array', async function () {
      const expectedPalette = ['#00a884', '#34b7f1', '#f15c6d'];
      const layer = createLabelsLayer({
        getLabelColorPalette: async () => expectedPalette,
      });

      const result = await layer.getLabelColorPalette();
      assert.deepStrictEqual(result, expectedPalette);
    });
  });

  describe('deleteAllLabels', function () {
    it('delegates to browser WPP.labels.deleteAllLabels and returns the result', async function () {
      const expected = [{ id: '1', deleteLabelResult: { status: 200 } }];
      const layer = createLabelsLayer({
        deleteAllLabels: async () => expected,
      });

      const result = await layer.deleteAllLabels();
      assert.deepStrictEqual(result, expected);
    });
  });

  describe('deleteLabel', function () {
    it('deletes a single label by id and returns the result', async function () {
      let passedId: unknown;
      const expected = { id: '1', deleteLabelResult: { status: 200 } };
      const layer = createLabelsLayer({
        deleteLabel: async (id: unknown) => {
          passedId = id;
          return expected;
        },
      });

      const result = await layer.deleteLabel('1');
      assert.strictEqual(passedId, '1');
      assert.deepStrictEqual(result, expected);
    });

    it('deletes multiple labels by ids array and returns the result array', async function () {
      let passedIds: unknown;
      const expected = [
        { id: '1', deleteLabelResult: { status: 200 } },
        { id: '2', deleteLabelResult: { status: 200 } },
      ];
      const layer = createLabelsLayer({
        deleteLabel: async (ids: unknown) => {
          passedIds = ids;
          return expected;
        },
      });

      const result = await layer.deleteLabel(['1', '2']);
      assert.deepStrictEqual(passedIds, ['1', '2']);
      assert.deepStrictEqual(result, expected);
    });
  });
});
