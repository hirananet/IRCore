import { User } from './User';
import { OriginData } from '../utils/IRCMessage.util';
import { Channel } from './Channel';
export declare class Join {
    origin: OriginData;
    user: User;
    channel: Channel;
}
