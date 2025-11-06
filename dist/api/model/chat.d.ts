import { Contact } from './contact';
import { GroupMetadata } from './group-metadata';
import { MessageId } from './message-id';
import { Presence } from './presence';
import { Wid } from './wid';
export interface Chat {
    id: Wid;
    pendingMsgs: boolean;
    lastReceivedKey: MessageId;
    t: number;
    unreadCount: number;
    /** whether the message was archived */
    archive: boolean;
    muteExpiration: number;
    name: string;
    /** Whatsapp provides us with built-in spam detection and this is its indicator */
    notSpam?: boolean;
    pin: number;
    msgs: null;
    kind: string;
    isAnnounceGrpRestrict: boolean;
    ephemeralDuration: number;
    /** whether the chat is visually open in WhatsApp Web (see `UILayer.openChat()`) */
    hasChatBeenOpened: boolean;
    unreadMentionCount: number;
    hasUnreadMention: boolean;
    archiveAtMentionViewedInDrawer: boolean;
    isBroadcast: boolean;
    isGroup: boolean;
    isReadOnly: boolean;
    isUser: boolean;
    contact: Contact;
    groupMetadata: GroupMetadata;
    presence: Presence;
    restricted: boolean;
    /** if you can send messages into the chat without having to be an admin (refers to group chats, see the `isGroup` attribute) */
    hasOpened: boolean;
}
