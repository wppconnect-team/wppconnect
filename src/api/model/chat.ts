
import { Contact } from './contact';
import { GroupMetadata } from './group-metadata';
import { Id } from './id';

export interface Chat {
  id: Id;
  pendingMsgs: boolean;
  lastReceivedKey: LastReceivedKey;
  t: number;
  unreadCount: number;
  archive: boolean;
  isReadOnly: boolean;
  muteExpiration: number;
  name: string;
  notSpam: boolean;
  pin: number;
  msgs: null;
  kind: string;
  isGroup: boolean;
  contact: Contact;
  groupMetadata: GroupMetadata;
  presence: Presence;
  /**
   * @deprecated This is unreliable. Use the method {@link Whatsapp.getChatIsOnline} instead.
   */
  isOnline: null | boolean;
  /**
   * @deprecated This is unreliable. Use the method {@link Whatsapp.getLastSeen} instead.
   */
  lastSeen: null | number | boolean;
}

export interface ProfilePicThumbObj {
  eurl: string;
  id: Id;
  img: string;
  imgFull: string;
  raw: null;
  tag: string;
}

export interface LastReceivedKey {
  fromMe: boolean;
  remote: Id;
  id: string;
  _serialized: string;
}

export interface Presence {
  id: Id;
  chatstates: any[];
}
