
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
