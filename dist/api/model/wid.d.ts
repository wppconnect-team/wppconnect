/**
 * ID of user or group
 * "xxxxxxxxxx@c.us" for contacts
 * "xxxxxxxxxx@g.us" for groups
 */
export interface Wid {
    /**
     * "c.us" for contacts
     * "g.us" for groups
     */
    server: string;
    /**
     * number of contact or group
     */
    user: string;
    /**
     * user@server
     */
    _serialized: string;
}
