import { IRCMessage } from './../utils/IRCMessage.util';
import { EventEmitter } from '@angular/core';
export declare class ModeratedHandler {
    static readonly channelModerated: EventEmitter<IRCMessage>;
}
