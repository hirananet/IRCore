import { UModes } from '../utils/UModes.utils';
export declare class User {
    nick: string;
    mode: UModes;
    away?: boolean;
    constructor(nick: string);
}
