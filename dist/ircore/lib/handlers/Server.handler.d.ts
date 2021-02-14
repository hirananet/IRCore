import { EventEmitter } from '@angular/core';
import { IRCMessage } from '../utils/IRCMessage.util';
export declare class ServerHandler {
    static readonly serverResponse: EventEmitter<IRCMessage>;
    static readonly serverNoticeResponse: EventEmitter<IRCMessage>;
    static onServerResponse(msg: IRCMessage): void;
    static onServerNoticeResponse(msg: IRCMessage): void;
}
