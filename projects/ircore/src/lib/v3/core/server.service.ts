import { ConnectionStatus, ConnectionStatusData } from './../../utils/WebSocket.util';
import { CustomWebSocket } from './custom.websocket';
import { ServerData } from './server.data';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private servers: {[key: string]: ServerData} = {};

  constructor() {

  }

  connect(server: ServerData) {
    this.servers[server.serverID] = server;
    server.websocket = new CustomWebSocket();
    const proto = server.withSSL ? 'wss' : 'ws';
    const subsc = server.websocket.onStatusChanged().subscribe((status: ConnectionStatusData<any>) => {
      if(status.status === ConnectionStatus.CONNECTED) {
        server.websocket.send('ENCODING UTF-8');
        if (!server.withWebSocket) {
          server.websocket.send(`HOST ${server.ircServer}`);
        }
        server.websocket.send(`USER ${server.user.user} * * : IRCoreV3`);
        subsc.unsubscribe();
      }
    });
    if(server.withWebSocket) {
      server.websocket.connect(`${proto}://${server.ircServer}:${server.ircPort}`, server.serverID);
    } else {
      server.websocket.connect(`${proto}://${server.gatewayServer}:${server.gatewayPort}`, server.serverID);
    }
  }

  public getServerById(id: string) {
    return this.servers[id];
  }

  public getServerByIrcServer(ircServer: string) {
    return this.servers[Object.keys(this.servers).find(key => this.servers[key].ircServer === ircServer)];
  }
}
