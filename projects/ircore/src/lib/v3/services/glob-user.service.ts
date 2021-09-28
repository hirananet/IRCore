import { SimplyUser } from './../domain/userData';
import { Injectable } from '@angular/core';
import { UserData } from '../domain/userData';

@Injectable({
  providedIn: 'root'
})
export class GlobUserService {

  private globalUsers: {[serverID: string]: {[nick: string]:UserData}} = {};

  constructor() {

  }

  public getUser(serverID: string, nick: SimplyUser): UserData {
    if(!this.globalUsers[serverID]) {
      this.globalUsers[serverID] = {};
    }
    if(!this.globalUsers[serverID][nick.nick]) {
      this.globalUsers[serverID][nick.nick] = nick.toUser();
    }
    return this.globalUsers[serverID][nick.nick];
  }


}
