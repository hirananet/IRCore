import { EventEmitter } from '@angular/core';
import { KickInfo } from '../dto/KickInfo';
export declare class KickHandler {
    static readonly kicked: EventEmitter<KickInfo>;
    static kickParse(rawMessage: string): string[];
    static onKick(kick: KickInfo): void;
    static setHandler(hdlr: OnKick): void;
}
export interface OnKick {
    onKick(data: KickInfo): any;
}
