import { ConnectionTransport } from 'puppeteer';
import WebSocket from 'ws';
export declare class WebSocketTransport implements ConnectionTransport {
    static create(url: string, timeout?: number): Promise<WebSocketTransport>;
    private _ws;
    onmessage?: (message: string) => void;
    onclose?: () => void;
    constructor(ws: WebSocket);
    send(message: string): void;
    close(): void;
}
