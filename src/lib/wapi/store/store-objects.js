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
    id: 'MediaProcess',
    conditions: (module) => (module.BLOB ? module : null),
  },
  {
    id: 'ChatUtil',
    conditions: (module) =>
      module.sendClear && module.clearChat ? module : null,
  },
  {
    id: 'GroupInvite',
    conditions: (module) => (module.sendQueryGroupInviteCode ? module : null),
  },
  {
    id: 'Wap',
    conditions: (module) => (module.createGroup ? module : null),
  },
  {
    id: 'ServiceWorker',
    conditions: (module) =>
      module.default && module.default.killServiceWorker ? module : null,
  },
  {
    id: 'State',
    conditions: (module) => (module.STATE && module.STREAM ? module : null),
  },
  {
    id: 'WapDelete',
    conditions: (module) =>
      module.sendConversationDelete && module.sendConversationDelete.length == 2
        ? module
        : null,
  },
  {
    id: 'Conn',
    conditions: (module) =>
      module.default && module.Conn ? module.default : null,
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
    id: 'UserConstructor',
    conditions: (module) =>
      module.default &&
      module.default.prototype &&
      module.default.prototype.isServer &&
      module.default.prototype.isUser
        ? module.default
        : null,
  },
  {
    id: 'SendTextMsgToChat',
    conditions: (module) =>
      module.sendTextMsgToChat ? module.sendTextMsgToChat : null,
  },
  {
    id: 'SendSeen',
    conditions: (module) => (module.sendSeen ? module.sendSeen : null),
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
    id: 'sendDelete',
    conditions: (module) => (module.sendDelete ? module.sendDelete : null),
  },
  {
    id: 'addAndSendMsgToChat',
    conditions: (module) =>
      module.addAndSendMsgToChat ? module.addAndSendMsgToChat : null,
  },
  {
    id: 'sendMsgToChat',
    conditions: (module) =>
      module.sendMsgToChat ? module.sendMsgToChat : null,
  },
  {
    id: 'Catalog',
    conditions: (module) => (module.Catalog ? module.Catalog : null),
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
    id: 'MsgKey',
    conditions: (module) =>
      module.default &&
      typeof module.default.toString === 'function' &&
      module.default.toString().includes('MsgKey error: obj is null/undefined')
        ? module.default
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
    id: 'Me',
    conditions: (module) =>
      module.PLATFORMS && module.Conn ? module.default : null,
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
    id: 'MyStatus',
    conditions: (module) =>
      module.getStatus && module.setMyStatus ? module : null,
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
    id: 'Features',
    conditions: (module) =>
      module.FEATURE_CHANGE_EVENT && module.features ? module : null,
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
    id: 'Participants',
    conditions: (module) =>
      module.addParticipants &&
      module.removeParticipants &&
      module.promoteParticipants &&
      module.demoteParticipants
        ? module
        : null,
  },
  {
    id: 'WidFactory',
    conditions: (module) =>
      module.isWidlike && module.createWid && module.createWidFromWidLike
        ? module
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
    id: 'Cmd',
    conditions: (module) =>
      module.default && module.default.openChatFromUnread ? module : null,
  },
  {
    id: 'ReadSeen',
    conditions: (module) => (module.sendSeen ? module : null),
  },
  {
    id: 'Block',
    conditions: (module) =>
      module.blockContact && module.unblockContact ? module : null,
  },
  {
    id: 'BlockList',
    conditions: (module) => (module.BlocklistCollection ? module : null),
  },
  {
    id: 'Theme',
    conditions: (module) =>
      module.getTheme && module.setTheme ? module : null,
  },
  {
    id: 'Vcard',
    conditions: (module) => (module.vcardFromContactModel ? module : null),
  },
  {
    id: 'Profile',
    conditions: (module) =>
      module.sendSetPicture && module.requestDeletePicture ? module : null,
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
    id: 'genId',
    conditions: (module) =>
      module.default &&
      typeof module.default === 'function' &&
      typeof module.default.toString === 'function' &&
      module.default.toString().match(/crypto/)
        ? module
        : null,
  },
  {
    id: 'GroupMetadata',
    conditions: (module) =>
      module.default && module.default.handlePendingInvite ? module : null,
  },
  {
    id: 'i10n',
    conditions: (module) =>
      module.default && module.default.downloadAppLocale
        ? module.default
        : null,
  },
  {
    id: 'NetworkStatus',
    conditions: (module) =>
      module.default && module.default._logOnlineOffline
        ? module.default
        : null,
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
    id: 'BlobCache',
    conditions: (module) =>
      module.default && module.default.getOrCreateURL ? module.default : null,
  },
  {
    id: 'UserPrefs',
    conditions: (module) => (module.getMaybeMeUser ? module : null),
  },
  {
    id: 'randomMessageId',
    conditions: (module) =>
      module.randomId && module.default ? module.default : null,
  },
  {
    id: 'randomId',
    conditions: (module) =>
      module.randomId && module.default ? module.randomId : null,
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
    id: 'checkNumberInfo',
    conditions: (module) =>
      module.default.toString().includes('Should not reach queryExists MD')
        ? module.default
        : null,
  },
];
