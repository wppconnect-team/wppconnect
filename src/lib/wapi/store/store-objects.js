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
    id: 'ServiceWorker',
    conditions: (module) =>
      module.default && module.default.killServiceWorker ? module : null,
  },
  {
    id: 'WapQuery',
    conditions: (module) =>
      module.default &&
      module.default.queryExist &&
      module.default.getCapabilities
        ? module.default
        : null,
  },
  {
    id: 'CryptoLib',
    conditions: (module) => (module.decryptE2EMedia ? module : null),
  },
  {
    id: 'OpenChat',
    conditions: (module) =>
      module.default &&
      module.default.prototype &&
      module.default.prototype.openChat
        ? module.default
        : null,
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
    conditions: (module) =>
      module.__esModule === true &&
      module.setPushname &&
      !module.getComposeContents
        ? module
        : null,
  },
  {
    id: 'Parser',
    conditions: (module) =>
      module.convertToTextWithoutSpecialEmojis ? module.default : null,
  },
  {
    id: 'Builders',
    conditions: (module) =>
      module.TemplateMessage && module.HydratedFourRowTemplate ? module : null,
  },
  {
    id: 'CallUtils',
    conditions: (module) =>
      module.sendCallEnd && module.parseCall ? module : null,
  },
  {
    id: 'Identity',
    conditions: (module) =>
      module.queryIdentity && module.updateIdentity ? module : null,
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
    id: 'GroupActions',
    conditions: (module) =>
      module.sendExitGroup && module.localExitGroup ? module : null,
  },
  {
    id: 'MessageUtils',
    conditions: (module) =>
      module.storeMessages && module.appendMessage ? module : null,
  },
  {
    id: 'WebMessageInfo',
    conditions: (module) =>
      module.WebMessageInfo && module.WebFeatures
        ? module.WebMessageInfo
        : null,
  },
  {
    id: 'createMessageKey',
    conditions: (module) =>
      module.createMessageKey && module.createDeviceSentMessage
        ? module.createMessageKey
        : null,
  },
  {
    id: 'Base',
    conditions: (module) =>
      module.setSubProtocol && module.binSend && module.actionNode
        ? module
        : null,
  },
  {
    id: 'Base2',
    conditions: (module) =>
      module.supportsFeatureFlags &&
      module.parseMsgStubProto &&
      module.binSend &&
      module.subscribeLiveLocation
        ? module
        : null,
  },
  {
    id: 'Versions',
    conditions: (module) =>
      module.loadProtoVersions &&
      module.default['15'] &&
      module.default['16'] &&
      module.default['17']
        ? module
        : null,
  },
  {
    id: 'Sticker',
    conditions: (module) =>
      module.StickerCollection && module.default ? module : null,
  },
  {
    id: 'MediaObject',
    conditions: (module) =>
      module.getOrCreateMediaObject && module.disassociateMediaFromStickerPack
        ? module
        : null,
  },
  {
    id: 'MediaUpload',
    conditions: (module) =>
      module.default && module.default.mediaUpload ? module.default : null,
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
    id: 'Wap2',
    conditions: (module) => (module.Wap ? module : null),
  },
  {
    id: 'Stream',
    conditions: (module) =>
      module.default && module.default.unobscure ? module.default : null,
  },
  {
    id: 'ws2',
    conditions: (module) =>
      module.default && module.default.destroyStorage ? module.default : null,
  },
  {
    id: 'sendSetGroupSubject',
    conditions: (module) => module.sendSetGroupSubject,
  },
  {
    id: 'sendSetGroupProperty',
    conditions: (module) => module.sendSetGroupProperty,
  },
  {
    id: 'sendSetGroupDescription',
    conditions: (module) => module.sendSetGroupDescription,
  },
  {
    id: 'changeEphemeralDuration',
    conditions: (module) => module.changeEphemeralDuration,
  },
  {
    id: 'sendCallSignalingMsg',
    conditions: (module) => module.sendCallSignalingMsg,
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
