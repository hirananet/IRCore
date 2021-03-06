import { EventEmitter, Injectable } from '@angular/core';
import { IndividualMessage, IndividualMessageTypes } from '../dto/IndividualMessage';
import { NickChange } from '../dto/NickChange';
import { MessageHandler, OnMessageReceived } from '../handlers/Message.handler';
import { OnNickChanged, StatusHandler } from '../handlers/Status.handler';
import { PostProcessor } from '../utils/PostProcessor';
import { GenericMessage, Author } from './ChannelData';
import { PrivmsgData } from './PrivmsgData';
import { UserInfoService } from './user-info.service';

@Injectable({
  providedIn: 'root'
})
export class PrivmsgService implements OnMessageReceived, OnNickChanged {

  public readonly messagesReceived: EventEmitter<GenericMessage> = new EventEmitter<GenericMessage>();
  public readonly newPrivOpened: EventEmitter<string> = new EventEmitter<string>();
  public readonly closedPriv: EventEmitter<string> = new EventEmitter<string>();
  public privMsgs: { [key: string]: PrivmsgData } = {};

  public history: { [key: string]: GenericMessage[] };

  public readonly maxPrivMsg = 300;

  constructor(private userSrv: UserInfoService) {
    MessageHandler.setHandler(this);
    StatusHandler.setHandlerNickChanged(this);
    this.history = JSON.parse(localStorage.getItem('pv_history'));
    if(!this.history) {
      this.history = {};
    }
  }

  onMessageReceived(message: IndividualMessage) {
    if(message.messageType == IndividualMessageTypes.PRIVMSG) {
      const msgAuthor = message.privateAuthor ? message.privateAuthor : message.author;
      const msg: GenericMessage = {
        message: (message.message as string),
        messageWithMetadata:  PostProcessor.processMessage(message.message as string, msgAuthor, this.userSrv.getNick(), undefined),
        author: new Author<string>(msgAuthor),
        date: message.date + ' ' + message.time,
        special: message.meAction,
        target: message.channel
      };
      console.log('loading history?', this.privMsgs);
      if(!this.privMsgs[message.author]) {
        this.openPrivMSG(message.author);
      }
      this.privMsgs[message.author].messages.push(msg);
      this.messagesReceived.emit(msg);
      this.saveHistory(message.author, msg);

    }
  }

  openPrivMSG(author: string) {
    this.privMsgs[author] = new PrivmsgData();
    this.privMsgs[author].user = author;
    this.privMsgs[author].messages = Object.values(this.getHistory(author));
    this.newPrivOpened.emit(author);
  }

  saveHistory(author: string, msg: GenericMessage) {
    if (!this.history[author]) {
      this.history[author] = [];
    }
    if(this.history[author].length > this.maxPrivMsg) {
      this.history[author] = this.history[author].slice(this.maxPrivMsg * -1); // los ultimos
    }
    const msC = Object.assign({}, msg);
    msC.fromHistory = true;
    this.history[author].push(msC);
    localStorage.setItem('pv_history', JSON.stringify(this.history));
  }

  getHistory(author: string): GenericMessage[] {
    let history = [];
    if(this.history[author]) {
      history = Array.isArray(this.history[author]) ? this.history[author] : Object.values(this.history[author]);
    }
    return history;
  }

  clearHistory(author: string) {
    this.history[author] = [];
    localStorage.setItem('pv_history', JSON.stringify(this.history));
  }

  getPrivate(nick: string): PrivmsgData {
    if(!this.privMsgs[nick]) {
      this.openPrivMSG(nick);
    }
    return this.privMsgs[nick];
  }

  closePrivate(nick: string) {
    delete this.privMsgs[nick];
    this.closedPriv.emit(nick);
  }

  onNickChanged(nick: NickChange) {
    if(this.privMsgs[nick.oldNick]) {
      this.privMsgs[nick.newNick] = this.privMsgs[nick.oldNick];
      this.closePrivate(nick.oldNick);
      this.newPrivOpened.emit(nick.newNick);
    }
  }

}
