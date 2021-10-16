import Dexie, { PromiseExtended } from 'dexie';

export class MessagesDatabase extends Dexie {

  public privates!: Dexie.Table<PrivateChat, string>;
  public channels!: Dexie.Table<ChannelChat, string>;

  public constructor() {
    super("MessagesDatabase");
    // indices
    // https://dexie.org/docs/API-Reference#quick-reference
    this.version(1).stores({
      privates: "serverid,chatname",
      channels: "serverid,channelhash"
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

  async getAllChannels(): Promise<ChannelChat[]> {
    return await this.channels.toArray();
  }

  async getChannelsOfServer(serverID: string): Promise<ChannelChat[]> {
    return await this.channels.where('serverid').equalsIgnoreCase(serverID).toArray();
  }

  addOrUpdateChannel(serverID: string, channelHash: string, messages: string): PromiseExtended<string> {
    return this.channels.put({
      serverid: serverID,
      channelhash: channelHash,
      messages
    });
  }
}

export interface ChannelChat {
  serverid?: string;
  channelhash?: string;
  messages?: string;
}

export interface PrivateChat {
  serverid?: string;
  author?: string;
  chatname?: string;
  messages?: string;
}
