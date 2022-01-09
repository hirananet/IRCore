export class RawMessage {

  public content: string = '';
  public info?: string;
  public code: string = '00';
  public partials: string[] = [];
  public tags: {[key: string]: string} = {};
  public raw: string;
  public serverID: string;
  private origin?: OriginData;

  public constructor(msg: string, serverID: string) {
    this.raw = msg;
    this.serverID = serverID;
    const tags = /@((;?)([^\s=]+)=([^\s;]+))+/.exec(msg);
    if(tags) {
      let tagStr = tags[0].substring(1);
      tagStr.split(';').forEach(kv => {
        const kvs = kv.split('=');
        this.tags[kvs[0]] = kvs[1];
      });
    }
    const r = /:([^:]+):?(.*)/.exec(msg);
    if(!r) {
      console.error('cant parse info', msg);
      return;
    }
    this.info = r[1];
    this.content = r[2];
    this.partials = this.info.split(' ');
    this.code = this.partials[1];
  }

  public getOrigin() {
    if(!this.origin) {
      const userOrigin = /([^!]*!)?([^@]+@)?(.*)/.exec(this.partials[0]);
      const od = new OriginData();
      if(!userOrigin) {
        console.error('Error parsing user origin', this.partials[0]);
        return od;
      }
      if (!userOrigin[2]) {
          od.server = userOrigin[1];
          od.simplyOrigin = od.server;
      } else if (!userOrigin[3]) {
          od.server = userOrigin[2];
          od.identity = userOrigin[1].slice(0, userOrigin[1].length - 1);
          od.simplyOrigin = od.identity;
      } else {
          od.server = userOrigin[3];
          od.identity = userOrigin[2].slice(0, userOrigin[2].length - 1);
          od.nick = userOrigin[1].slice(0, userOrigin[1].length - 1);
          od.simplyOrigin = od.nick;
      }
      this.origin = od;
    }
    return this.origin;
  }
}

export class OriginData {
  public server?: string;
  public identity?: string;
  public nick?: string;
  public simplyOrigin: string = '';
}
