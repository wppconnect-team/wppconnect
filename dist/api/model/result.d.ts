import { HostDevice } from './host-device';
import { MessageId } from './message-id';
export interface ScopeResult {
    me: HostDevice;
    to: MessageId & {
        formattedName: string;
        isBusiness: boolean;
        isMyContact: boolean;
        verifiedName: string;
        pushname?: string;
    };
    erro?: boolean;
    text?: string | null;
    status?: number | string;
}
export interface SendFileResult extends ScopeResult {
    type: string;
    filename: string;
    text?: string;
    mimeType?: string;
}
export interface SendStickerResult extends ScopeResult {
    type: string;
}
export interface SendPttResult extends ScopeResult {
    type: string;
    filename: string;
    text?: string;
}
