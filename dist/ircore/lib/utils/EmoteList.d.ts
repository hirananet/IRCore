export declare class EmoteList {
    static readonly facesLocation = "assets/faces/";
    static readonly specialLocation = "assets/specials/";
    static readonly facesExtension = ".png";
    static readonly memesLocation = "assets/em-mem/";
    static readonly memesExtension = "";
    static readonly specialFaces: {
        'Gabriela-': string[];
        Polsaker: string[];
    };
    static readonly faces: string[];
    static readonly memes: string[];
    static getMeme(name: string, author: string): string;
    static getFace(name: string, author: string): string;
}
