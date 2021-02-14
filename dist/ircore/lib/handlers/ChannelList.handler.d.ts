import { EventEmitter } from '@angular/core';
import { Channel } from '../dto/Channel';
export declare class ChannelListHandler {
    private static uChannelList;
    static readonly channelListUpdated: EventEmitter<UpdateChannelList>;
    static setChannelList(user: string, channelList: Channel[]): void;
    static getChannels(): UserChannelList;
    static setHandler(hdlr: OnChannelList): void;
}
export declare class UserChannelList {
    [key: string]: Channel[];
}
export declare class UpdateChannelList {
    user: string;
    channels: Channel[];
    constructor(user: string, channels: Channel[]);
}
export interface OnChannelList {
    onChannelList(user: string, channels: Channel[]): any;
}
