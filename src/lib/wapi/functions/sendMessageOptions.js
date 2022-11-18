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

import { getMessageById } from './get-message-by-id';

/**
 * Send message with options
 * @param {string} chatid the numberid xxx@c.us
 * @param {string} content the message
 * @param {string} options object aditionais
 */
export async function sendMessageOptions(chatId, content, options = {}) {
  const chat = WPP.chat.get(chatId) || (await WPP.chat.find(chatId));

  let attOptions = {};
  if (options.attachment) {
    attOptions = await WWebJS.processMediaData(
      options.attachment,
      options.sendAudioAsVoice
    );
    content = attOptions.preview;
    delete options.attachment;
  }

  let quotedMsgOptions = {};
  if (options.quotedMessageId) {
    let quotedMessage = await getMessageById(
      options.quotedMessageId,
      null,
      false
    );
    if (quotedMessage && quotedMessage.canReply()) {
      quotedMsgOptions = quotedMessage.msgContextInfo(chat);
    }
    delete options.quotedMessageId;
  }

  if (options.mentionedJidList) {
    options.mentionedJidList = options.mentionedJidList.map(
      (cId) => WPP.whatsapp.ContactStore.get(cId).id
    );
  }

  let locationOptions = {};
  if (options.location) {
    locationOptions = {
      type: 'location',
      loc: options.location.description,
      lat: options.location.latitude,
      lng: options.location.longitude,
    };
    delete options.location;
  }

  let vcardOptions = {};
  if (options.contactCard) {
    let contact = WPP.whatsapp.ContactStore.get(options.contactCard);
    vcardOptions = {
      body: WPP.whatsapp.VCard.vcardFromContactModel(contact).vcard,
      type: 'vcard',
      vcardFormattedName: contact.formattedName,
    };
    delete options.contactCard;
  } else if (options.contactCardList) {
    let contacts = options.contactCardList.map((c) =>
      WPP.whatsapp.ContactStore.get(c)
    );
    let vcards = contacts.map((c) =>
      WPP.whatsapp.VCard.vcardFromContactModel(c)
    );
    vcardOptions = {
      type: 'multi_vcard',
      vcardList: vcards,
      body: undefined,
    };
    delete options.contactCardList;
  } else if (
    options.parseVCards &&
    typeof content === 'string' &&
    content.startsWith('BEGIN:VCARD')
  ) {
    delete options.parseVCards;
    try {
      const parsed = await WPP.whatsapp.VCard.parseVcard(content);
      if (parsed) {
        vcardOptions = {
          type: 'vcard',
          vcardFormattedName: await WPP.whatsapp.VCard.vcardGetNameFromParsed(
            parsed
          ),
        };
      }
    } catch (_) {
      // not a vcard
    }
  }

  if (options.linkPreview) {
    delete options.linkPreview;
    const link = await window.Store.Validators.findLink(content);
    if (link && !WPP.conn.isMultiDevice()) {
      const preview = await WPP.whatsapp.functions.queryLinkPreview(link.url);
      preview.preview = true;
      preview.subtype = 'url';
      options = { ...options, ...preview };
    }
  }
  const newMsgId = WPP.chat.generateMessageID(chat.id);
  const fromwWid = WPP.whatsapp.UserPrefs.getMaybeMeUser();
  const message = {
    id: newMsgId,
    ack: 0,
    body: content,
    from: fromwWid,
    to: chat.id,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    isNewMsg: !0,
    type: 'chat',
    ...options,
    ...locationOptions,
    ...attOptions,
    ...quotedMsgOptions,
    ...vcardOptions,
  };

  await WPP.whatsapp.functions.addAndSendMsgToChat(chat, message);

  return newMsgId._serialized;
}
