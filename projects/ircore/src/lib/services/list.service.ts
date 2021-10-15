import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  public channelList: {[serverID: string]: ChannelListData[]} = {};
  public readonly notifications: EventEmitter<{serverID: string, type: string, parsedObject: any}> = new EventEmitter<{serverID: string, type: string, parsedObject: any}>();

  constructor() { }

  public startList(serverID: string): void {
    if(this.channelList[serverID]) {
      this.channelList[serverID].splice(0);
    } else {
      this.channelList[serverID] = [];
    }
    this.notifications.emit({
      serverID,
      type: 'start-list',
      parsedObject: {}
    });
  }

  public getList(serverID: string): ChannelListData[] {
    return this.channelList[serverID];
  }

  public addChannel(serverID: string, channel: ChannelListData): void {
    this.channelList[serverID].push(channel);
  }

  public endList(serverID: string): void {
    this.notifications.emit({
      serverID,
      type: 'end-list',
      parsedObject: this.channelList[serverID]
    });
  }
}

export class ChannelListData {
  public channelName?: string;
  public channelHash?: string;
  public description?: string;
  public members?: number;
  public modes?: string;
}
