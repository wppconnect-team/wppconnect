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

import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';

import { base64MimeType } from './base64-mimetype';
import { filenameFromMimeType } from './filename-from-mimetype';
import { LocalFileServer } from './local-file-server';

export interface ResolvedContent {
  /** Single-use `http://127.0.0.1:{port}/{token}` URL the browser can fetch. */
  url: string;
  /** Suggested filename derived from the source when none was supplied. */
  filename: string;
}

/**
 * Resolves a local file path or a base64 data-URI to a single-use URL served
 * by a {@link LocalFileServer}.  The browser fetches this URL directly via
 * HTTP, bypassing the Puppeteer CDP size limit that causes timeouts on large
 * files (issue #2413).
 *
 * @param input  Absolute file path or `data:<mime>;base64,<data>` string.
 * @param server A started {@link LocalFileServer} instance.
 *
 * @throws If the file does not exist or the data-URI is malformed.
 */
export function resolveLocalContent(
  input: string,
  server: LocalFileServer
): ResolvedContent {
  return input.startsWith('data:')
    ? fromDataUri(input, server)
    : fromFilePath(input, server);
}

// ── private ───────────────────────────────────────────────────────────────────

function fromDataUri(
  dataUri: string,
  server: LocalFileServer
): ResolvedContent {
  const commaIdx = dataUri.indexOf(',');
  if (commaIdx === -1) {
    throw fileError('Malformed base64 data-URI: missing comma separator');
  }

  const mimeType = base64MimeType(dataUri) ?? 'application/octet-stream';
  const buffer = Buffer.from(dataUri.slice(commaIdx + 1), 'base64');

  return {
    url: server.register(buffer, mimeType),
    filename: filenameFromMimeType('file', mimeType),
  };
}

function fromFilePath(
  filePath: string,
  server: LocalFileServer
): ResolvedContent {
  if (!fs.existsSync(filePath)) {
    throw fileError(`File not found: ${filePath}`);
  }

  const mimeType =
    (mimeTypes.lookup(filePath) as string | false) ||
    'application/octet-stream';

  return {
    url: server.register(filePath, mimeType),
    filename: path.basename(filePath),
  };
}

function fileError(message = 'Empty or invalid file or base64'): Error {
  return Object.assign(new Error(message), { code: 'empty_file' });
}
