import Dexie, { PromiseExtended } from 'dexie';

export class MessagesDatabase extends Dexie {

  public privates!: Dexie.Table<PrivateChat, string>;
  public channels!: Dexie.Table<ChannelChat, string>;

  public constructor() {
    super("MessagesDatabase");
    // indices
    // https://dexie.org/docs/API-Reference#quick-reference
    this.version(1).stores({
      privates: "pk,serverid,chatname",
      channels: "pk,serverid,channelhash"
    });
  }

  async getAllPrivates(): Promise<PrivateChat[]> {
    return await this.privates.toArray();
  }

  async getPrivatesOfServer(serverID: string): Promise<PrivateChat[]> {
    return await this.privates.where('serverid').equalsIgnoreCase(serverID).toArray();
  }

  async addOrUpdatePrivate(serverID: string, author: string, chatname: string, messages: string): Promise<string> {
    const pk = `${serverID}$${chatname}`;
    return await this.privates.put({
      pk,
      serverid: serverID,
      author,
      chatname,
      messages
    }, pk);
  }

  async deletePrivate(serverID: string, chatname:string) {
    const pk = `${serverID}$${chatname}`;
    return await this.privates.delete(pk);
  }

  async getAllChannels(): Promise<ChannelChat[]> {
    return await this.channels.toArray();
  }

  async getChannelsOfServer(serverID: string): Promise<ChannelChat[]> {
    return await this.channels.where('serverid').equalsIgnoreCase(serverID).toArray();
  }

  async wipeServer(serverID: string) {
    await this.privates.where('serverid').equalsIgnoreCase(serverID).delete();
    return await this.channels.where('serverid').equalsIgnoreCase(serverID).delete();
  }

  addOrUpdateChannel(serverID: string, channelHash: string, messages: string): PromiseExtended<string> {
    const pk = `${serverID}$${channelHash}`;
    return this.channels.put({
      pk,
      serverid: serverID,
      channelhash: channelHash,
      messages
    }, pk);
  }

  async deleteChannel(serverID: string, channelHash:string) {
    const pk = `${serverID}$${channelHash}`;
    return await this.channels.delete(pk);
  }
}

export interface ChannelChat {
  pk: string;
  serverid?: string;
  channelhash?: string;
  messages?: string;
}

export interface PrivateChat {
  pk: string;
  serverid?: string;
  author?: string;
  chatname?: string;
  messages?: string;
}
