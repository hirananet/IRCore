import { IndexedDBService } from './../core/indexed-db/indexed-db.service';
import { GlobUserService } from './glob-user.service';
import { RawMessage } from './../domain/rawMessage';
import { Message } from './../domain/message';
import { UModes, SimplyUser } from './../domain/userData';
import { Channel } from '../domain/channelChat';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  private channelsOpened: {[serverID: string]: Channel[]} = {};
  public readonly notifications: EventEmitter<{raw: RawMessage, type: string, parsedObject: any}> = new EventEmitter<{raw: RawMessage, type: string, parsedObject: any}>();
  private autoSave: boolean = false;

  constructor(private gUser: GlobUserService, private readonly idb: IndexedDBService) { }

  public enableAutoSave(): void {
    this.autoSave = true;
  }

  public disableAutoSave(): void {
    this.autoSave = true;
  }

  public newChannelList(serverID: string, channels: Channel[]) {
    this.channelsOpened[serverID] = channels;
  }

  public addChannel(serverID: string, channel: Channel) {
    if(!this.channelsOpened[serverID]) {
      this.channelsOpened[serverID] = [];
    }
    const prevChan = this.channelsOpened[serverID].find(chan => chan.hashedName == channel.hashedName);
    if(!prevChan) {
      this.channelsOpened[serverID].push(channel);
    } else {
      // ya existía este channel
    }
  }

  public addUserToChannel(serverID: string, channel: Channel, user: SimplyUser) {
    // check if channel exists?
    const userData = this.gUser.getUser(serverID, user);
    let modes = [];
    if(user.mode != UModes.UNDEFINED) {
      modes.push(user.mode);
    }
    userData.updateModes(channel, modes);
    this.getChannel(serverID, channel)?.addUserToChannel(userData);
  }

  public removeChannel(serverID: string, channel: Channel) {
    const idx = this.channelsOpened[serverID].findIndex(chan => chan.name == channel.name );
    if(idx >= 0) {
      this.channelsOpened[serverID].splice(idx, 1);
    } else {
      console.error('Channel not found #1?', channel, this.channelsOpened[serverID]);
    }
  }

  public updateUserModeInChannel(serverID: string, mode: {user: SimplyUser, channel: Channel, add: boolean, mode: string}) {
    const userData = this.gUser.getUser(serverID, mode.user);
    if(mode.add) {
      userData.updateModes(mode.channel, [mode.mode]);
    } else {
      userData.removeMode(mode.channel, mode.mode);
    }
  }

  public updateChannelMode(serverID: string, mode: {channel: Channel, mode: string}) {
    const channel = this.getChannel(serverID, mode.channel);
    if(!channel) {
      console.error('Channel not found updating mode');
      return;
    }
    channel.channelModes.push(mode.mode);
  }

  public setTopic(serverID: string, channel: Channel, topic: string) {
    const obj = this.channelsOpened[serverID];
    if(!obj) {
      console.error('Error setting topic in non existant server');
      return;
    }
    const channObj = obj.find(chan => chan.name == channel.name);
    if(!channObj) {
      console.error('Error setting topic in non existant channel');
      return;
    }
    channObj.topic = topic;
  }

  public getChannel(serverID: string, channel: Channel) {
    if(!this.channelsOpened[serverID]) {
      return undefined;
    }
    const chann = this.channelsOpened[serverID].find(chan => chan.name == channel.name);
    if(!chann) {
      console.error('Error getting channel: ', channel, this.channelsOpened[serverID])
    }
    return chann;
  }

  public getChannelList(serverID: string): Channel[] {
    return this.channelsOpened[serverID];
  }

  public removeUser(serverID: string, channel: Channel, user: SimplyUser) {
    const chan = this.channelsOpened[serverID].find(chan => chan.name == channel.name);
    if(!chan) {
      console.error('Channel not found #2?', channel, this.channelsOpened[serverID]);
      return;
    }
    this._removeUser(chan, user);
  }

  public removeUserInAllChannels(serverID: string, user: SimplyUser) {
    this.channelsOpened[serverID].forEach(chan => {
      this._removeUser(chan, user);
    });
  }

  public nickChangeInAllChannels(serverID: string, original: SimplyUser, newNick: SimplyUser) {
    this.channelsOpened[serverID]?.forEach(chan => {
      chan.users.forEach(user => {
        if(user.fullNick.nick == original.nick) {
          user.fullNick.nick = newNick.nick;
        }
      });
    });
  }

  public addMessageToChannel(serverID: string, channel: Channel, message: Message) {
    const chan = this.channelsOpened[serverID].find(chan => chan.name == channel.name);
    if(!chan) {
      console.error('Channel not found #3?', channel, this.channelsOpened[serverID]);
      return;
    }
    if(!message.preloaded) {
      chan.messages.push(message);
      this.saveMessages(serverID, chan);
    } else {
      chan.messages.unshift(message);
    }
  }

  private _removeUser(chan: Channel, user: SimplyUser) {
    const uIdx = chan.users.findIndex(u => u.fullNick.nick == user.nick);
    if(uIdx < 0) {
      console.error('User not found in channel', user, chan.users);
    } else {
      chan.users.splice(uIdx, 1);
    }
  }

  private saveMessages(serverID: string, channel: Channel): void {
    if(!this.autoSave) return;
    this.idb.getDatabase().addOrUpdateChannel(serverID, channel.hashedName, JSON.stringify(channel.messages));
  }

  async loadMessages(serverID: string) {
    if(!this.autoSave) return;
    const channels = await this.idb.getDatabase().getChannelsOfServer(serverID);
    channels.forEach(chan => {
      const chnl = new Channel(chan.channelhash as string);
      this.addChannel(serverID, chnl);
      const messages: Message[] = JSON.parse(chan.messages as string);
      messages.reverse().forEach((message: Message) => {
        message.preloaded = true;
        this.addMessageToChannel(serverID, chnl, message);
      });
    });
  }

}
