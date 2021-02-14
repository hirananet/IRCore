import { EventEmitter } from '@angular/core';
import { Quit } from './../dto/Quit';
export declare class QuitHandler {
    static readonly quitResponse: EventEmitter<Quit>;
    static onQuit(quit: Quit): void;
    static setHandler(hdlr: OnQuit): void;
}
export interface OnQuit {
    onQuit(data: Quit): any;
}
