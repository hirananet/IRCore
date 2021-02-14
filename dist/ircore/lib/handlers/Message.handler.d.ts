import { IndividualMessage } from './../dto/IndividualMessage';
import { IRCMessage } from '../utils/IRCMessage.util';
import { EventEmitter } from '@angular/core';
/**
 * Clase para manejar la recepción de mensajes privados y de canal.
 */
export declare class MessageHandler {
    static readonly messageResponse: EventEmitter<IndividualMessage>;
    static onMessage(message: IndividualMessage): void;
    static getMeAction(parsedMessage: IRCMessage): string[];
    static setHandler(hdlr: OnMessageReceived): void;
}
export interface OnMessageReceived {
    onMessageReceived(message: IndividualMessage): any;
}
