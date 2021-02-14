import { EventEmitter } from '@angular/core';
import { ChannelInfo } from '../dto/ChannelInfo';
export declare class ListHandler {
    private static channels;
    static readonly channelListCreated: EventEmitter<ChannelInfo[]>;
    static addChannels(channel: ChannelInfo): void;
    static newChannelList(): void;
    static getChannelList(): ChannelInfo[];
}
