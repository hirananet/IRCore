import { Who } from '../dto/Who';
export declare class WhoStatusService {
    whoStatus: {
        [key: string]: Who;
    };
    constructor();
    isAway(nick: string): boolean;
}
