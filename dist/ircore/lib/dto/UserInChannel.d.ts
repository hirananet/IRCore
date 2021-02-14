import { Channel } from './Channel';
import { User } from './User';
export declare class UserInChannel extends User {
    channel: Channel;
    constructor(nick: string, channel: string);
}
