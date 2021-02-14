import { EventEmitter } from '@angular/core';
import { UserInChannel } from '../dto/UserInChannel';
export declare class UsersHandler {
    private static readonly usersInChannel;
    static readonly usersInChannelResponse: EventEmitter<ChannelAndUserList>;
    static addUsersToChannel(channel: string, users: UserInChannel[]): void;
    static getChannelOfMessage(message: string): string;
    static getUsersInChannel(channel: string): UserInChannel[];
    static setHandler(hdlr: OnUserList): void;
}
export declare class ChannelAndUserList {
    channel: string;
    userList: UserInChannel[];
    constructor(channel: string, userList: UserInChannel[]);
}
export declare class ChannelUserList {
    [key: string]: UserInChannel[];
}
export interface OnUserList {
    onUserList(channel: string, users: UserInChannel[]): any;
}
