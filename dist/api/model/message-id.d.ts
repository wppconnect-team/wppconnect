import { Wid } from './wid';
export interface MessageId {
    fromMe: boolean;
    id: string;
    remote: Wid;
    _serialized: string;
}
