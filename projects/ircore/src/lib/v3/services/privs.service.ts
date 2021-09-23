import { RawMessage } from './../domain/rawMessage';
import { Message } from './../domain/message';
import { PrivChat } from './../domain/privChat';
import { Injectable, EventEmitter } from '@angular/core';
import { UserData } from '../domain/userData';


@Injectable({
  providedIn: 'root'
})
export class PrivsService {

  private privsOpened: {[serverID: string]: PrivChat[]} = {};
  public readonly notifications: EventEmitter<{raw: RawMessage, type: string, parsedObject?: any}> = new EventEmitter<{raw: RawMessage, type: string, parsedObject?: any}>();

  constructor() { }

  public onNewMessage(serverID: string, chatName: string, author: string, msg: Message) {
    const chatObj = this.privsOpened[serverID].find(chat => chat.name == chatName);
    if(!chatObj) {
      const privChat = new PrivChat();
      privChat.name = chatName;
      privChat.target = UserData.parseUser(author).toUser();
      privChat.messages.push(msg);
      this.privsOpened[serverID].push(privChat);
    } else {
      chatObj.messages.push(msg);
    }
  }
}
