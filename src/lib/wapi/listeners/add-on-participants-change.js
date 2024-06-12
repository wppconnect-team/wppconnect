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

let groupParticpiantsEvents = {};

/**
 * Registers on participants change listener
 */
export function addOnParticipantsChange() {
  /**
   * Registers a callback to participant changes on a certain, specific group
   * @param groupId - string - The id of the group that you want to attach the callback to.
   * @param callback - function - Callback function to be called when a message acknowledgement changes. The callback returns 3 variables
   * @returns {boolean}
   */
  window.WAPI.onParticipantsChanged = async function (groupId, callback) {
    const subtypeEvents = [
      'invite',
      'add',
      'remove',
      'leave',
      'promote',
      'demote',
    ];
    const chat = WPP.whatsapp.ChatStore.get(groupId);
    //attach all group Participants to the events object as 'add'
    const metadata = WPP.whatsapp.GroupMetadataStore.get(groupId);
    if (!groupParticpiantsEvents[groupId]) {
      groupParticpiantsEvents[groupId] = {};
      metadata.participants.forEach((participant) => {
        groupParticpiantsEvents[groupId][participant.id.toString()] = {
          subtype: 'add',
          from: metadata.owner,
        };
      });
    }
    let i = 0;
    chat.on('change:groupMetadata.participants', (_) =>
      chat.on('all', (x, y) => {
        const { isGroup, previewMessage } = y;
        if (
          isGroup &&
          x === 'change' &&
          previewMessage &&
          previewMessage.type === 'gp2' &&
          subtypeEvents.includes(previewMessage.subtype)
        ) {
          const { subtype, from, recipients } = previewMessage;
          const rec = recipients[0].toString();
          if (
            groupParticpiantsEvents[groupId][rec] &&
            groupParticpiantsEvents[groupId][recipients[0]].subtype == subtype
          ) {
            //ignore, this is a duplicate entry
            // console.log('duplicate event')
          } else {
            //ignore the first message
            if (i == 0) {
              //ignore it, plus 1,
              i++;
            } else {
              groupParticpiantsEvents[groupId][rec] = {
                subtype,
                from,
              };
              //fire the callback
              // // previewMessage.from.toString()
              // x removed y
              // x added y
              callback({
                by: from.toString(),
                action: subtype,
                who: recipients,
              });
              chat.off('all', this);
              i = 0;
            }
          }
        }
      })
    );
    return true;
  };
}
