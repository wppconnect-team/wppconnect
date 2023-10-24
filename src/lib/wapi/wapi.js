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

import {
  _getGroupParticipants,
  areAllMessagesLoaded,
  asyncLoadAllEarlierMessages,
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
  getGroupMetadata,
  getGroupParticipantIDs,
  getHost,
  getWid,
  getMe,
  getMessageById,
  getMyContacts,
  getNewId,
  getNumberProfile,
  getUnreadMessages,
  getUnreadMessagesInChat,
  hasUndreadMessages,
  isConnected,
  isLoggedIn,
  loadAllEarlierMessages,
  loadAndGetAllMessagesInChat,
  loadChatEarlierMessages,
  loadEarlierMessagesTillDate,
  processFiles,
  processMessageObj,
  sendMessageOptions,
  sendChatstate,
  sendFile,
  sendPtt,
  sendImage,
  sendImageWithProduct,
  createProduct,
  sendLocation,
  sendMessage,
  sendMessage2,
  sendMessageWithTags,
  sendMessageWithThumb,
  sendVideoAsGif,
  setMyName,
  getTheme,
  setTheme,
  sendLinkPreview,
  scope,
  getchatId,
  sendExist,
  setProfilePic,
  pinChat,
  getSessionTokenBrowser,
  sendMute,
  getListMute,
  interfaceMute,
  startPhoneWatchdog,
  stopPhoneWatchdog,
  setTemporaryMessages,
  starMessages,
  subscribePresence,
  unsubscribePresence,
  getMessages,
  setOnlinePresence,
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

const readyPromise = new Promise((resolve) => {
  if (WPP.isReady) {
    resolve();
    return;
  }
  WPP.webpack.onReady(resolve);
});

if (typeof window.Store === 'undefined') {
  window.Store = {};
  window.Store.promises = {};

  readyPromise.then(() => {
    for (const store of storeObjects) {
      window.Store.promises[store.id] = Promise.resolve(
        WPP.webpack.search(store.conditions)
      )
        .then((m) => {
          if (!m) {
            console.error(`Store Object '${store.id}' was not found`);
          }
          return m;
        })
        .then(store.conditions)
        .then((m) => {
          if (store.id === 'Store') {
            window.Store = Object.assign({}, window.Store, m);
          } else {
            window.Store[store.id] = m;
          }
        });
    }
  });
}

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

  // Chatting functions
  window.WAPI.sendChatstate = sendChatstate;
  window.WAPI.sendMessageWithThumb = sendMessageWithThumb;
  window.WAPI.processMessageObj = processMessageObj;
  window.WAPI.sendMessageWithTags = sendMessageWithTags;
  window.WAPI.sendMessage = sendMessage;
  window.WAPI.sendMessage2 = sendMessage2;
  window.WAPI.sendImage = sendImage;
  window.WAPI.sendPtt = sendPtt;
  window.WAPI.sendFile = sendFile;
  window.WAPI.setMyName = setMyName;
  window.WAPI.sendVideoAsGif = sendVideoAsGif;
  window.WAPI.processFiles = processFiles;
  window.WAPI.sendImageWithProduct = sendImageWithProduct;
  window.WAPI.createProduct = createProduct;
  window.WAPI.forwardMessages = forwardMessages;
  window.WAPI.encryptAndUploadFile = encryptAndUploadFile;
  window.WAPI.setOnlinePresence = setOnlinePresence;
  window.WAPI.sendLocation = sendLocation;
  window.WAPI.sendLinkPreview = sendLinkPreview;
  window.WAPI.sendMessageOptions = sendMessageOptions;
  window.WAPI.starMessages = starMessages;

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
  window.WAPI.getNumberProfile = getNumberProfile;
  window.WAPI.getMessageById = getMessageById;
  window.WAPI.getMessages = getMessages;
  window.WAPI.getFileHash = getFileHash;
  window.WAPI.generateMediaKey = generateMediaKey;
  window.WAPI.arrayBufferToBase64 = arrayBufferToBase64;
  window.WAPI.getListMute = getListMute;

  // Device functions
  window.WAPI.getHost = getHost;
  window.WAPI.getWid = getWid;
  window.WAPI.getMe = getMe;
  window.WAPI.isConnected = isConnected;
  window.WAPI.isLoggedIn = isLoggedIn;
  window.WAPI.getBatteryLevel = getBatteryLevel;
  window.WAPI.base64ImageToFile = base64ToFile;
  window.WAPI.base64ToFile = base64ToFile;
  window.WAPI.sendMute = sendMute;
  window.WAPI.startPhoneWatchdog = startPhoneWatchdog;
  window.WAPI.stopPhoneWatchdog = stopPhoneWatchdog;
  window.WAPI.subscribePresence = subscribePresence;
  window.WAPI.unsubscribePresence = unsubscribePresence;

  // business functions
  window.WAPI.getBusinessProfilesProducts = getBusinessProfilesProducts;
  window.WAPI.getOrderbyMsg = getOrderbyMsg;

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

  window.WAPI.getProfilePicSmallFromId = async function (id) {
    return await WPP.whatsapp.ProfilePicThumbStore.find(id).then(
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
    return await WPP.whatsapp.ProfilePicThumbStore.find(id).then(
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
    const result = await WPP.contact.queryExists(id);

    if (!result) {
      return {
        id: id,
        isBusiness: false,
        canReceiveMessage: false,
        numberExists: false,
        status: 404,
      };
    }

    return {
      id: result.wid,
      isBusiness: result.biz,
      canReceiveMessage: true,
      numberExists: true,
      status: 200,
    };
  };

  window.WAPI.getChatIsOnline = async function (chatId) {
    const chat = WPP.whatsapp.ChatStore.get(chatId);
    if (!chat) {
      return false;
    }
    await chat.presence.subscribe();
    return chat.presence.attributes.isOnline;
  };

  window.WAPI.getLastSeen = async function (chatId) {
    const chat = WPP.whatsapp.ChatStore.get(chatId);
    if (!chat) {
      return false;
    }
    if (!chat.presence.hasData) {
      await chat.presence.subscribe();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return chat.presence.chatstate.t || false;
  };

  window.WAPI.getWAVersion = function () {
    return window.Debug.VERSION;
  };

  /**
   * @param NumberChatsDelete Number of chats that will be deleted
   */
  //Add Marcelo 21/10/2023
  window.WAPI.deleteOldChats = async function (NumberChatsDelete) {
    const options = {
      onlyWithUnreadMessage: false,
      onlyUsers: true,
    };

    try {
      const chats = await window.WAPI.chat.list(options);
      chats.reverse();
      const numChatsToDelete = Math.min(NumberChatsDelete, chats.length);

      for (let i = 0; i < numChatsToDelete; i++) {
        await window.WAPI.chat
          .delete(chats[i].id._serialized)
          .then((_) => true)
          .catch((_) => false);
      }
    } catch (e) {
      console.error('Erro:', e);
      return e;
    }
  };

  /**
   * @param id The id of the conversation
   * @param archive boolean true => archive, false => unarchive
   * @return boolean true: worked, false: didnt work (probably already in desired state)
   */
  window.WAPI.archiveChat = async function (id, archive) {
    const promise = Store.Archive.setArchive(
      WPP.whatsapp.ChatStore.get(id),
      archive
    )
      .then((_) => true)
      .catch((_) => false);

    return await Promise.resolve(promise);
  };

  /**
   * @param content Status Message Text
   * @param options {backgroundColor: '#0275d8', font: 2}
   */
  window.WAPI.sendTextStatus = async function (content, options) {
    try {
      const result = await WPP.status.sendTextStatus(content, options);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  /**
   * @param base64 data:image/jpeg;base64,<a long base64 file...>
   * @param options {backgroundColor: '#0275d8', font: 2}
   */
  window.WAPI.sendImageStatus = async function (base64, options) {
    try {
      const result = await WPP.status.sendImageStatus(base64, options);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  /**
   * @param base64 data:video/mp4;base64,<a long base64 file...>
   * @param options {backgroundColor: '#0275d8', font: 2}
   */
  window.WAPI.sendVideoStatus = async function (base64, options) {
    try {
      const result = await WPP.status.sendVideoStatus(base64, options);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  window.WAPI.takeOver = async function () {
    await WPP.whatsapp.Socket.takeover();
    return true;
  };

  /**
   * Registers a callback to be called when your phone receives a new call request.
   * @param callback - function - Callback function to be called upon a new call. returns a call object.
   * @returns {boolean}
   */
  window.WAPI.onIncomingCall = function (callback) {
    WPP.whatsapp.CallStore.on('add', callback);
    return true;
  };

  /**
   * Registers a callback to be called when the interface change
   * @param callback - function - Callback function to be called upon interface change. returns a call object.
   * @returns {boolean}
   */
  window.WAPI.onInterfaceChange = function (callback) {
    const getData = () => ({
      displayInfo: WPP.whatsapp.Stream.displayInfo,
      mode: WPP.whatsapp.Stream.mode,
      info: WPP.whatsapp.Stream.info,
    });
    callback(getData());
    WPP.whatsapp.Stream.on('change:info change:displayInfo change:mode', () => {
      callback(getData());
    });
    return true;
  };

  window.WAPI.setMessagesAdminsOnly = async function (chatId, option) {
    await WPP.group.setProperty(chatId, 'announcement', option);
    return true;
  };

  window.WAPI.logout = async function () {
    return await WPP.conn.logout();
  };

  /**
   * @todo Temporary fix while is not implemented on WA-JS
   */
  window.WAPI.isRegistered = function () {
    const m = WPP.webpack.search((m) => m.isRegistered);
    return m.isRegistered();
  };

  readyPromise.then(addOnStreamChange);
  readyPromise.then(addOnStateChange);
  readyPromise.then(initNewMessagesListener);
  readyPromise.then(addNewMessagesListener);
  readyPromise.then(allNewMessagesListener);
  readyPromise.then(addOnNewAcks);
  readyPromise.then(addOnAddedToGroup);
  readyPromise.then(addOnLiveLocation);
  readyPromise.then(addOnParticipantsChange);
  readyPromise.then(addOnNotificationMessage);
  readyPromise.then(addOnPresenceChanged);
}
