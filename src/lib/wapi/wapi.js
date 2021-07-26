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

import WPPConnectLoader from '@wppconnect-team/loader';
import {
  _getGroupParticipants,
  addParticipant,
  areAllMessagesLoaded,
  asyncLoadAllEarlierMessages,
  blockContact,
  unblockContact,
  getBlockList,
  clearChat,
  createGroup,
  deleteConversation,
  deleteMessages,
  demoteParticipant,
  downloadFile,
  encryptAndUploadFile,
  forwardMessages,
  getAllChatIds,
  getAllChats,
  getAllChatsWithMessages,
  getAllChatsWithNewMessages,
  getAllContacts,
  getAllGroupMetadata,
  getAllGroups,
  getAllMessagesInChat,
  getAllNewMessages,
  getAllUnreadMessages,
  getBatteryLevel,
  getChat,
  getChatById,
  getChatByName,
  getCommonGroups,
  getContact,
  getGroupAdmins,
  getGroupInviteLink,
  getGroupMetadata,
  getGroupParticipantIDs,
  getHost,
  getMe,
  getMessageById,
  getMyContacts,
  getNewId,
  getNewMessageId,
  getNumberProfile,
  getStatus,
  getUnreadMessages,
  getUnreadMessagesInChat,
  hasUndreadMessages,
  isConnected,
  isLoggedIn,
  leaveGroup,
  loadAllEarlierMessages,
  loadAndGetAllMessagesInChat,
  loadChatEarlierMessages,
  loadEarlierMessagesTillDate,
  processFiles,
  processMessageObj,
  promoteParticipant,
  removeParticipant,
  reply,
  revokeGroupInviteLink,
  sendMessageOptions,
  sendChatstate,
  sendContactVcard,
  sendFile,
  sendPtt,
  sendImage,
  sendImageAsSticker,
  sendImageWithProduct,
  sendLocation,
  sendMessage,
  sendMessage2,
  sendMessageWithTags,
  sendMessageWithThumb,
  sendSeen,
  sendSticker,
  sendVideoAsGif,
  setMyName,
  setMyStatus,
  startTyping,
  stopTyping,
  openChat,
  openChatAt,
  getGroupInfoFromInviteLink,
  joinGroup,
  markUnseenMessage,
  getTheme,
  setTheme,
  restartService,
  killServiceWorker,
  sendLinkPreview,
  scope,
  getchatId,
  sendExist,
  sendContactVcardList,
  setProfilePic,
  pinChat,
  getSessionTokenBrowser,
  sendMute,
  getListMute,
  interfaceMute,
  downloadMedia,
  startPhoneWatchdog,
  stopPhoneWatchdog,
  setGroupSubject,
  setGroupDescription,
  setGroupProperty,
  setTemporaryMessages,
  starMessages,
  subscribePresence,
  unsubscribePresence,
  getMessages,
  rejectCall,
} from './functions';
import {
  base64ToFile,
  generateMediaKey,
  getFileHash,
  arrayBufferToBase64,
} from './helper';
import {
  addNewMessagesListener,
  addOnAddedToGroup,
  addOnLiveLocation,
  addOnNewAcks,
  addOnNotificationMessage,
  addOnParticipantsChange,
  addOnPresenceChanged,
  addOnStateChange,
  addOnStreamChange,
  allNewMessagesListener,
  initNewMessagesListener,
} from './listeners';
import {
  _serializeChatObj,
  _serializeContactObj,
  _serializeMessageObj,
  _serializeNumberStatusObj,
  _serializeProfilePicThumb,
  _serializeRawObj,
  _profilePicfunc,
} from './serializers';
import { getBusinessProfilesProducts, getOrderbyMsg } from './business';
import { storeObjects } from './store/store-objects';

window['webpackJsonp'] = window['webpackJsonp'] || [];
window['webpackChunkbuild'] = window['webpackChunkbuild'] || [];

