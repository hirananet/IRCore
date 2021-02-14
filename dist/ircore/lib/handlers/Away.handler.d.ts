import { Away } from './../dto/Away';
import { EventEmitter } from '@angular/core';
/**
 * Handler de mensajes de away
 */
export declare class AwayHandler {
    static readonly awayResponse: EventEmitter<Away>;
    static onAway(away: Away): void;
}
