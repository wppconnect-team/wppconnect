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

export async function processFiles(chat, blobs) {
  if (!Array.isArray(blobs)) {
    blobs = [blobs];
  }
  const mediaCollection = new Store.MediaCollection({
    chatParticipantCount: chat.getParticipantCount(),
  });

  await mediaCollection.processAttachments(
    Debug.VERSION === '0.4.613'
      ? blobs
      : blobs.map((blob) => {
          return {
            file: blob,
          };
        }),
    chat,
    1
  );
  return mediaCollection;
}
