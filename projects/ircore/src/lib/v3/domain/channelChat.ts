import { Message } from './message';
import { ChannelUserData } from './channelUserData';
export class Channel {
  public name: string;
  public users: ChannelUserData[] = [];
  public topic: string;
  public channelModes: string[];
  public messages: Message[];

  public constructor(raw: string) {
    this.name = raw[0] == '#' ? raw.substr(1) : raw;
  }
}
