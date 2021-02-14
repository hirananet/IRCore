export declare class ValidRegex {
    static channelRegex(): string;
    static userRegex(): string;
    static actionRegex(): RegExp;
    static modeRegex(): string;
    static getRegex(regex: string): RegExp;
    static pingRegex(nick: string): string;
}
