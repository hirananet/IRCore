import { EventEmitter } from '@angular/core';
export declare class GmodeHandler {
    static readonly onPrivateRequest: EventEmitter<string>;
    static privateRequest(user: string): void;
}
