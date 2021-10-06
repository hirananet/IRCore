import { UserData } from './userData';
import { Message } from './message';

export class Channel {
  public name: string;
  public hashedName: string;
  public users: UserData[] = [];
  public topic?: string;
  public channelModes: string[] = [];
  public messages: Message[] = [];

  public constructor(raw: string) {
    this.name = raw[0] == '#' ? raw.substr(1) : raw;
    this.hashedName = '#' + this.name;
  }

  public addUserToChannel(user: UserData) {
    const index = this.users.findIndex(_user => _user.fullNick == user.fullNick);
    if(index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
  }
}
