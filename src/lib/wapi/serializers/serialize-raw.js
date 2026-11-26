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

/**
 * Live WhatsApp Web collections can show up in a model's toJSON() (for example
 * chat.msgUnsyncedButtonReplyMsgs, for a button reply that is not synced yet).
 * They reference the whole store, so CDP cannot return them by value
 * ("Object reference chain is too long"): puppeteer resolves page.evaluate with
 * undefined and a single chat makes the whole listChats() result disappear.
 */
const isCollection = (value) =>
  !!value &&
  typeof value === 'object' &&
  (Array.isArray(value._models) || typeof value.modelClass === 'function');

export const _serializeRawObj = (obj) => {
  if (obj && obj.toJSON) {
    const json = Object.assign({}, obj.toJSON());
    for (const key of Object.keys(json)) {
      if (isCollection(json[key])) {
        delete json[key];
      }
    }
    return json;
  }
  return {};
};
