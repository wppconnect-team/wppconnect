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
import { config, createLogger, format, transports } from 'winston';
import { FormatWrap, TransformableInfo } from 'logform';

export type LogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

export interface MetaInfo {
  session?: string;
  type?: string;
}

export interface SessionInfo extends TransformableInfo, MetaInfo {}

export const formatLabelSession: FormatWrap = format(
  (info: SessionInfo, opts?: any) => {
    const parts = [];
    if (info.session) {
      parts.push(info.session);
      delete info.session;
    }
    if (info.type) {
      parts.push(info.type);
      delete info.type;
    }

    if (parts.length) {
      let prefix = parts.join(':');
      info.message = `[${prefix}] ${info.message}`;
    }
    return info;
  }
);

export const defaultLogger = createLogger({
  level: 'silly',
  levels: config.npm.levels,
  format: format.combine(
    formatLabelSession(),
    format.colorize(),
    format.padLevels(),
    format.simple()
  ),
  //   defaultMeta: { service: 'venon-bot' },
  transports: [new transports.Console()],
});
