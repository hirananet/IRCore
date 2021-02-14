import { EventEmitter } from '@angular/core';
import { NickChange } from '../dto/NickChange';
import { OnNickChanged } from '../handlers/Status.handler';
/**
 * Servicio para gestionar mi información
 */
export declare class UserInfoService implements OnNickChanged {
    private actualNick;
    readonly onChangeNick: EventEmitter<string>;
    constructor();
    getNick(): string;
    setNick(nick: string): void;
    onNickChanged(nick: NickChange): void;
}
