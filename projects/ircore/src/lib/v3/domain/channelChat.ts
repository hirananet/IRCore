import { UserData } from './userData';
import { Message } from './message';
import { ChannelUserData } from './channelUserData';

export class Channel {
  public name: string;
  public hashedName: string;
  public users: ChannelUserData[] = [];
  public topic: string;
  public channelModes: string[] = [];
  public messages: Message[] = [];

  public constructor(raw: string) {
    this.name = raw[0] == '#' ? raw.substr(1) : raw;
    this.hashedName = '#' + this.name;
  }

  public addUserToChannel(user: UserData, modes: string[]) {
    const oldUser = this.users.find(_user => _user.userData.fullNick == user.fullNick);
    if(oldUser) {
      oldUser.userData = user;
      oldUser.channelModes = modes;
    } else {
      const cud = new ChannelUserData();
      cud.userData = user;
      cud.channelModes = modes;
      this.users.push(cud);
    }
  }
}
