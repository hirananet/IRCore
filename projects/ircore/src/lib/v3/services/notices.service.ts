import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NoticesService {

  private notices: {[serverID: string]: {msg: string, isNotice: boolean}[]} = {};

  constructor() { }

  public addNoticeToServer(serverID: string, msg: string, isNotice: boolean) {
    if(!this.notices[serverID]) {
      this.notices[serverID] = [];
    }
    this.notices[serverID].push({msg, isNotice});
  }
}
