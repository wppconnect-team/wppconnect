import { Wid } from './wid';
import { Chat } from './chat';
import { Contact } from './contact';
import { MessageType } from './enum';
/** available during the `onMessage` event */
export interface Message {
    id: string;
    /** exists when it is a displayable message (i.e. `MessageType.CHAT` / `"chat"`); the body is not included in notifications like group removal, etc. (`gp2`) */
    body?: string;
    type: MessageType;
    /**
     * When type is GP2: {@link GroupNotificationType}
     */
    subtype: string;
    t: number;
    /** profile alias chosen by the sender */
    notifyName: string;
    from: string;
    to: string;
    author: string;
    self: string;
    ack: number;
    invis: boolean;
    isNewMsg: boolean;
    star: boolean;
    kicNotified: boolean;
    recvFresh: boolean;
    interactiveAnnotations: any[];
    clientUrl: string;
    deprecatedMms3Url: string;
    directPath: string;
    mimetype: string;
    filehash: string;
    uploadhash: string;
    size: number;
    mediaKey: string;
    mediaKeyTimestamp: number;
    width: number;
    height: number;
    /** exists when `type` is set to {@link MessageType.VIDEO} || {@link MessageType.IMAGE} */
    isViewOnce?: boolean;
    broadcast: boolean;
    /** array of the users who were mentioned in this message; given in the serialized format: "xxxxxxxxxx@c.us" / "xxxxxxxxxx@g.us" */
    mentionedJidList: string[];
    isVcardOverMmsDocument: boolean;
    /** exists when `type` is set to {@link MessageType.VCARD}; it is the name of the sent contact */
    vcardFormattedName?: string;
    isForwarded: boolean;
    hasReaction: boolean;
    productHeaderImageRejected: boolean;
    lastPlaybackProgress: number;
    isDynamicReplyButtonsMsg: boolean;
    isCarouselCard: boolean;
    parentMsgId: any;
    isMdHistoryMsg: boolean;
    stickerSentTs: number;
    isAvatar: boolean;
    lastUpdateFromServerTs: number;
    invokedBotWid: null | Wid;
    bizBotType: null;
    botResponseTargetId: null;
    botPluginType: null;
    botPluginReferenceIndex: null;
    botPluginSearchProvider: null;
    botPluginSearchUrl: null;
    botPluginSearchQuery: null;
    botPluginMaybeParent: boolean;
    botReelPluginThumbnailCdnUrl: null;
    botMsgBodyType: null;
    requiresDirectConnection: null;
    bizContentPlaceholderType: null;
    hostedBizEncStateMismatch: boolean;
    senderOrRecipientAccountTypeHosted: boolean;
    placeholderCreatedWhenAccountIsHosted: boolean;
    labels?: any[];
    sender: Contact;
    timestamp: number;
    content: string;
    isGroupMsg: boolean;
    isMMS: boolean;
    isMedia: boolean;
    isNotification: boolean;
    isPSA: boolean;
    /**
     * @deprecated Use `getChat` to get chat details
     */
    chat: Chat;
    lastSeen: null | number | boolean;
    /** if `string`, it is serialized: `"user@server"` */
    chatId: string | Wid;
    fromMe: boolean;
    /**
     * @deprecated Use the `quotedMsgId` attribute in `getMessageById` to get the message details
     */
    quotedMsgObj: null;
    quotedMsgId: null;
    mediaData: MediaData;
    recipients?: string[];
    /** exists for image and video types {@link GroupNotificationType} */
    caption?: string;
}
export interface MediaData {
    type: string;
    mediaStage: string;
    animationDuration: number;
    animatedAsNewMsg: boolean;
    _swStreamingSupported: boolean;
    _listeningToSwSupport: boolean;
}
