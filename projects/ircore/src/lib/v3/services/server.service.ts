import { NoticesService } from './notices.service';
import { ChannelsService } from './channels.service';
import { IRCParserV3 } from '../core/IRCParserV3';
import { CustomWebSocket, ConnectionStatus, ConnectionStatusData, MessageData } from '../core/custom.websocket';
import { ServerData } from '../core/server.data';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private static servers: {[key: string]: ServerData} = {};

  constructor(chanSrv: ChannelsService, noticeSrv: NoticesService) {
    IRCParserV3.setChanSrv(chanSrv);
    IRCParserV3.setNoticeSrv(noticeSrv)
    IRCParserV3.addDefaultListeners();
  }

  public connect(server: ServerData) {
    ServerService.servers[server.serverID] = server;
    server.websocket = new CustomWebSocket();
    const proto = server.withSSL ? 'wss' : 'ws';
    const subsc = server.websocket.onStatusChanged().subscribe((status: ConnectionStatusData<any>) => {
      if(status.status === ConnectionStatus.CONNECTED) {
        server.websocket.send('ENCODING UTF-8');
        if (!server.withWebSocket) {
          server.websocket.send(`HOST ${server.ircServer}`);
        }
        server.websocket.send(`USER ${server.user.user} * * : IRCoreV3`);
        server.websocket.send(`NICK ${server.user.nick}`);
        IRCParserV3.setNick(server.user.nick, server.serverID);
        subsc.unsubscribe();
      }
    });
    if(server.withWebSocket) {
      server.websocket.connect(`${proto}://${server.ircServer}:${server.ircPort}`, server.serverID);
    } else {
      server.websocket.connect(`${proto}://${server.gatewayServer}:${server.gatewayPort}`, server.serverID);
    }
    server.websocket.onMessageReceived().subscribe((message: MessageData) => {
      console.log('RAW: ' + message);
      IRCParserV3.process(message);
    });
  }

  public getServerById(id: string) {
    return ServerService.servers[id];
  }

  public getServerByIrcServer(ircServer: string) {
    return ServerService.servers[Object.keys(ServerService.servers).find(key => ServerService.servers[key].ircServer === ircServer)];
  }

  public sendToServer(id: string, raw: string) {
    ServerService.servers[id].websocket.send(raw);
  }

  public static getServerData(id: string) {
    return ServerService.servers[id];
  }
}
