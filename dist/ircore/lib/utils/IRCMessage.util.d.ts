export declare class OriginData {
    nick?: string;
    identitity?: string;
    server: string;
}
export declare class IRCMessage {
    origin: OriginData;
    simplyOrigin: string;
    code: string;
    target: string;
    message: string;
    tag?: string;
    body?: string;
    partials?: string[];
}
