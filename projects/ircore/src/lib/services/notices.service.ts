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

  public addNoticeToServer(serverID: string, msg: string, isNotice: boolean) {
    if(!this.notices[serverID]) {
      this.notices[serverID] = [];
    }
    this.notices[serverID].push({msg, isNotice});
  }

  public setCaps(serverID: string, capability: string) {
    if(!this.capabilities[serverID]) {
      this.capabilities[serverID] = [];
    }
    this.capabilities[serverID].push(capability);
  }

  public getCaps(serverID: string) {
    return this.capabilities[serverID] ? this.capabilities[serverID] : [];
  }
}
