import { WebSocketUtil } from './utils/WebSocket.util';
import { UserInfoService } from './services/user-info.service';
export declare class IRCoreService {
    private userSrv;
    static clientName: string;
    private webSocket;
    constructor(userSrv: UserInfoService);
    connect(url: string): void;
    handshake(username: string, apodo: string, gatwayHost?: string): void;
    identify(password: string): void;
    serverPass(user: string, password: string): void;
    setNick(nick: string): void;
    sendWhox(channel: any): void;
    join(channel: string): void;
    disconnect(): void;
    sendRaw(rawMessage: string): void;
    sendMessageOrCommand(command: string, target?: string): boolean;
    private _triggerMessage;
    getWS(): WebSocketUtil;
}
