/**
 * Parameters for returning messages
 */
export interface GetMessagesParam {
    /**
     * Number of messages to return.
     * Set it to `-1` to return everything (may take a while and crash the interface).
     *
     * @default 20
     */
    count?: number;
    /**
     * ID of the last message to continue the search.
     * This works like pagination, so when you get an ID,
     * you can use it to get the next messages from it.
     */
    id?: string;
    fromMe?: boolean;
    /**
     * Whether you want to retrieve the messages before or after the ID entered.
     *
     * @default 'before'
     */
    direction?: 'before' | 'after';
}
