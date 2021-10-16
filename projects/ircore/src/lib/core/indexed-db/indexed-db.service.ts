import { MessagesDatabase } from './message.database';
import { Injectable } from '@angular/core';
import 'dexie-observable';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {

  private database?: MessagesDatabase;

  constructor() {

  }

  public getDatabase(): MessagesDatabase {
    if(!this.database) {
      this.database = new MessagesDatabase();
    }
    return this.database;
  }

}
