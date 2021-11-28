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

export async function loadAllEarlierMessages(id, done) {
  const chat = WAPI.getChat(id);

  if (!chat) {
    done && done(false);
    return false;
  }

  // improve load speed
  try {
    await WPP.whatsapp.MsgStore.findQuery({
      remote: chat.id,
      count: -1,
    });
  } catch (error) {}

  while (!chat.msgs.msgLoadState.noEarlierMsgs) {
    await chat.loadEarlierMsgs();
  }

  done && done(true);
  return true;
}

/**
 * SYNC version
 * Loads all earlier messages of given chat id
 * @param {string} id Chat id
 * @param {Funciton} done Optional callback
 */
export function asyncLoadAllEarlierMessages(id, done) {
  loadAllEarlierMessages(id);
  done();
}
