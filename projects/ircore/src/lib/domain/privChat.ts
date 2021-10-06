import { Message } from './message';
import { UserData } from './userData';
// privmsg chat
export class PrivChat {
  public name?: string;
  public target?: UserData;
  public messages: Message[] = [];
}
