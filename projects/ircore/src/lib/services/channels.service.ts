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

  constructor(private gUser: GlobUserService) { }

  public newChannelList(serverID: string, channels: Channel[]) {
    this.channelsOpened[serverID] = channels;
  }

  public addChannel(serverID: string, channel: Channel) {
    if(!this.channelsOpened[serverID]) {
      this.channelsOpened[serverID] = [];
    }
    this.channelsOpened[serverID].push(channel);
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
    const chann = this.channelsOpened[serverID].find(chan => chan.name == channel.name);
    if(!chann) {
      console.error('Error getting channel: ', channel, this.channelsOpened[serverID])
    }
    return chann;
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
    chan.messages.push(message);
  }

  private _removeUser(chan: Channel, user: SimplyUser) {
    const uIdx = chan.users.findIndex(u => u.fullNick.nick == user.nick);
    if(uIdx < 0) {
      console.error('User not found in channel', user, chan.users);
    } else {
      chan.users.splice(uIdx, 1);
    }
  }

}
