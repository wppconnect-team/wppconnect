import { FormatWrap, TransformableInfo } from 'logform';
export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
export interface MetaInfo {
    session?: string;
    type?: string;
}
export interface SessionInfo extends TransformableInfo, MetaInfo {
}
export declare const formatLabelSession: FormatWrap;
export declare const defaultLogger: import("winston").Logger;
