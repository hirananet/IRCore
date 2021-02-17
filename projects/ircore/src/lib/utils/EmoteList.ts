export class EmoteList {

  public static facesLocation = 'assets/faces/';
  public static specialLocation = 'assets/specials/';
  public static facesExtension = '.png';
  public static memesLocation = 'assets/em-mem/';
  public static memesExtension = '';

  public static specialFaces = {};

  public static faces = [];

  public static memes = [];

  public static getMeme(name: string, author: string): string {
    if (this.memes.findIndex(meme => meme === name) >= 0) {
      return this.memesLocation + name + this.memesExtension;
    } else {
      return undefined;
    }
  }

  public static getFace(name: string, author: string, channel: string): string {
    if (this.faces.findIndex(meme => meme === name) >= 0) {
      return this.facesLocation + name + this.facesExtension;
    } else if (this.specialFaces[author] &&
               this.specialFaces[author].findIndex(meme => meme === name) >= 0) {
      return this.specialLocation + name + this.facesExtension;
    }
    return this.effectChecker(name, author, channel);
  }

  public static effectChecker(name: string, author: string, channel: string): string {
    return undefined;
  }

}
