import { EventEmitter } from '@angular/core';
import { Join } from './../dto/Join';
export declare class JoinHandler {
    static readonly joinResponse: EventEmitter<Join>;
    static onJoin(join: Join): void;
    static setHandler(hdlr: OnJoin): void;
}
export interface OnJoin {
    onJoin(data: Join): any;
}
