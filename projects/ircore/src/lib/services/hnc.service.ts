import { RawMessage } from './../domain/rawMessage';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HncService {

  public readonly notifications: EventEmitter<{type: string, raw: RawMessage}> = new EventEmitter<{type: string, raw: RawMessage}>();

  constructor() { }
}
