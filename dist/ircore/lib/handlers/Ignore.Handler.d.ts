import { EventEmitter } from '@angular/core';
import { Away } from './../dto/Away';
/**
 * clase para manejar los eventos de ignorar.
 */
export declare class IgnoreHandler {
    static readonly ignoreResponse: EventEmitter<Away>;
    static onIgnore(ignore: Away): void;
}