if (typeof window.Store === 'undefined') {
  window.Store = {};
  window.Store.promises = {};
  const loader = new WPPConnectLoader();
  window.Store.loader = loader;

  for (const store of storeObjects) {
    window.Store.promises[store.id] = loader
      .waitForModule((m) => !!store.conditions(m))
      .then(store.conditions)
      .then((m) => {
        if (store.id === 'Store') {
          window.Store = Object.assign({}, window.Store, m);
        } else {
          window.Store[store.id] = m;
        }
      });
  }

  window.Store.sendMessage = function (e) {
    return window.Store.SendTextMsgToChat(this, ...arguments);
  };
  window.Store.sendAddMessage = function (e) {
    return window.Store.addAndSendMsgToChat(this, ...arguments);
  };
}

// setTimeout(() => {
//   window.WAPI.waitForStore(['LiveLocation'], async () => {
//     console.log('handle');
//     // Store.LiveLocation.handle = (e) => console.log(e[0]);
//     Store.LiveLocation.handle = (e) =>
//       console.log(e[0].jid.user, (e[0].speed * 3.6).toFixed(2) + ' km/h');

//     const livePromises = Store.Chat.map((c) => Store.LiveLocation.find(c.id));

//     await Promise.all(livePromises);
//     console.log('find');

//     setTimeout(() => {
//       Store.LiveLocation.forEach((l) => l.startViewingMap());
//       console.log('start');
//     }, 1000);
//   });
// }, 100);

