import { CustomWebSocket } from './custom.websocket';

export class ServerData {

  public serverID: string = '';

  public ircServer: string = '';
  public ircPort: number = 443;

  // using websocket //
  public withWebSocket: boolean = true;
  public withSSL: boolean = true;

  // Gateway Server //
  public gatewayServer: string = '';
  public gatewayPort: number = 80;
  ////////////////////


  // User connection data //
  public user: User = new User();
  /////////////////////////

  public websocket?: CustomWebSocket;
}

export class User {
  public nick: string = '';
  public altNick: string = '';
  public user: string = '';
  public password: string = '';
  public identify: boolean = false;
}
