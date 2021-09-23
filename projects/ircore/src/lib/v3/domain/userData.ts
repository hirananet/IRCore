// global user message
export class UserData {
  public fullNick: FullNick;
  public server: string;
  public netOp: boolean;
  public realName?: string;
  public modes: string[];
  public ssl: boolean;
  public registeredNick: string;
  public isAway: boolean;

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
    return {
      nick,
      mode
    }
  }
}

export class FullNick {
  public nick: string;
  public origin: string;
}

export enum UModes {
  FOUNDER,
  ADMIN,
  OPER,
  HALFOPER,
  VOICE,
  BANNED,
  UNDEFINED
}

export class SimplyUser {
  public nick: string;
  public mode: UModes;
}
