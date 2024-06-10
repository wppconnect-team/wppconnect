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

export const storeObjects = [
  {
    id: 'Store',
    conditions: (module) =>
      module.default && module.default.Chat && module.default.Msg
        ? module.default
        : null,
  },
  {
    id: 'MediaCollection',
    conditions: (module) =>
      module.default &&
      module.default.prototype &&
      module.default.prototype.processAttachments !== undefined
        ? module.default
        : null,
  },
  {
    id: 'GroupInvite',
    conditions: (module) => (module.sendQueryGroupInviteCode ? module : null),
  },
  {
    id: 'Archive',
    conditions: (module) => (module.setArchive ? module : null),
  },
  {
    id: 'pinChat',
    conditions: (module) =>
      module.setPin.toString().includes('.unproxy') ? module : null,
  },
  {
    id: 'Perfil',
    conditions: (module) => module.setPushname && !module.getComposeContents,
  },
  {
    id: 'ChatStates',
    conditions: (module) =>
      module.sendChatStatePaused &&
      module.sendChatStateRecording &&
      module.sendChatStateComposing
        ? module
        : null,
  },
  {
    id: 'MediaObject',
    conditions: (module) =>
      module.getOrCreateMediaObject && module.disassociateMediaFromStickerPack
        ? module
        : null,
  },
  {
    id: 'UploadUtils',
    conditions: (module) =>
      module.default && module.default.encryptAndUpload ? module.default : null,
  },
  {
    id: 'Theme',
    conditions: (module) =>
      module.getTheme && module.setTheme ? module : null,
  },
  {
    id: 'SendMute',
    conditions: (module) => (module.sendConversationMute ? module : null),
  },
  {
    id: 'Validators',
    conditions: (module) => (module.findLinks ? module : null),
  },
  {
    id: 'changeEphemeralDuration',
    conditions: (module) => module.changeEphemeralDuration,
  },
  {
    id: 'sendCreateGroup',
    conditions: (module) => module.sendCreateGroup,
  },
  {
    id: 'sendQueryGroupInvite',
    conditions: (module) =>
      module.sendQueryGroupInvite ? module.sendQueryGroupInvite : null,
  },
];
