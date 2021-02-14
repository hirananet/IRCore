import { Channel } from './Channel';
export declare class WhoIsData {
    username: string;
    connectedFrom?: string;
    server?: string;
    isGOP: boolean;
    modes: string;
    userAccount: string;
    isSecured: boolean;
    idle: number;
    lastLogin: string;
    channelList: Channel[];
    getLastLogin(): string;
    getIdle(): string;
}
