import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  public channelList: {[serverID: string]: ChannelListData[]} = {};

  constructor() { }

  public startList(serverID: string) {
    if(this.channelList[serverID]) {
      this.channelList[serverID].splice(0);
    } else {
      this.channelList[serverID] = [];
    }
  }

  public getList(serverID: string) {
    return this.channelList[serverID];
  }

  public addChannel(serverID: string, channel: ChannelListData) {
    this.channelList[serverID].push(channel);
  }

  public endList(serverID: string) {

  }
}

export class ChannelListData {
  public channelName?: string;
  public channelHash?: string;
  public description?: string;
  public members?: number;
  public modes?: string;
}
