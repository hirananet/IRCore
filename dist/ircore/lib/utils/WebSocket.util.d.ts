import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';
export declare class WebSocketUtil {
    static readonly messageReceived: EventEmitter<MessageData>;
    static readonly statusChanged: EventEmitter<ConnectionStatusData<any>>;
    private wss;
    private readonly onOpenSubject;
    private readonly onCloseSubject;
    private static connected;
    connect(url: string, uuid: string): Observable<string>;
    send(msg: string): void;
    disconnect(): void;
    static isConnected(): boolean;
}
export declare class ConnectionStatusData<t> {
    status: ConnectionStatus;
    data: t;
}
export declare enum ConnectionStatus {
    CONNECTED = 0,
    DISCONNECTED = 1,
    ERROR = 2
}
export declare class MessageData {
    uuid: string;
    message: string;
    constructor(uuid: string, message: string);
}
