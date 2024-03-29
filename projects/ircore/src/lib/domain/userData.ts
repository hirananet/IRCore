import { Channel } from './channelChat';
// global user message
export class UserData {
  public fullNick: FullNick = new FullNick();
  public server?: string;
  public netOp: boolean = false;
  public realName?: string;
  public modes?: string[]; // user modes
  public ssl: boolean = false;
  public registeredNick?: string;
  public isAway: boolean = false;
  public idle?: number;
  public lastLogin?: number;
  public account?: string;
  public chanModes: {[channelID: string]: string[]} = {};

  public static parseUser(nick: string): SimplyUser {
    let mode = UModes.UNDEFINED;
    if (nick[0] === '~') {
      mode = UModes.FOUNDER;
      nick = nick.substr(1);
    } else if (nick[0] === '&') {
      mode = UModes.ADMIN;
      nick = nick.substr(1);
    } else if (nick[0] === '@') {
      mode = UModes.OPER;
      nick = nick.substr(1);
    } else if (nick[0] === '%') {
      mode = UModes.HALFOPER;
      nick = nick.substr(1);
    } else if (nick[0] === '+') {
      mode = UModes.VOICE;
      nick = nick.substr(1);
    }
    return new SimplyUser(nick, mode);
  }

  public updateModes(channel: Channel, modes: string[]) {
    if(!this.chanModes[channel.name]) {
      this.chanModes[channel.name] = [];
    }
    this.chanModes[channel.name] = this.chanModes[channel.name].concat(modes.filter((item) => this.chanModes[channel.name].indexOf(item) < 0));
  }

  public removeMode(channel: Channel, mode: string) {
    if(!this.chanModes[channel.name]) {
      this.chanModes[channel.name] = [];
    }
    this.chanModes[channel.name] = this.chanModes[channel.name].filter(_mode => _mode != mode);
  }
}

export class FullNick {
  public nick?: string;
  public origin?: string;
}

export enum UModes {
  FOUNDER = 'Founder',
  ADMIN = 'Admin',
  OPER = 'Operator',
  HALFOPER = 'Half-Operator',
  VOICE = 'Voice',
  BANNED = 'Banned',
  UNDEFINED = 'Undefined'
}

export class SimplyUser {
  public nick: string;
  public mode: UModes;

  constructor(nick: string, mode: UModes) {
    this.nick = nick;
    this.mode = mode;
  }

  toUser(): UserData {
    const ud = new UserData();
    ud.fullNick = new FullNick();
    ud.fullNick.nick = this.nick;
    return ud;
  }
}
