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

export async function getNumberProfile(id, done) {
  try {
    const result = await window.Store.WapQuery.queryExist(id);
    if (result.jid === undefined) throw 404;
    const data = window.WAPI._serializeNumberStatusObj(result);
    if (data.status == 200) data.numberExists = true;
    if (done !== undefined) {
      done(window.WAPI._serializeNumberStatusObj(result));
      done(data);
    }
    return data;
  } catch (e) {
    if (done !== undefined) {
      done(
        window.WAPI._serializeNumberStatusObj({
          status: e,
          jid: id,
        })
      );
    }
    return e;
  }
}
