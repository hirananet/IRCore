// @dynamic
export class AvatarHelper {

  private static avatarURL: string;

  public static setAvatarURL(url: string) {
    this.avatarURL = url;
  }

  public static getAvatarURL(): string {
    return this.avatarURL;
  }

}
