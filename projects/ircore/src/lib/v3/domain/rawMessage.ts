export class RawMessage {

  public content: string;
  public info: string;
  public code: string;
  public partials: string[];
  public tags: string[][];
  public raw: string;
  public serverID: string;

  public constructor(msg: string, serverID: string) {
    this.raw = msg;
    this.serverID = serverID;
    const tags = /@((;?)([^\s=]+)=([^\s;]+))+/.exec(msg);
    if(tags) {
      let tagStr = tags[0].substring(1);
      this.tags = tagStr.split(';').map(str => str.split('='));
    }
    const r = /:([^:]+):?(.*)/.exec(msg);
    this.info = r[1];
    this.content = r[2];
    this.partials = this.info.split(' ');
    this.code = this.partials[1];
  }

}
