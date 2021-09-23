import { Message } from './../domain/message';
import { UModes, SimplyUser } from './../domain/userData';
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

  public setTopic(serverID: string, channel: Channel, topic: string) {
    this.channelsOpened[serverID].find(chan => chan.name = channel.name).topic = topic;
  }

  public getChannel(serverID: string, channelName: Channel) {
    return this.channelsOpened[serverID].find(chan => chan.name == channelName.name);
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