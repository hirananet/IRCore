import { MessageWithMetadata } from '../utils/PostProcessor';
export declare class IndividualMessage {
    messageType: IndividualMessageTypes;
    author: string;
    message: string;
    richMessage?: MessageWithMetadata;
    meAction: boolean;
    specialAction?: boolean;
    isAwayNotify?: boolean;
    time?: string;
    date?: string;
    channel?: string;
    mention?: boolean;
    fromLog?: boolean;
    privateAuthor?: string;
}
export declare enum IndividualMessageTypes {
    PRIVMSG = 0,
    CHANMSG = 1,
    NOTIFY = 2
}
