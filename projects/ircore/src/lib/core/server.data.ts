import { CustomWebSocket } from './custom.websocket';

export class ServerData {

  public serverID: string;

  public ircServer: string;
  public ircPort: number;

  // using websocket //
  public withWebSocket: boolean;
  public withSSL: boolean;

  // Gateway Server //
  public gatewayServer: string;
  public gatewayPort: number;
  ////////////////////


  // User connection data //
  public user: User = new User();
  /////////////////////////

  public websocket?: CustomWebSocket;
}

export class User {
  public nick: string;
  public altNick: string;
  public user: string;
  public password: string;
}
