import { EventEmitter } from '@angular/core';
import { Who } from './../dto/Who';
export declare class WhoHandler {
    static readonly usersWho: UsersWhos;
    static readonly onWhoResponse: EventEmitter<Who>;
    static addWhoData(user: string, data: Who): void;
    static getWhoData(user: string): Who;
    static WHOUserParser(message: string): RegExpExecArray;
}
export declare class UsersWhos {
    [key: string]: Who;
}
