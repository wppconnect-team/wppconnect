export declare enum MessageType {
    NOTIFICATION = "notification",
    NOTIFICATION_TEMPLATE = "notification_template",
    GROUP_NOTIFICATION = "group_notification",
    /**
     * Group data modification, like subtitle or description and group members (join, leave)
     * See {@link GroupNotificationType}
     */
    GP2 = "gp2",
    BROADCAST_NOTIFICATION = "broadcast_notification",
    E2E_NOTIFICATION = "e2e_notification",
    CALL_LOG = "call_log",
    PROTOCOL = "protocol",
    CHAT = "chat",
    LOCATION = "location",
    PAYMENT = "payment",
    VCARD = "vcard",
    CIPHERTEXT = "ciphertext",
    MULTI_VCARD = "multi_vcard",
    REVOKED = "revoked",
    OVERSIZED = "oversized",
    GROUPS_V4_INVITE = "groups_v4_invite",
    HSM = "hsm",
    TEMPLATE_BUTTON_REPLY = "template_button_reply",
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    PTT = "ptt",
    STICKER = "sticker",
    DOCUMENT = "document",
    PRODUCT = "product",
    ORDER = "order",
    LIST = "list",
    LIST_RESPONSE = "list_response",
    BUTTONS_RESPONSE = "buttons_response",
    POLL_CREATION = "poll_creation",
    UNKNOWN = "unknown"
}
export declare enum MediaType {
    IMAGE = "Image",
    VIDEO = "Video",
    AUDIO = "Audio",
    PTT = "Audio",
    DOCUMENT = "Document",
    STICKER = "Image"
}
