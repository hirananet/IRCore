export class RawMessage {

  public content: string;
  public info: string;
  public code: string;
  public partials: string[];

  public constructor(msg: string) {
    const r = /:([^:]+):?(.*)/.exec(msg);
    this.info = r[1];
    this.content = r[2];
    this.partials = this.info.split(' ');
    this.code = this.partials[1];
    // TODO: id message
  }

}
