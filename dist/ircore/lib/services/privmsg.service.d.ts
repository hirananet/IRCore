import { EventEmitter } from '@angular/core';
import { IndividualMessage } from '../dto/IndividualMessage';
import { OnMessageReceived } from '../handlers/Message.handler';
import { GenericMessage } from './ChannelData';
import { PrivmsgData } from './PrivmsgData';
import { UserInfoService } from './user-info.service';
export declare class PrivmsgService implements OnMessageReceived {
    private userSrv;
    readonly messagesReceived: EventEmitter<GenericMessage>;
    readonly newPrivOpened: EventEmitter<string>;
    readonly closedPriv: EventEmitter<string>;
    privMsgs: {
        [key: string]: PrivmsgData;
    };
    history: {
        [key: string]: GenericMessage[];
    };
    constructor(userSrv: UserInfoService);
    onMessageReceived(message: IndividualMessage): void;
    saveHistory(author: string, msg: GenericMessage): void;
    getHistory(author: string): GenericMessage[];
    getPrivate(nick: string): PrivmsgData;
    closePrivate(nick: string): void;
}
