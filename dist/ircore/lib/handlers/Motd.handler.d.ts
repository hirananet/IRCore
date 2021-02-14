import { EventEmitter } from '@angular/core';
import { IRCMessage } from '../utils/IRCMessage.util';
/**
 * clase para manejar los mensajes del día y el hook para enviar el auth al bouncer
 */
export declare class MotdHandler {
    static readonly motdResponse: EventEmitter<IRCMessage>;
    static readonly requirePasswordResponse: EventEmitter<IRCMessage>;
}
