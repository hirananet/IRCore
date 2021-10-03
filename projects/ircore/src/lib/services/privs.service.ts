import { GlobUserService } from './glob-user.service';
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
  public readonly notifications: EventEmitter<{raw?: RawMessage, type: string, parsedObject?: any}> = new EventEmitter<{raw?: RawMessage, type: string, parsedObject?: any}>();

  constructor(private readonly gUser: GlobUserService) { }

  public onNewMessage(serverID: string, chatName: string, author: string, msg: Message) {
    if(!this.privsOpened[serverID]) {
      this.privsOpened[serverID] = [];
    }
    const chatObj = this.privsOpened[serverID].find(chat => chat.name == chatName);
    if(!chatObj) {
      const privChat = new PrivChat();
      privChat.name = chatName;
      privChat.target = this.gUser.getUser(serverID, UserData.parseUser(author));
      privChat.messages.push(msg);
      this.privsOpened[serverID].push(privChat);
      this.notifications.emit({
        parsedObject: {
          chatName,
          serverID
        },
        type: 'new-priv'
      });
    } else {
      chatObj.messages.push(msg);
    }
  }

  public getChat(serverID: string, chatName: string) {
    return this.privsOpened[serverID].find(chat => chat.name == chatName);
  }
}
