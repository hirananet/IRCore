import { Message } from './../domain/message';
import { UModes, SimplyUser, UserData } from './../domain/userData';
import { Channel } from '../domain/channelChat';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  private channelsOpened: {[key: string]: Channel[]} = {};

  constructor() { }

  public newChannelList(serverID: string, channels: Channel[]) {
    this.channelsOpened[serverID] = channels;
  }

  public addChannel(serverID: string, channel: Channel) {
    this.channelsOpened[serverID].push(channel);
  }

  public addUserToChannel(serverID: string, channel: Channel, user: SimplyUser) {
    const modes = [];
    if(user.mode != UModes.UNDEFINED) {
      modes.push(user.mode);
    }
    this.getChannel(serverID, channel).addUserToChannel(user.toUser(), modes);
  }

  public removeChannel(serverID: string, channel: Channel) {
    const idx = this.channelsOpened[serverID].findIndex(chan => chan.name == channel.name );
    if(idx >= 0) {
      delete this.channelsOpened[serverID][idx];
    } else {
      console.error('Channel not found?', channel, this.channelsOpened[serverID]);
    }
  }

  public updateUserModeInChannel(serverID: string, mode: {user: SimplyUser, channel: Channel, add: boolean, mode: string}) {
    const channel = this.getChannel(serverID, mode.channel);
    if(!channel) {
      console.error('Channel not found updating user mode');
      return;
    }
    const user = channel.users.find(u => u.userData.fullNick.nick == mode.user.nick);
    if(mode.add) {
      user.channelModes.push(mode.mode);
    } else {
      const modeIdx = user.channelModes.findIndex(m => m == mode.mode);
      if(modeIdx >= 0) {
        delete user.channelModes[modeIdx];
      }
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
    this.channelsOpened[serverID].find(chan => chan.name = channel.name).topic = topic;
  }

  public getChannel(serverID: string, channel: Channel) {
    return this.channelsOpened[serverID].find(chan => chan.name == channel.name);
  }

  public removeUser(serverID: string, channel: Channel, user: SimplyUser) {
    const chan = this.channelsOpened[serverID].find(chan => chan.name == channel.name);
    if(!chan) {
      console.error('Channel not found?', channel, this.channelsOpened[serverID]);
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
    this.channelsOpened[serverID].forEach(chan => {
      chan.users.forEach(user => {
        if(user.userData.fullNick.nick == original.nick) {
          user.userData.fullNick.nick = newNick.nick;
        }
      });
    });
  }

  public addMessageToChannel(serverID: string, channel: Channel, message: Message) {
    const chan = this.channelsOpened[serverID].find(chan => chan.name == channel.name);
    if(!chan) {
      console.error('Channel not found?', channel, this.channelsOpened[serverID]);
      return;
    }
    chan.messages.push(message);
  }

  private _removeUser(chan: Channel, user: SimplyUser) {
    const uIdx = chan.users.findIndex(u => u.userData.fullNick.nick == user.nick);
    if(uIdx < 0) {
      console.error('User not found in channel', user, chan.users);
    } else {
      delete chan.users[uIdx];
    }
  }

}
