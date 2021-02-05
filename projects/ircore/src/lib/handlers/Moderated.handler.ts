import { IRCMessage } from './../utils/IRCMessage.util';
import { EventEmitter } from '@angular/core';

// @dynamic
export class ModeratedHandler {
  public static readonly channelModerated: EventEmitter<IRCMessage> = new EventEmitter<IRCMessage>();
}
