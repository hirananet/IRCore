import { Away } from './../dto/Away';
import { EventEmitter } from '@angular/core';

/**
 * Handler de mensajes de away
 */
// @dynamic
export class AwayHandler {

  public static readonly awayResponse: EventEmitter<Away> = new EventEmitter<Away>();

  public static onAway(away: Away) {
    this.awayResponse.emit(away);
  }
}
