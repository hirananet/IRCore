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
}

export class FullNick {
  public nick: string;
  public origin: string;
}
