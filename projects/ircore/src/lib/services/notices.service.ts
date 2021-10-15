import { RawMessage } from './../domain/rawMessage';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NoticesService {

  private notices: {[serverID: string]: {msg: string, isNotice: boolean}[]} = {};
  private capabilities: {[serverID: string]: string[]} = {};
  public readonly notifications: EventEmitter<{raw: RawMessage, type: string, parsedObject?: any}> = new EventEmitter<{raw: RawMessage, type: string, parsedObject?: any}>();

  constructor() { }

  public addNoticeToServer(serverID: string, msg: string, isNotice: boolean): void {
    if(!this.notices[serverID]) {
      this.notices[serverID] = [];
    }
    this.notices[serverID].push({msg, isNotice});
  }

  public getNotices(serverID: string): {msg: string, isNotice: boolean}[] {
    return this.notices[serverID];
  }

  public setCaps(serverID: string, capability: string): void {
    if(!this.capabilities[serverID]) {
      this.capabilities[serverID] = [];
    }
    this.capabilities[serverID].push(capability);
  }

  public getCaps(serverID: string): string[] {
    return this.capabilities[serverID] ? this.capabilities[serverID] : [];
  }
}
