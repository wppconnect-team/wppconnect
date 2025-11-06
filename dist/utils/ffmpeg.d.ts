export declare function getFfmpegPath(): Promise<string>;
/**
 * Convert a file to a compatible MP4-GIF for WhatsApp
 * @param inputBase64 Gif in base64 format
 * @returns base64 of a MP4-GIF for WhatsApp
 */
export declare function convertToMP4GIF(inputBase64: string): Promise<string>;
