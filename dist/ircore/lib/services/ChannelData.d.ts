import { MessageWithMetadata } from './../utils/PostProcessor';
import { User } from '../dto/User';
export declare class ChannelData {
    name: string;
    topic: string;
    users: User[];
    messages: GenericMessage[];
}
export declare class GenericMessage {
    message: string;
    author?: Author<User | string>;
    date: string;
    special: boolean;
    notify?: boolean;
    quote?: Quote;
    messageWithMetadata?: MessageWithMetadata;
    target?: string;
    fromHistory?: boolean;
}
export declare class Quote {
    author: string | User;
    quote: string;
}
export declare class Author<t> {
    user: t;
    image: string;
    constructor(user: t);
}
