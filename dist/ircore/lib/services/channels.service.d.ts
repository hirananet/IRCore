import { IndividualMessage } from './../dto/IndividualMessage';
import { OnMessageReceived } from './../handlers/Message.handler';
import { UserInfoService } from './user-info.service';
import { OnTopicUpdate } from './../handlers/ChannelStatus.handler';
import { OnChannelList } from './../handlers/ChannelList.handler';
import { OnUserList } from './../handlers/Users.handler';
import { OnKick } from './../handlers/Kick.handler';
import { OnJoin } from './../handlers/Join.handler';
import { EventEmitter } from '@angular/core';
import { ChannelData, GenericMessage } from './ChannelData';
import { Join } from '../dto/Join';
import { OnPart } from '../handlers/Part.handler';
import { Part } from '../dto/Part';
import { KickInfo } from '../dto/KickInfo';
import { UserInChannel } from '../dto/UserInChannel';
import { Channel } from '../dto/Channel';
import { OnNickChanged } from '../handlers/Status.handler';
import { NickChange } from '../dto/NickChange';
import { User } from '../dto/User';
/**
 * Servicio para gestionar mis canales y los usuarios en esos canales
 */
export declare class ChannelsService implements OnJoin, OnPart, OnKick, OnUserList, OnChannelList, OnNickChanged, OnTopicUpdate, OnMessageReceived {
    private userSrv;
    readonly listChanged: EventEmitter<ChannelData[]>;
    readonly messagesReceived: EventEmitter<GenericMessage>;
    readonly membersChanged: EventEmitter<{
        channel: string;
        users: User[];
    }>;
    private channels;
    history: {
        [key: string]: GenericMessage[];
    };
    constructor(userSrv: UserInfoService);
    saveHistory(channel: string, msg: GenericMessage): void;
    getHistory(author: string): GenericMessage[];
    onChannelList(user: string, channels: Channel[]): void;
    private addChannel;
    onUserList(channel: string, users: UserInChannel[]): void;
    private sendSpecialMSG;
    onKick(data: KickInfo): void;
    onPart(data: Part): void;
    onJoin(data: Join): void;
    onNickChanged(nick: NickChange): void;
    onTopicUpdate(channel: string, newTopic: string): void;
    getChannels(): ChannelData[];
    getChannel(channel: string): ChannelData;
    onMessageReceived(message: IndividualMessage): void;
}
