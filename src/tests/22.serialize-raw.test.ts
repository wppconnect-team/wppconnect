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
import { readFileSync } from 'fs';
import * as path from 'path';
import { ModuleKind, transpileModule } from 'typescript';
import { runInNewContext } from 'vm';

describe('WAPI raw serialization', function () {
  const source = readFileSync(
    path.join(__dirname, '../lib/wapi/serializers/serialize-raw.js'),
    'utf8'
  );
  const { outputText } = transpileModule(source, {
    compilerOptions: { module: ModuleKind.CommonJS },
  });
  const exports: Record<string, (model: unknown) => unknown> = {};
  runInNewContext(outputText, { exports });
  const serialize = exports._serializeRawObj;

  it('keeps chat data serializable without mutating a live collection', function () {
    const live = { _models: [] as Array<{ collection: unknown }> };
    live._models.push({ collection: live });
    const data = {
      id: 'fixture',
      metadata: { active: true },
      unreadCount: 2,
      msgUnsyncedButtonReplyMsgs: live,
    };

    const serialized = serialize({ toJSON: () => data });
    assert.deepStrictEqual(JSON.parse(JSON.stringify(serialized)), {
      id: 'fixture',
      metadata: { active: true },
      unreadCount: 2,
    });
    assert.strictEqual(data.msgUnsyncedButtonReplyMsgs, live);
    assert.strictEqual(live._models[0].collection, live);
  });
});
