interface selectOutput {
    webpBase64: string;
    metadata: {
        width?: number;
        height?: number;
    };
}
export declare function stickerSelect(_B: Buffer, _t: number): Promise<false | selectOutput>;
interface CreateSize {
    width?: number;
    height?: number;
}
export declare function resizeImg(buff: Buffer, size: CreateSize): Promise<string>;
export {};
