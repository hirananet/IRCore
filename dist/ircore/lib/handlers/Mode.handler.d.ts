import { EventEmitter } from '@angular/core';
import { NewMode } from '../dto/NewMode';
/**
 * Clase para gestionar los cambios de modos en un canal (sobre un usuario)
 */
export declare class ModeHandler {
    static readonly modeChange: EventEmitter<NewMode>;
    static modeParser(rawMessage: string): string[];
    static changeMode(mode: NewMode): void;
}
