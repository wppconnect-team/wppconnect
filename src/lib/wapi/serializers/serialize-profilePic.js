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

export const _profilePicfunc = async (id) => {
  const wid = WPP.whatsapp.WidFactory.createWid(id);
  let pic = WPP.whatsapp.ProfilePicThumbStore.get(wid);

  if (!pic) {
    try {
      // Forçar carregar contato para popular ProfilePicThumbStore
      if (WPP.contact && typeof WPP.contact.queryExists === 'function') {
        await WPP.contact.queryExists(id);
      }
      // Tentar buscar contato do store
      if (WPP.contact && typeof WPP.contact.getContact === 'function') {
        await WPP.contact.getContact(id);
      }
    } catch (e) {
      // Falha silenciosa - continua mesmo se não conseguir carregar
    }

    pic = await WPP.whatsapp.ProfilePicThumbStore.find(wid);
  }

  if (pic) {
    return WAPI._serializeProfilePicThumb(pic);
  }

  return null;
};
