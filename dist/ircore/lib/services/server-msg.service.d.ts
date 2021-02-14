import { IRCMessage } from './../utils/IRCMessage.util';
import { EventEmitter } from '@angular/core';
export declare class ServerMsgService {
    readonly messages: IRCMessage[];
    readonly newMessage: EventEmitter<IRCMessage>;
    constructor();
}
