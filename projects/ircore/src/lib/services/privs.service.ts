import { IndexedDBService } from './../core/indexed-db/indexed-db.service';
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
  private autoSave: boolean = false;

  constructor(private readonly gUser: GlobUserService, private readonly idb: IndexedDBService) { }

  public enableAutoSave(): void {
    this.autoSave = true;
  }

  public disableAutoSave(): void {
    this.autoSave = true;
  }

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
      if(!msg.preloaded) {
        privChat.messages.push(msg);
        this.saveMessages(serverID, chatName, author, privChat.messages);
      } else {
        privChat.messages.unshift(msg)
      }
      this.privsOpened[serverID].push(privChat);
      newChat = true;
    } else {
      newChat = chatObj.messages.length == 0;
      if(!msg.preloaded) {
        chatObj.messages.push(msg);
        this.saveMessages(serverID, chatName, author, chatObj.messages);
      } else {
        chatObj.messages.unshift(msg)
      }
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

  public getChats(serverID: string): PrivChat[] {
    return this.privsOpened[serverID];
  }

  public getChat(serverID: string, chatName: string): PrivChat {
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

  public removePriv(serverID: string, chatName: string): boolean {
    const chatIndex = this.privsOpened[serverID]?.findIndex(chat => chat.name == chatName);
    if(chatIndex >= 0) {
      this.privsOpened[serverID].splice(chatIndex, 1);
      this.idb.getDatabase().deletePrivate(serverID, chatName).then((count) => {
        // console.log('Deleted: ', count);
      });
      return true;
    }
    return false;
  }

  private saveMessages(serverID: string, chatName: string, author: string, messages: Message[]): void { // save privates on storage
    if(!this.autoSave) return;
    this.idb.getDatabase().addOrUpdatePrivate(serverID, author, chatName, JSON.stringify(messages));
  }

  async loadMessages(serverID: string) { // load all privates from storage
    if(!this.autoSave) return;
    const privates = await this.idb.getDatabase().getPrivatesOfServer(serverID);
    privates.forEach(priv => {
      const messages: Message[] = JSON.parse(priv.messages as string);
      messages.reverse().forEach((msg: Message) => {
        msg.preloaded = true;
        this.onNewMessage(priv.serverid as string, priv.chatname as string, priv.author as string, msg);
      });
    });
  }

}
