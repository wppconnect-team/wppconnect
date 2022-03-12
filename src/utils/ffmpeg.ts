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
import execa from 'execa';
import * as fs from 'fs';
import * as path from 'path';
import rimraf from 'rimraf';
import * as tmp from 'tmp';
import { lookpath } from 'lookpath';

const tmpDir = tmp.dirSync({});

let i = 0;

process.on('exit', () => {
  // Remove only on exit signal
  try {
    // Use rimraf because it is synchronous
    rimraf.sync(tmpDir.name);
  } catch (error) {}
});

export async function getFfmpegPath() {
  let ffmpegPath = process.env['FFMPEG_PATH'];

  if (ffmpegPath) {
    const isExecutable = await fs.promises
      .access(ffmpegPath, fs.constants.X_OK)
      .then(() => true)
      .catch(() => false);

    if (isExecutable) {
      return ffmpegPath;
    }
  }

  ffmpegPath = await lookpath('ffmpeg', {
    include: [
      'C:\\FFmpeg\\bin',
      'C:\\FFmpeg\\FFmpeg\\bin',
      'C:\\Program Files\\ffmpeg\\bin',
      'C:\\Program Files (x86)\\ffmpeg\\bin',
    ],
  });

  if (!ffmpegPath) {
    try {
      ffmpegPath = require('ffmpeg-static');
    } catch (error) {}
  }

  if (!ffmpegPath) {
    throw new Error(
      'Error: FFMPEG not found. Please install ffmpeg or define the env FFMPEG_PATH or install ffmpeg-static'
    );
  }

  return ffmpegPath;
}

/**
 * Convert a file to a compatible MP4-GIF for WhatsApp
 * @param inputBase64 Gif in base64 format
 * @returns base64 of a MP4-GIF for WhatsApp
 */
export async function convertToMP4GIF(inputBase64: string): Promise<string> {
  const inputPath = path.join(tmpDir.name, `${i++}`);
  const outputPath = path.join(tmpDir.name, `${i++}.mp4`);

  if (inputBase64.includes(',')) {
    inputBase64 = inputBase64.split(',')[1];
  }

  fs.writeFileSync(inputPath, Buffer.from(inputBase64, 'base64'));

  /**
   * fluent-ffmpeg is a good alternative,
   * but to work with MP4 you must use fisical file or ffmpeg will not work
   * Because of that, I made the choice to use temporary file
   */
  const ffmpegPath = await getFfmpegPath();

  try {
    const out = await execa(ffmpegPath, [
      '-i',
      inputPath,
      '-movflags',
      'faststart',
      '-pix_fmt',
      'yuv420p',
      '-vf',
      'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-f',
      'mp4',
      outputPath,
    ]);

    if (out.exitCode === 0) {
      const outputBase64 = fs.readFileSync(outputPath);
      return 'data:video/mp4;base64,' + outputBase64.toString('base64');
    }

    throw out.stderr;
  } finally {
    rimraf(inputPath, () => null);
    rimraf(outputPath, () => null);
  }

  return '';
}
