// @dynamic
export class ValidRegex {

  public static channelRegex() {
    return '#([a-zA-Z0-9_#]+)';
  }

  public static userRegex() {
    return '([a-zA-Z_][a-zA-Z0-9_]+)'
  }

  public static actionRegex() {
    return /\x01ACTION ([^\x01]+)\x01/;
  }

  public static modeRegex() {
    return '(\\+|\-)?([a-zA-Z]+)';
  }

  public static getRegex(regex: string) {
    return new RegExp(regex);
  }

  public static pingRegex(nick: string) {
    return '^(.*(\\s|,|:))?('+nick.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+')((\\s|,|:).*)?$';
  }

  public static pingAllRegex(message) {
    return /@all/.exec(message);
  }

  public static quoteRegex(message: string) {
    return /^<([^>]+)>\s([^|]+)\|?(.*)$/.exec(message);
  }

  public static youtubeRegex(message: string) {
    return /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/.exec(message);
  }

  public static imageRegex(message: string) {
    return /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|gif|png)/.exec(message);
  }

  public static linkRegex(message: string) {
    return /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/.exec(message);
  }

}
