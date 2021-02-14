import { EventEmitter } from '@angular/core';
import { NickChange } from '../dto/NickChange';
export declare class StatusHandler {
    static readonly nickAlreadyInUse: EventEmitter<string>;
    static readonly banned: EventEmitter<string>;
    static readonly nickChanged: EventEmitter<NickChange>;
    static onNickAlreadyInUse(nickInUse: string): void;
    static onBanned(channel: string): void;
    static onNickChanged(nick: NickChange): void;
    static setHandlerNickAlreadyInUse(hdlr: OnNickAlreadyInUse): void;
    static setHandlerBanned(hdlr: OnBanned): void;
    static setHandlerNickChanged(hdlr: OnNickChanged): void;
}
export interface OnNickAlreadyInUse {
    onNickAlreadyInUse(nickInUse: string): any;
}
export interface OnBanned {
    onBanned(channel: string): any;
}
export interface OnNickChanged {
    onNickChanged(nick: NickChange): any;
}
