import { Wid } from './wid';
export interface GroupCreation {
    status: number;
    gid: Wid;
    participants: {
        [key: string]: any[];
    }[];
}
