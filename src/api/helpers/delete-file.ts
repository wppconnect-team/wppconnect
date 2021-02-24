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

import path = require('path');
import { unlinkSync, existsSync } from 'fs';
import { Logger } from 'winston';
export function deleteFiles(
  mergedOptions: any,
  session: string,
  logger: Logger
) {
  logger.info('Removind token file...', { session, type: 'token' });
  const pathTokens: string = path.join(
    path.resolve(
      process.cwd() + mergedOptions.mkdirFolderToken,
      mergedOptions.folderNameToken
    ),
    `${session}.data.json`
  );
  if (existsSync(pathTokens)) {
    try {
      unlinkSync(pathTokens);
      logger.info(`Removed file: ${pathTokens}`, {
        session,
        type: 'token',
      });
    } catch (err) {
      logger.warn(`Not removed file: ${pathTokens}`, {
        session,
        type: 'token',
      });
    }
  } else {
    logger.warn(`Not Files: ${pathTokens}`, { session, type: 'token' });
  }
}
