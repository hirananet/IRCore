import { Channel } from './../../dto/Channel';
import { Time } from './../../utils/Time.util';
import { UserData } from './userData';
import { RawMessage } from './rawMessage';

export class Message {
  public id: string;
  public author?: string;
  public date?: string;
  public content: string;
  public quoteID?: string;
  public isMeCommand: boolean; // /me command.
  public preloaded: boolean; // loaded from history?
  public externalNotice?: string; // is an external notice to channel
  public coloredMessage?: string; // for modes and others speacial messages.
  public channel: string;
  public tags: {[key:string]: string};
  public haveMention: boolean;

  public static parseMessage(raw: RawMessage, currentNick: string) {
    const message = new Message();
    message.tags = raw.tags;
    if(message.tags['msgid']) {
      message.id = raw.tags['msgid'];
    }
    message.author = UserData.parseUser(raw.getOrigin().simplyOrigin).nick;
    message.date = Time.getTime() + ' ' + Time.getDateStr();
    message.channel = (new Channel(raw.partials[2])).name;
    message.preloaded = false;
    const meAction = /\x01ACTION ([^\x01]+)\x01/.exec(raw.raw);
    if(meAction) {
      message.content = meAction[1];
      message.isMeCommand = true;
    } else {
      message.isMeCommand = false;
      message.content = raw.content;
    }
    message.haveMention = message.content.indexOf(currentNick) >= 0 || message.content.indexOf('@all') >= 0;
    return message;
  }
}
