import Dexie, { PromiseExtended } from 'dexie';

export class MessagesDatabase extends Dexie {

  public privates!: Dexie.Table<PrivateChat, string>;

  public constructor() {
    super("MessagesDatabase");
    // indices
    // https://dexie.org/docs/API-Reference#quick-reference
    this.version(1).stores({
      privates: "serverid,chatname"
    });
  }

  async getAllPrivates(): Promise<PrivateChat[]> {
    return await this.privates.toArray();
  }

  async getPrivatesOfServer(serverID: string): Promise<PrivateChat[]> {
    return await this.privates.where('serverid').equalsIgnoreCase(serverID).toArray();
  }

  addOrUpdatePrivate(serverID: string, author: string, chatname: string, messages: string): PromiseExtended<string> {
    return this.privates.put({
      serverid: serverID,
      author,
      chatname,
      messages
    })
  }

}

export interface PrivateChat {
  serverid?: string;
  author?: string;
  chatname?: string;
  messages?: string;
}
