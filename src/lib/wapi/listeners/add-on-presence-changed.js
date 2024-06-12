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

export function addOnPresenceChanged() {
  window.WAPI.onPresenceChanged = function (callback) {
    setTimeout(() => {
      WPP.whatsapp.ChatStore.map((c) => c.presence.subscribe());
    }, 1000);

    WPP.whatsapp.PresenceStore.on('change:chatstate.type', (chatstate) => {
      try {
        // Search precense model from chatstate
        const presence = WPP.whatsapp.PresenceStore.getModelsArray().find(
          (m) => m.chatstate === chatstate
        );

        // Ignore not initialized presences
        if (!presence || !presence.hasData || !presence.chatstate.type) {
          return;
        }

        const contact = WPP.whatsapp.ContactStore.get(presence.id);

        const data = {
          id: presence.id,
          isOnline: presence.isOnline,
          isGroup: presence.isGroup,
          isUser: presence.isUser,
          shortName: contact ? contact.formattedShortName : '',
          state: presence.chatstate.type,
          t: Date.now(),
        };

        if (presence.isUser) {
          data.isContact = !presence.chatstate.deny;
        }

        if (presence.isGroup) {
          data.participants = presence.chatstates
            .getModelsArray()
            .filter((c) => !!c.type)
            .map((c) => {
              const contact = WPP.whatsapp.ContactStore.get(c.id);

              return {
                id: c.id.toString(),
                state: c.type,
                shortName: contact ? contact.formattedShortName : '',
              };
            });
        }

        callback(data);
      } catch (error) {
        console.log(error);
      }
    });
    return true;
  };
}
