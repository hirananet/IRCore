import { Part } from './../dto/Part';
import { EventEmitter } from '@angular/core';
export declare class PartHandler {
    static readonly partResponse: EventEmitter<Part>;
    static onPart(part: Part): void;
    static setHandler(hdlr: OnPart): void;
}
export interface OnPart {
    onPart(data: Part): any;
}
