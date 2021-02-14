import { IRCMessage } from './utils/IRCMessage.util';
export declare class IRCParserV2 {
    static parseMessage(message: string): IRCMessage[];
    static processMessage(parsedMessage: IRCMessage, rawMessage: string, actualNick: string): void;
}
