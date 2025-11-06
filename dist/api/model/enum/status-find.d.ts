/**
 * SocketState are the possible states of connection between WhatsApp page and phone.
 */
export declare enum StatusFind {
    /**
     * The browser was closed using the autoClose.
     */
    autocloseCalled = "autocloseCalled",
    /**
     * If the browser is closed this parameter is returned.
     */
    browserClose = "browserClose",
    /**
     * Client has disconnected in to mobile.
     */
    desconnectedMobile = "desconnectedMobile",
    /**
     * Client is ready to send and receive messages.
     */
    inChat = "inChat",
    /**
     * When the user is already logged in to the browser.
     */
    isLogged = "isLogged",
    /**
     * When the user is not connected to the browser, it is necessary to scan the QR code through the cell phone in the option WhatsApp Web.
     */
    notLogged = "notLogged",
    /**
     * Client couldn't connect to phone.
     */
    phoneNotConnected = "phoneNotConnected",
    /**
     * Failed to authenticate.
     */
    qrReadError = "qrReadError",
    /**
     * If the browser stops when the QR code scan is in progress, this parameter is returned.
     */
    qrReadFail = "qrReadFail",
    /**
     * If the user is not logged in, the QR code is passed on the terminal a callback is returned. After the correct reading by cell phone this parameter is returned.
     */
    qrReadSuccess = "qrReadSuccess",
    /**
     *  Client has disconnected in to wss.
     */
    serverClose = "serverClose"
}
