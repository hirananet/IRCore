export declare class PostProcessor {
    static processMessage(message: string, author: string, me: string): MessageWithMetadata;
    static processPings(mwm: string, me: string): string;
    static deconverHTML(msg: string): string;
    static processUserMetadata(user: string): UserWithMetadata;
}
export declare class UserWithMetadata {
    nick: string;
    status: UserStatuses;
    isNetOp?: boolean;
    randomB?: boolean;
    away?: boolean;
    serverConnected?: string;
}
export declare class MessageWithMetadata {
    message: string;
    youtube?: string;
    image?: string;
    link?: string;
    quote?: QuoteMessage;
}
export declare class QuoteMessage {
    author: string;
    originalMessage: string;
}
export declare enum UserStatuses {
    FOUNDER = "FOUNDER",
    NET_OPERATOR = "NET_OPERATOR",
    OPERATOR = "OPERATOR",
    HALF_OPERATOR = "HALF_OPERATOR",
    VOICE = "VOICE",
    BANNED = "BANNED"
}
