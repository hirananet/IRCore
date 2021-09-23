export class Message {
  public id: string;
  public author?: string;
  public date?: string;
  public content: string;
  public quoteID?: string;
  public isMe: boolean; // /me command.
  public preloaded: boolean; // loaded from history?
  public externalNotice?: string;
  public coloredMessage?: string; // for modes and others speacial messages.
}