if (typeof window.WAPI === 'undefined') {
  window.WAPI = {
    lastRead: {},
  };
  //others
  window.WAPI.interfaceMute = interfaceMute;
  //Profile
  window.WAPI.setProfilePic = setProfilePic;
  window.WAPI.getSessionTokenBrowser = getSessionTokenBrowser;

  // Chat Functions
  window.WAPI.scope = scope;
  window.WAPI.getchatId = getchatId;
  window.WAPI.sendExist = sendExist;
  window.WAPI.pinChat = pinChat;
  window.WAPI.setTemporaryMessages = setTemporaryMessages;

  // Layout Functions
  window.WAPI.setTheme = setTheme;
  window.WAPI.getTheme = getTheme;

  // Serializers assignations
  window.WAPI._serializeRawObj = _serializeRawObj;
  window.WAPI._serializeChatObj = _serializeChatObj;
  window.WAPI._serializeContactObj = _serializeContactObj;
  window.WAPI._serializeMessageObj = _serializeMessageObj;
  window.WAPI._serializeNumberStatusObj = _serializeNumberStatusObj;
  window.WAPI._serializeProfilePicThumb = _serializeProfilePicThumb;
  window.WAPI._profilePicfunc = _profilePicfunc;

  // Group Functions
  window.WAPI.createGroup = createGroup;
  window.WAPI.leaveGroup = leaveGroup;
  window.WAPI.revokeGroupInviteLink = revokeGroupInviteLink;
  window.WAPI.getGroupInviteLink = getGroupInviteLink;
  window.WAPI.getGroupInfoFromInviteLink = getGroupInfoFromInviteLink;
  window.WAPI.getGroupAdmins = getGroupAdmins;
  window.WAPI.removeParticipant = removeParticipant;
  window.WAPI.addParticipant = addParticipant;
  window.WAPI.promoteParticipant = promoteParticipant;
  window.WAPI.demoteParticipant = demoteParticipant;
  window.WAPI.joinGroup = joinGroup;
  window.WAPI.setGroupDescription = setGroupDescription;
  window.WAPI.setGroupProperty = setGroupProperty;
  window.WAPI.setGroupSubject = setGroupSubject;

  // Chatting functions
  window.WAPI.sendChatstate = sendChatstate;
  window.WAPI.sendMessageWithThumb = sendMessageWithThumb;
  window.WAPI.processMessageObj = processMessageObj;
  window.WAPI.sendMessageWithTags = sendMessageWithTags;
  window.WAPI.sendMessage = sendMessage;
  window.WAPI.sendMessage2 = sendMessage2;
  window.WAPI.sendSeen = sendSeen;
  window.WAPI.deleteConversation = deleteConversation;
  window.WAPI.deleteMessages = deleteMessages;
  window.WAPI.clearChat = clearChat;
  window.WAPI.sendImage = sendImage;
  window.WAPI.sendPtt = sendPtt;
  window.WAPI.sendFile = sendFile;
  window.WAPI.setMyName = setMyName;
  window.WAPI.setMyStatus = setMyStatus;
  window.WAPI.sendVideoAsGif = sendVideoAsGif;
  window.WAPI.processFiles = processFiles;
  window.WAPI.sendImageWithProduct = sendImageWithProduct;
  window.WAPI.sendContactVcard = sendContactVcard;
  window.WAPI.sendContactVcardList = sendContactVcardList;
  window.WAPI.forwardMessages = forwardMessages;
  window.WAPI.reply = reply;
  window.WAPI._sendSticker = sendSticker;
  window.WAPI.encryptAndUploadFile = encryptAndUploadFile;
  window.WAPI.sendImageAsSticker = sendImageAsSticker;
  window.WAPI.sendImageAsStickerGif = sendImageAsSticker;
  window.WAPI.startTyping = startTyping;
  window.WAPI.stopTyping = stopTyping;
  window.WAPI.sendLocation = sendLocation;
  window.WAPI.openChat = openChat;
  window.WAPI.openChatAt = openChatAt;
  window.WAPI.markUnseenMessage = markUnseenMessage;
  window.WAPI.sendLinkPreview = sendLinkPreview;
  window.WAPI.sendMessageOptions = sendMessageOptions;
  window.WAPI.starMessages = starMessages;

  //////block functions
  window.WAPI.blockContact = blockContact;
  window.WAPI.unblockContact = unblockContact;
  window.WAPI.getBlockList = getBlockList;

  // Retrieving functions
  window.WAPI.getAllContacts = getAllContacts;
  window.WAPI.getMyContacts = getMyContacts;
  window.WAPI.getContact = getContact;
  window.WAPI.getAllChats = getAllChats;
  window.WAPI.haveNewMsg = hasUndreadMessages;
  window.WAPI.getAllChatsWithNewMsg = getAllChatsWithNewMessages;
  window.WAPI.getAllChatIds = getAllChatIds;
  window.WAPI.getAllNewMessages = getAllNewMessages;
  window.WAPI.getAllUnreadMessages = getAllUnreadMessages;
  window.WAPI.getAllChatsWithMessages = getAllChatsWithMessages;
  window.WAPI.getAllGroups = getAllGroups;
  window.WAPI.getChat = getChat;
  window.WAPI.getStatus = getStatus;
  window.WAPI.getChatByName = getChatByName;
  window.WAPI.getNewId = getNewId;
  window.WAPI.getChatById = getChatById;
  window.WAPI.getUnreadMessagesInChat = getUnreadMessagesInChat;
  window.WAPI.loadEarlierMessages = loadChatEarlierMessages;
  window.WAPI.loadAllEarlierMessages = loadAllEarlierMessages;
  window.WAPI.asyncLoadAllEarlierMessages = asyncLoadAllEarlierMessages;
  window.WAPI.areAllMessagesLoaded = areAllMessagesLoaded;
  window.WAPI.loadEarlierMessagesTillDate = loadEarlierMessagesTillDate;
  window.WAPI.getAllGroupMetadata = getAllGroupMetadata;
  window.WAPI.getGroupMetadata = getGroupMetadata;
  window.WAPI._getGroupParticipants = _getGroupParticipants;
  window.WAPI.getGroupParticipantIDs = getGroupParticipantIDs;
  window.WAPI.getAllMessagesInChat = getAllMessagesInChat;
  window.WAPI.loadAndGetAllMessagesInChat = loadAndGetAllMessagesInChat;
  window.WAPI.getUnreadMessages = getUnreadMessages;
  window.WAPI.getCommonGroups = getCommonGroups;
  window.WAPI.downloadFile = downloadFile;
  window.WAPI.downloadMedia = downloadMedia;
  window.WAPI.getNumberProfile = getNumberProfile;
  window.WAPI.getMessageById = getMessageById;
  window.WAPI.getMessages = getMessages;
  window.WAPI.getNewMessageId = getNewMessageId;
  window.WAPI.getFileHash = getFileHash;
  window.WAPI.generateMediaKey = generateMediaKey;
  window.WAPI.arrayBufferToBase64 = arrayBufferToBase64;
  window.WAPI.getListMute = getListMute;

  // Device functions
  window.WAPI.getHost = getHost;
  window.WAPI.getMe = getMe;
  window.WAPI.isConnected = isConnected;
  window.WAPI.isLoggedIn = isLoggedIn;
  window.WAPI.getBatteryLevel = getBatteryLevel;
  window.WAPI.base64ImageToFile = base64ToFile;
  window.WAPI.base64ToFile = base64ToFile;
  window.WAPI.restartService = restartService;
  window.WAPI.killServiceWorker = killServiceWorker;
  window.WAPI.sendMute = sendMute;
  window.WAPI.startPhoneWatchdog = startPhoneWatchdog;
  window.WAPI.stopPhoneWatchdog = stopPhoneWatchdog;
  window.WAPI.subscribePresence = subscribePresence;
  window.WAPI.unsubscribePresence = unsubscribePresence;

  // business functions
  window.WAPI.getBusinessProfilesProducts = getBusinessProfilesProducts;
  window.WAPI.getOrderbyMsg = getOrderbyMsg;

  // call functions
  window.WAPI.rejectCall = rejectCall;

  // Listeners initialization
  window.WAPI._newMessagesQueue = [];
  window.WAPI._newMessagesBuffer =
    sessionStorage.getItem('saved_msgs') != null
      ? JSON.parse(sessionStorage.getItem('saved_msgs'))
      : [];
  window.WAPI._newMessagesDebouncer = null;
  window.WAPI._newMessagesCallbacks = [];

  // Listeners
  window.addEventListener('unload', window.WAPI._unloadInform, false);
  window.addEventListener('beforeunload', window.WAPI._unloadInform, false);
  window.addEventListener('pageunload', window.WAPI._unloadInform, false);
  // On-work below:

  /**
   * New version of @tag message
   */
  window.WAPI.sendMessageMentioned = async function (
    chatId,
    message,
    mentioned
  ) {
    if (!Array.isArray(mentioned)) {
      mentioned = [mentioned];
    }

    const chat = WAPI.getChat(chatId);
    const users = await Store.Contact.serialize().filter((x) =>
      mentioned.includes(x.id.user)
    );

    chat.sendMessage(message, {
      linkPreview: null,
      mentionedJidList: users.map((u) => u.id),
      quotedMsg: null,
      quotedMsgAdminGroupJid: null,
    });
  };

  window.WAPI.getProfilePicSmallFromId = async function (id) {
    return await window.Store.ProfilePicThumb.find(id).then(
      async function (d) {
        if (d.img !== undefined) {
          return await window.WAPI.downloadFileWithCredentials(d.img);
        } else {
          return false;
        }
      },
      function (e) {
        return false;
      }
    );
  };

  window.WAPI.getProfilePicFromId = async function (id) {
    return await window.Store.ProfilePicThumb.find(id).then(
      async function (d) {
        if (d.imgFull !== undefined) {
          return await window.WAPI.downloadFileWithCredentials(d.imgFull);
        } else {
          return false;
        }
      },
      function (e) {
        return false;
      }
    );
  };

  window.WAPI.downloadFileWithCredentials = async function (url) {
    if (!axios || !url) return false;
    const ab = (
      await axios.get(url, {
        responseType: 'arraybuffer',
      })
    ).data;
    return btoa(
      new Uint8Array(ab).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
  };

  window.WAPI._serializeNumberStatusObj = (obj) => {
    if (obj == undefined) {
      return null;
    }

    return Object.assign(
      {},
      {
        id: obj.jid,
        status: obj.status,
        isBusiness: obj.biz === true,
        canReceiveMessage: obj.status === 200,
      }
    );
  };

  window.WAPI.checkNumberStatus = async function (id) {
    const wid = Store.WidFactory.createWid(id);

    const result = await Store.checkNumberInfo(wid);

    return {
      id: result.wid,
      isBusiness: result.biz,
      canReceiveMessage: true,
      numberExists: true,
      status: 200,
    };
  };

  window.WAPI.getChatIsOnline = async function (chatId) {
    const chat = Store.Chat.get(chatId);
    if (!chat) {
      return false;
    }
    await chat.presence.subscribe();
    return chat.presence.attributes.isOnline;
  };

  window.WAPI.getLastSeen = async function (chatId) {
    const chat = Store.Chat.get(chatId);
    if (!chat) {
      return false;
    }
    await chat.presence.subscribe();
    return chat.presence.chatstate.t || false;
  };

  window.WAPI.getWAVersion = function () {
    return window.Debug.VERSION;
  };

  /**
   * @param id The id of the conversation
   * @param archive boolean true => archive, false => unarchive
   * @return boolean true: worked, false: didnt work (probably already in desired state)
   */
  window.WAPI.archiveChat = async function (id, archive) {
    const promise = Store.Archive.setArchive(Store.Chat.get(id), archive)
      .then((_) => true)
      .catch((_) => false);

    return await Promise.resolve(promise);
  };

  window.WAPI.takeOver = async function () {
    await Store.State.default.takeover();
    return true;
  };

  /**
   * Registers a callback to be called when your phone receives a new call request.
   * @param callback - function - Callback function to be called upon a new call. returns a call object.
   * @returns {boolean}
   */
  window.WAPI.onIncomingCall = function (callback) {
    window.WAPI.waitForStore(['Call'], () => {
      window.Store.Call.on('add', callback);
    });
    return true;
  };

  /**
   * Registers a callback to be called when the interface change
   * @param callback - function - Callback function to be called upon interface change. returns a call object.
   * @returns {boolean}
   */
  window.WAPI.onInterfaceChange = function (callback) {
    window.WAPI.waitForStore('Stream', () => {
      const getData = () => ({
        displayInfo: window.Store.Stream.displayInfo,
        mode: window.Store.Stream.mode,
        info: window.Store.Stream.info,
      });
      callback(getData());
      window.Store.Stream.on(
        'change:info change:displayInfo change:mode',
        () => {
          callback(getData());
        }
      );
    });
    return true;
  };

  window.WAPI.setMessagesAdminsOnly = async function (chatId, option) {
    await Store.WapQuery.setGroupProperty(chatId, 'announcement', option);
    return true;
  };

  window.WAPI.logout = async function () {
    return await window.WAPI.waitForStore(['ws2'], () => {
      window.Store.ws2.logout();
      return true;
    });
  };

  window.WAPI.storePromises = {};
  window.WAPI.waitForStore = async function (stores, callback) {
    if (!Array.isArray(stores)) {
      stores = [stores];
    }

    const isUndefined = (p) => typeof window.Store[p] === 'undefined';
    const missing = stores.filter(isUndefined);

    const promises = missing.map((s) => {
      if (!window.WAPI.storePromises[s]) {
        window.WAPI.storePromises[s] = new Promise((resolve) => {
          const storePromise =
            window.Store.promises[s] || window.Store.promises['Store'];

          storePromise.then(() => {
            resolve(true);
          });
        });
      }
      return window.WAPI.storePromises[s];
    });

    const all = Promise.all(promises);

    if (typeof callback === 'function') {
      all.then(callback);
    }

    return await all;
  };

  addOnStreamChange();
  addOnStateChange();
  initNewMessagesListener();
  addNewMessagesListener();
  allNewMessagesListener();
  addOnNewAcks();
  addOnAddedToGroup();
  addOnLiveLocation();
  addOnParticipantsChange();
  addOnNotificationMessage();
  addOnPresenceChanged();
}
