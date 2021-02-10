export class ChannelInfo {
  public name: string;
  public description: string;
  public flags: string;
  public users: number;

  constructor (name: string, description: string, flags: string, users: number) {
    this.name = name;
    this.description = description;
    this.flags = flags;
    this.users = users;
  }
}
