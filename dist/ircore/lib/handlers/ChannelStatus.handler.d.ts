/**
 * clase para manejar los cambios de estado de un canal, como el topic y los modos.
 */
import { EventEmitter } from '@angular/core';
export declare class ChannelStatusHandler {
    private static readonly channelsTopics;
    static readonly channelTopicResponse: EventEmitter<ChannelTopicUpdate>;
    static setChannelTopic(channel: string, topic: string): void;
    static getChannelTopic(channel: string): string;
    static findChannels(message: string): string[];
    static setHandler(hdlr: OnTopicUpdate): void;
}
export declare class ChannelsTopic {
    [key: string]: string;
}
export declare class ChannelTopicUpdate {
    channel: string;
    newTopic: string;
    constructor(channel: string, newTopic: string);
}
export interface OnTopicUpdate {
    onTopicUpdate(channel: string, newTopic: string): any;
}
