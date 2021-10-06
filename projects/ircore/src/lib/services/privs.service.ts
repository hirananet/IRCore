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
    let newChat = false;
    if(!chatObj) {
      const privChat = new PrivChat();
      privChat.name = chatName;
      privChat.target = this.gUser.getUser(serverID, UserData.parseUser(author));
      privChat.messages.push(msg);
      this.privsOpened[serverID].push(privChat);
      newChat = true;
    } else {
      newChat = chatObj.messages.length == 0;
      chatObj.messages.push(msg);
    }
    if(newChat) {
      this.notifications.emit({
        parsedObject: {
          chatName,
          serverID
        },
        type: 'new-priv'
      });
    }
  }

  public getChat(serverID: string, chatName: string) {
    if(!this.privsOpened[serverID]) {
      this.privsOpened[serverID] = [];
    }
    let privChat = this.privsOpened[serverID].find(chat => chat.name == chatName);
    if(!privChat) {
      privChat = new PrivChat();
      privChat.name = chatName;
      privChat.target = this.gUser.getUser(serverID, UserData.parseUser(chatName));
      this.privsOpened[serverID].push(privChat);
    }
    return privChat;
  }

  public removePriv(serverID: string, chatName: string) {
    const chatIndex = this.privsOpened[serverID]?.findIndex(chat => chat.name == chatName);
    if(chatIndex >= 0) {
      this.privsOpened[serverID].splice(chatIndex, 1);
    }
  }
}
