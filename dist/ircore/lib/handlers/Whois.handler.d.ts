import { EventEmitter } from '@angular/core';
import { WhoIsData } from '../dto/WhoIs';
export declare class WhoIsHandler {
    private static whoisdatas;
    static readonly onWhoisResponse: EventEmitter<WhoIsData>;
    static addWhoisPartial(user: string, field: string, data: any): void;
    static finalWhoisMessage(user: string): void;
    static getWhoisResponses(): WhoDatas;
}
export declare class WhoDatas {
    [key: string]: WhoIsData;
}
