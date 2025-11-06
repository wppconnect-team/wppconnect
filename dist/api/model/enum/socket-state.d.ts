/**
 * SocketState are the possible states of connection between WhatsApp page and phone.
 */
export declare enum SocketState {
    /**
     * Conflic page, when there are another whatsapp web openned.
     */
    CONFLICT = "CONFLICT",
    /**
     * When the whatsapp web is ready.
     */
    CONNECTED = "CONNECTED",
    /**
     * Deprecated page.
     */
    DEPRECATED_VERSION = "DEPRECATED_VERSION",
    /**
     * When the whatsapp web page is loading.
     */
    OPENING = "OPENING",
    /**
     * When the whatsapp web is connecting to smartphone after QR code scan.
     */
    PAIRING = "PAIRING",
    /**
     * Blocked page, by proxy.
     */
    PROXYBLOCK = "PROXYBLOCK",
    /**
     * Blocked page.
     */
    SMB_TOS_BLOCK = "SMB_TOS_BLOCK",
    /**
     * When the whatsapp web couldn't connect to smartphone.
     */
    TIMEOUT = "TIMEOUT",
    /**
     * Blocked page.
     */
    TOS_BLOCK = "TOS_BLOCK",
    /**
     * When the whatsapp web page is initialized yet.
     */
    UNLAUNCHED = "UNLAUNCHED",
    /**
     * Disconnected page, waiting for QRCode scan
     */
    UNPAIRED = "UNPAIRED",
    /**
     * Disconnected page with expired QRCode
     */
    UNPAIRED_IDLE = "UNPAIRED_IDLE"
}
/**
 * SocketStream are the possible states of connection between WhatsApp page and WhatsApp servers.
 */
export declare enum SocketStream {
    /**
     * Connected with WhatsApp servers
     */
    CONNECTED = "CONNECTED",
    /**
     * Disconnected from WhatsApp servers
     */
    DISCONNECTED = "DISCONNECTED",
    /**
     * Reconnecting to WhatsApp servers
     */
    RESUMING = "RESUMING",
    /**
     * Receiving data from WhatsApp servers
     */
    SYNCING = "SYNCING"
}
