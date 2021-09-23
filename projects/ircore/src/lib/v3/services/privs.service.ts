import { Message } from './../domain/message';
import { PrivChat } from './../domain/privChat';
import { Injectable } from '@angular/core';
import { UserData } from '../domain/userData';

@Injectable({
  providedIn: 'root'
})
export class PrivsService {

  private privsOpened: {[serverID: string]: PrivChat[]} = {};

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
