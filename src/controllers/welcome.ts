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
import boxen from 'boxen';
import chalk from 'chalk';
import latestVersion from 'latest-version';
import { defaultLogger as logger } from '../utils/logger';
import { upToDate } from '../utils/semver';
const { version } = require('../../package.json');

// Global
let welcomeShown = false;
let updatesChecked = false;

export function welcomeScreen() {
  if (welcomeShown) {
    return;
  }
  welcomeShown = true;
  logger.info(`
   _       ______  ____  ______                            __ 
  | |     / / __ \\/ __ \\/ ____/___  ____  ____  ___  _____/ /_
  | | /| / / /_/ / /_/ / /   / __ \\/ __ \\/ __ \\/ _ \\/ ___/ __/
  | |/ |/ / ____/ ____/ /___/ /_/ / / / / / / /  __/ /__/ /_  
  |__/|__/_/   /_/    \\____/\\____/_/ /_/_/ /_/\\___/\\___/\\__/`);
}

export async function checkUpdates() {
  // Check for updates if needed
  if (!updatesChecked) {
    updatesChecked = true;
    await checkWPPConnectVersion();
  }
}

/**
 * Checks for a new version of WPPConnect and logs the result
 */
async function checkWPPConnectVersion() {
  logger.info('Checking for updates');
  await latestVersion('@wppconnect-team/wppconnect')
    .then((latest) => {
      if (upToDate(version, latest)) {
        logger.info("You're up to date");
      } else {
        logger.info('There is a new version available');
        logUpdateAvailable(version, latest);
      }
    })
    .catch(() => {
      logger.warn('Failed to check for updates');
    });
}

/**
 * Logs a boxen of instructions to update
 * @param current
 * @param latest
 */
function logUpdateAvailable(current: string, latest: string) {
  // prettier-ignore
  const newVersionLog =
      `There is a new version of ${chalk.bold(`Wppconnect`)} ${chalk.gray(current)} ➜  ${chalk.bold.green(latest)}\n` +
      `Update your package by running:\n\n` +
      `${chalk.bold('\>')} ${chalk.blueBright('npm update @wppconnect-team/wppconnect')}`;

  logger.info(boxen(newVersionLog, { padding: 1 }));
  logger.info(
    `For more info visit: ${chalk.underline(
      'https://github.com/wppconnect-team/wppconnect/blob/master/README.md#update-checking'
    )}\n`
  );
}
