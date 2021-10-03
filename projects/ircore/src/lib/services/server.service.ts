import { Message } from './../domain/message';
import { GlobUserService } from './glob-user.service';
import { PrivsService } from './privs.service';
import { NoticesService } from './notices.service';
import { ChannelsService } from './channels.service';
import { IRCParserV3 } from '../core/IRCParserV3';
import { CustomWebSocket, ConnectionStatus, ConnectionStatusData, MessageData } from '../core/custom.websocket';
import { ServerData } from '../core/server.data';
import { Injectable } from '@angular/core';
import { Channel } from '../domain/channelChat';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private static readonly VERSION = '3.0';
  private static servers: {[key: string]: ServerData} = {};

  constructor(private chanSrv: ChannelsService, noticeSrv: NoticesService, private privSrv: PrivsService, globUsr: GlobUserService) {
    IRCParserV3.setChanSrv(chanSrv);
    IRCParserV3.setNoticeSrv(noticeSrv)
    IRCParserV3.setPrivSrv(privSrv);
    IRCParserV3.setGlobUserSrv(globUsr);
    IRCParserV3.addDefaultListeners();
  }

  public connect(server: ServerData) {
    ServerService.servers[server.serverID] = server;
    server.websocket = new CustomWebSocket();
    const proto = server.withSSL ? 'wss' : 'ws';
    const subsc = server.websocket.onStatusChanged().subscribe((status: ConnectionStatusData<any>) => {
      if(status.status === ConnectionStatus.CONNECTED) {
        server.websocket?.send('ENCODING UTF-8');
        if (!server.withWebSocket) {
          server.websocket?.send(`HOST ${server.ircServer}`);
        }
        server.websocket?.send(`USER ${server.user.user} * * : IRCoreV${ServerService.VERSION}`);
        server.websocket?.send(`NICK ${server.user.nick}`);
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
      if (message.message.indexOf('PING') === 0) {
        const pingResp = message.message.slice(5);
        this.sendToServer(message.uuid, 'PONG ' + pingResp);
        return;
      }
      if (message.message.indexOf('ERROR') === 0) {
        console.error('Received error from stream: ', message.message);
        return;
      }
      console.log('RAW: ', message);
      IRCParserV3.process(message);
    });
  }

  public sendWhox(serverID: string, channel: string) {
    channel = channel[0] === '#' ? channel : '#' + channel;
    this.sendToServer(serverID, 'WHO ' + channel);
  }

  public join(serverID: string, channel: string) {
    if(channel[0] != '#') {
      channel = '#' + channel;
    }
    this.sendToServer(serverID, 'JOIN ' + channel)
  }

  public leave(serverID: string, channel: string) {
    if(channel[0] != '#') {
      channel = '#' + channel;
    }
    this.sendToServer(serverID, 'PART ' + channel)
  }

  public setNick(serverID: string, nick: string) {
    IRCParserV3.setNick(nick, serverID);
    this.sendToServer(serverID, 'NICK ' + nick);
  }

  public identify(serverID: string, password: string) {
    this.sendToServer(serverID, 'PRIVMSG NickServ identify ' + password);
  }

  public serverPass(serverID: string, user: string, password: string) {
    this.sendToServer(serverID, 'PASS ' + user + ':' + password);
  }

  public disconnect(serverID: string): void {
    this.getServerById(serverID).websocket?.disconnect();
  }

  public getServerById(id: string) {
    return ServerService.servers[id];
  }

  public getServerByIrcServer(ircServer: string) {
    const server = Object.keys(ServerService.servers).find(key => ServerService.servers[key].ircServer === ircServer);
    return server ? ServerService.servers[server] : undefined;
  }

  public sendToServer(serverID: string, raw: string) {
    this.getServerById(serverID).websocket?.send(raw);
  }

  public sendPrivMSG(serverID: string, nick: string, message: string) {
    if(nick[0] == '#') {
      throw 'invalid nick';
    }
    this.sendTo(serverID, nick, message);
    const msg = new Message();
    msg.author = IRCParserV3.getCurrentNick(serverID);
    msg.content = message;
    this.privSrv.onNewMessage(serverID, nick, msg.author, msg);
  }

  public sendChannelMSG(serverID: string, channel: string, message: string) {
    if(channel[0]!='#') {
      throw 'invalid channel, must start with #';
    }
    this.sendTo(serverID, channel, message);
    const msg = new Message();
    msg.author = IRCParserV3.getCurrentNick(serverID);
    msg.content = message;
    this.chanSrv.addMessageToChannel(serverID, new Channel(channel), msg);
  }

  public sendTo(serverID: string, chanOrNick: string, message: string) {
    const MAX_CHARS = 450;
    while(message.length > MAX_CHARS) {
      this.sendToServer(serverID, `PRIVMSG ${chanOrNick} :${message.substr(0, MAX_CHARS)}`);
      message = message.substr(MAX_CHARS);
    }
    this.sendToServer(serverID, `PRIVMSG ${chanOrNick} :${message}`);
  }

  public getCurrentNick(serverID: string) {
    return IRCParserV3.getCurrentNick(serverID);
  }

  public static getServerData(id: string) {
    return ServerService.servers[id];
  }
}
