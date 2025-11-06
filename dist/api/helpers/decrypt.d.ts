import { ResponseType } from 'axios';
import { Transform } from 'stream';
export declare const makeOptions: (useragentOverride: string, responseType?: ResponseType) => {
    responseType: ResponseType;
    headers: {
        'User-Agent': string;
        DNT: string;
        'Upgrade-Insecure-Requests': string;
        origin: string;
        referer: string;
    };
};
export declare const timeout: (ms: number) => Promise<unknown>;
export declare const mediaTypes: {
    IMAGE: string;
    VIDEO: string;
    AUDIO: string;
    PTT: string;
    DOCUMENT: string;
    STICKER: string;
};
export declare const magix: (fileData: any, mediaKeyBase64: any, mediaType: any, expectedSize?: number) => Buffer<ArrayBufferLike>;
export declare const newMagix: (mediaKeyBase64: string, mediaType: string, expectedSize: number) => Transform;
