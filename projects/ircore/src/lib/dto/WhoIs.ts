import { Channel } from './Channel';

export class WhoIsData {

  public username: string;
  public connectedFrom?: string;
  public server?: string;
  public isGOP = false;
  public modes: string;
  public userAccount: string;
  public isSecured = false;
  public idle: number;
  public lastLogin: string;
  public channelList: Channel[];

  public getLastLogin(): string {
    const date = new Date(parseInt(this.lastLogin, 10) * 1000);
    let hs: any = date.getHours();
    if(hs < 10) {
      hs = '0' + hs;
    }
    let mins: any = date.getMinutes();
    if(mins < 10) {
      mins = '0' + mins;
    }
    let day: any = date.getDate();
    if(day < 10) {
      day = '0'+day;
    }
    let month: any = (date.getMonth() + 1);
    if(month < 10) {
      month = '0'+month;
    }
    return day + '/' + month + '/' + date.getFullYear() + ' ' + hs + ':' + mins;
  }

  public getIdle(): string {
    let out = '';
    let idle = this.idle;
    if (idle >= 60) {
      let secs: any = (this.idle % 60);
      if(secs < 10) {
        secs = '0' + secs;
      }
      out = secs + 's';
      idle = Math.floor(idle / 60);
    } else {
      return this.idle + 's';
    }
    if (idle >= 60) {
      let mins: any = (idle % 60);
      if(mins < 10) {
        mins = '0' + mins;
      }
      out = mins + 'm ' + out;
      idle = Math.floor(idle / 60);
    } else {
      return idle + 'm ' + out;
    }
    if (idle >= 24) {
      let hs: any = (idle % 24);
      if(hs < 10) {
        hs = '0' + hs;
      }
      out = hs + 'h ' + out;
      idle = Math.floor(idle / 24);
    } else {
      return idle + 'h ' + out;
    }
    return idle + 'd ' + out;
  }

}
