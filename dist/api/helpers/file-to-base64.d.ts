/**
 * Converts given file into base64 string
 * @param path file path
 * @param mime Optional, will retrieve file mime automatically if not defined (Example: 'image/png')
 */
export declare function fileToBase64(path: string, mime?: string | false): Promise<string | false>;
export declare function Mine(path: string): Promise<string | false>;
