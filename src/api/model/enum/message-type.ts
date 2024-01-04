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

export enum MessageType {
  NOTIFICATION = 'notification',
  NOTIFICATION_TEMPLATE = 'notification_template',
  GROUP_NOTIFICATION = 'group_notification',

  /**
   * Group data modification, like subtitle or description and group members (join, leave)
   * See {@link GroupNotificationType}
   */
  GP2 = 'gp2',
  BROADCAST_NOTIFICATION = 'broadcast_notification',
  E2E_NOTIFICATION = 'e2e_notification',
  CALL_LOG = 'call_log',
  PROTOCOL = 'protocol',
  CHAT = 'chat',
  LOCATION = 'location',
  PAYMENT = 'payment',
  VCARD = 'vcard',
  CIPHERTEXT = 'ciphertext',
  MULTI_VCARD = 'multi_vcard',
  REVOKED = 'revoked',
  OVERSIZED = 'oversized',
  GROUPS_V4_INVITE = 'groups_v4_invite',
  HSM = 'hsm',
  TEMPLATE_BUTTON_REPLY = 'template_button_reply',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  PTT = 'ptt',
  STICKER = 'sticker',
  DOCUMENT = 'document',
  PRODUCT = 'product',
  ORDER = 'order',
  LIST = 'list',
  LIST_RESPONSE = 'list_response',
  BUTTONS_RESPONSE = 'buttons_response',
  POLL_CREATION = 'poll_creation',
  UNKNOWN = 'unknown',
}

export enum MediaType {
  IMAGE = 'Image',
  VIDEO = 'Video',
  AUDIO = 'Audio',
  PTT = 'Audio',
  DOCUMENT = 'Document',
  STICKER = 'Image',
}
