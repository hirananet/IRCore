import { ModeParser } from './ModeParser';
import { MessageData } from './custom.websocket';
import { Message } from '../domain/message';
import { UserData } from '../domain/userData';
import { Channel } from '../domain/channelChat';
import { RawMessage } from '../domain/rawMessage';
import { ServerService } from '../services/server.service';
import { ChannelsService } from '../services/channels.service';

export class IRCParserV3 {

  private static chanSrv: ChannelsService;
  private static currentNick: {[key: string]: string} = {};

  public static setChanSrv(chanSrv: ChannelsService) {
    this.chanSrv = chanSrv;
  }

  public static setNick(newNick: string, serverId: string) {
    this.currentNick[serverId] = newNick;
  }

  public static process(socketMessage: MessageData) {
    const raw = new RawMessage(socketMessage.message, socketMessage.uuid);
    if (raw.code === 'PRIVMSG') {
      return this.onPrivMSG(raw);
    }
    if (raw.code === 'NOTICE') {
      return this.onNotice(raw);
    }
    if (raw.code === 'JOIN') {
      return this.onJoin(raw);
    }
    if (raw.code === 'PART') {
      return this.onPart(raw);
    }
    if (raw.code === 'MODE') {
      return this.onModeCommand(raw);
    }
    if (raw.code === 'NICK') {
      return this.onNickChanged(raw);
    }
    if (raw.code === 'TOPIC') {
      return this.onChannelTopicChanged(raw, true);
    }
    if (raw.code === 'KICK') {
      return this.onKick(raw);
    }
    if (raw.code === '301') {
      return this.onAwayMessage(raw);
    }
    if (raw.code === '307') {
      return this.onPartialUserData(raw, 'registered');
    }
    if (raw.code === '311') {
      return this.onPartialUserData(raw, 'real-name');
    }
    if (raw.code === '312') {
      return this.onPartialUserData(raw, 'server');
    }
    if (raw.code === '313') {
      return this.onPartialUserData(raw, 'is-gop');
    }
    if (raw.code === '315') {
      return this.onFinishWho(raw);
    }
    if (raw.code === '317') {
      return this.onPartialUserData(raw, 'idle-llogin');
    }
    if (raw.code === '318') {
      return this.onFinishWhois(raw);
    }
    if (raw.code === '319') {
      return this.onChannelList(raw);
    }
    if (raw.code === '321') {
      return this.onStartCommandList(raw);
    }
    if (raw.code === '322') {
      return this.onCommandListNewChannel(raw);
    }
    if (raw.code === '323') {
      return this.onFinishCommandlList(raw);
    }
    if (raw.code === '330') {
      return this.onPartialUserData(raw, 'user-account');
    }
    if (raw.code === '332') {
      return this.onChannelTopicChanged(raw, false);
    }
    if (raw.code === '352') {
      return this.onWhoResponse(raw);
    }
    if (raw.code === '353') {
      return this.onCommandNamesResponse(raw);
    }
    if (raw.code === '366') {
      return this.onCommandNamesFinish(raw);
    }
    if (raw.code === '375') {
      return this.onMotd(raw);
    }
    if (raw.code === '378') {
      return this.onPartialUserData(raw, 'connected-from');
    }
    if (raw.code === '379') {
      return this.onPartialUserData(raw, 'modes');
    }
    if (raw.code === '401') {
      return this.onNonExistantNick(raw);
    }
    if (raw.code === '404') {
      return this.onChannelModerated(raw);
    }
    if (raw.code === '433') {
      return this.onNickAlreadyInUse(raw);
    }
    if (raw.code === '464') {
      return this.onNickRequirePassword(raw);
    }
    if (raw.code === '474') {
      return this.onBanned(raw);
    }
    if (raw.code === '671') {
      return this.onPartialUserData(raw, 'is-secured');
    }
    if (raw.code === '716') {
      return this.onServerSideIgnore(raw);
    }
    if (raw.code === '718') {
      return this.onRequestPMGmode(raw);
    }
    if (raw.code === 'PONG') {
      return this.onPongReceived(raw);
    }
    if (raw.code === 'QUIT') {
      return this.onQuit(raw);
    }
    return this.onUknownMessage(raw);
  }

  private static onPrivMSG(raw: RawMessage) {
    const message = Message.parseMessage(raw, this.currentNick[raw.serverID].toLowerCase());
    if(raw.partials[2].toLowerCase() == this.currentNick[raw.serverID].toLowerCase()) {
      // TODO: priv message:
    } else {
      const channel = new Channel(raw.partials[2]);
      this.chanSrv.addMessageToChannel(raw.serverID, channel, message);
    }
  }

  private static onModeCommand(raw: RawMessage) { // user modes in channel changed
    const mode = ModeParser.parse(raw.raw);
    console.log('Mode: ', mode);
    if(mode[3]) {
      this.chanSrv.updateUserModeInChannel(raw.serverID, {
        user: UserData.parseUser(mode[3]),
        channel: new Channel(raw.partials[2]),
        add: mode[1] === '+',
        mode: mode[2]
      });
      // FIXME: notification
    } else {
      this.chanSrv.updateChannelMode(raw.serverID, {
        channel: new Channel(raw.partials[2]),
        mode: mode[2]
      });
      // FIXME: notification
    }
  }

  private static onNickChanged(raw: RawMessage) {
    const newNick = raw.partials[2] ? raw.partials[2] : raw.content;
    const originalNick = UserData.parseUser(raw.getOrigin().simplyOrigin);
    if(originalNick.nick.toLowerCase() == this.currentNick[raw.serverID].toLowerCase()) {
      this.setNick(newNick, raw.serverID);
      // FIXME: notification me nick changed
    }
    this.chanSrv.nickChangeInAllChannels(raw.serverID, originalNick, UserData.parseUser(newNick));
    // FIXME: notification
  }

  private static onMotd(raw: RawMessage) {
    // TODO: MOTD
  }

  private static onNickRequirePassword(raw: RawMessage) {
    // TODO: alert nick require password / ZNC?
  }

  private static onChannelModerated(raw: RawMessage) {
    // TODO: channel in moderated mode
  }

  private static onChannelTopicChanged(raw: RawMessage, fromTopic: boolean) {
    let channel;
    let topic;
    if(fromTopic) {
      channel = new Channel(raw.partials[2]);
      topic = raw.content;
    } else {
      let channels = /#([^\s]+)/g.exec(raw.raw) as Array<string>;
      channel = new Channel(channels.slice(1)[0]);
      topic = raw.content;
    }
    this.chanSrv.setTopic(raw.serverID, channel, topic);
    // FIXME: notification
  }

  private static onServerSideIgnore(raw: RawMessage) {
    const author = raw.partials[3];
    const message = raw.content;
    // TODO: server ignored alert
  }

  private static onNonExistantNick(raw: RawMessage) {
    const author = raw.partials[3];
    const message = raw.content;
    // TODO: non existant nick
  }

  private static onAwayMessage(raw: RawMessage) {
    const author = raw.partials[3];
    const message = raw.content;
    // TODO: away message
  }

  private static onBanned(raw: RawMessage) {
    console.log(raw);
    // TODO: obtener canal.
    // StatusHandler.onBanned('');
    // return;
  }

  private static onNickAlreadyInUse(raw: RawMessage) {
    // TODO: obtener nick anterior.
    console.log(raw);
    const serverData = ServerService.getServerData(raw.serverID);
    if(this.currentNick[raw.serverID].toLowerCase() == serverData.user.nick.toLowerCase()) {
      // change nick to alt nick
      serverData.websocket.send(`NICK ${serverData.user.altNick}`)
      this.setNick(serverData.user.altNick, raw.serverID);
    } else if(this.currentNick[raw.serverID].toLowerCase() == serverData.user.altNick.toLowerCase()) {
      // TODO: change to random
    } else {
      // TODO: nick already in use, user changed.
    }
  }

  private static onChannelList(raw: RawMessage) {
    const chnlList: Channel[] = [];
    raw.content.split(' ').forEach(pmChnl => {
      chnlList.push(new Channel(pmChnl));
    });
    const nick = UserData.parseUser(raw.partials[3]);
    if(this.currentNick[raw.serverID].toLowerCase() == nick.nick.toLowerCase()) {
      this.chanSrv.newChannelList(raw.serverID, chnlList);
    } else {
      // TODO: lista de canales del whois a un usuario
    }
  }

  private static onRequestPMGmode(raw: RawMessage) {  // requiere privado cuando tenes +g
    // :avalon.hira.io 718 Tulkalex Tulkaz ~Harkito@net-j7j.cur.32.45.IP :is messaging you, and you have user mode +g set.
    // Use /ACCEPT +Tulkaz to allow.
    const author = raw.partials[3];
    // TODO:send invite request
  }

  private static onFinishWhois(raw: RawMessage) {
    // WhoIsHandler.finalWhoisMessage(raw.partials[3]);
  }

  private static onStartCommandList(raw: RawMessage) {
    // Start command /LIST
  }

  private static onCommandListNewChannel(raw: RawMessage) {
    // const body = raw.body.split(']');
    // channel of /LIST
    // ListHandler.addChannels(new ChannelInfo(raw.partials[3].slice(1), body[1], body[0].replace('[' , ''), parseInt(raw.partials[4])));
  }

  private static onFinishCommandlList(raw: RawMessage) {
    // end command /LIST
  }

  private static onCommandNamesResponse(raw: RawMessage) {
    const messages = /(=|@|\*)([^:]+):/.exec(raw.raw);
    if(!messages || messages.length < 2) {
      console.error('Bad parsing Names channel ', raw.raw);
      return;
    }
    const channel = new Channel(messages[2].trim());
    raw.content.trim().split(' ').forEach(usrStr => {
      const user = UserData.parseUser(usrStr);
      this.chanSrv.addUserToChannel(raw.serverID, channel, user);
    });
  }

  private static onWhoResponse(raw: RawMessage) {
    // const data = WhoHandler.WHOUserParser(rawMessage);
    // if (data) {
    //   const whoData = new Who();
    //   whoData.serverFrom = data[7];
    //   whoData.nick = data[8];
    //   whoData.isAway = data[9] === 'G';
    //   whoData.isNetOp = data[10] === '*';
    //   whoData.rawMsg = rawMessage;
    //   const mod = data[11];
    //   if (mod === '~') {
    //     whoData.mode = UModes.FOUNDER;
    //   } else if (mod === '&') {
    //     whoData.mode = UModes.ADMIN;
    //   } else if (mod === '@') {
    //     whoData.mode = UModes.OPER;
    //   } else if (mod === '%') {
    //     whoData.mode = UModes.HALFOPER;
    //   } else if (mod === '+') {
    //     whoData.mode = UModes.VOICE;
    //   }
    //   WhoHandler.addWhoData(data[8], whoData);
    // } else {
    //   console.error('BAD WHO RESPONSE PARSED: ', rawMessage, data);
    // }
  }

  private static onKick(data: RawMessage) {
    const channel = new Channel(data.partials[2]);
    const operator = data.content;
    const kickData = /#([^\s]+)\s([^:]+)\s/.exec(data.raw);
    const user = UserData.parseUser(kickData[2])
    this.chanSrv.removeUser(data.serverID, channel, user);
    // FIXME: notification
  }

  private static onQuit(data: RawMessage) {
    const userQuitted = UserData.parseUser(data.getOrigin().simplyOrigin);
    const quitMessage = data.content;
    this.chanSrv.removeUserInAllChannels(data.serverID, userQuitted);
    // FIXME: notification
  }

  private static onJoin(data: RawMessage) {
    // original target = partials[2]
    const channel = new Channel(data.content ? data.content : data.partials[2]);
    const user = UserData.parseUser(data.getOrigin().simplyOrigin)
    if(user.nick == this.currentNick[data.serverID]) {
      this.chanSrv.addChannel(data.serverID, channel);
    } else {
      this.chanSrv.addUserToChannel(data.serverID, channel, user);
      // FIXME: notification
    }
  }

  private static onPart(data: RawMessage) {
    const channel = new Channel(data.partials[2]);
    const partMessage = data.content;
    const userParted = UserData.parseUser(data.getOrigin().simplyOrigin);
    if(userParted.nick == this.currentNick[data.serverID]) {
      this.chanSrv.removeChannel(data.serverID, channel);
    } else {
      this.chanSrv.removeUser(data.serverID, channel, userParted);
      // FIXME: notification
    }
  }

  private static onNotice(data: RawMessage) {
    // if(raw.target[0] === '#') {
    //   // notice a un canal
    //   const message = new IndividualMessage();
    //   message.author = raw.simplyOrigin;
    //   message.message = raw.content;
    //   message.meAction = false;
    //   message.externalNotice = true;
    //   message.time = Time.getTime();
    //   message.date = Time.getDateStr();
    //   message.messageType = IndividualMessageTypes.CHANMSG;
    //   message.channel = raw.target;
    //   MessageHandler.onMessage(message);
    //   return;
    // } else if (raw.simplyOrigin && raw.simplyOrigin !== '*status' && raw.target[0] === '#') {
    //   // notices generales
    //   const message = new IndividualMessage();
    //   message.messageType = IndividualMessageTypes.NOTIFY;
    //   message.author = raw.simplyOrigin;
    //   message.message = raw.content;
    //   message.meAction = false;
    //   message.channel = raw.target;
    //   message.time = Time.getTime();
    //   message.date = Time.getDateStr();
    //   MessageHandler.onMessage(message);
    //   return;
    // } else {
    //   // notice
    //   ServerHandler.onServerNoticeResponse(raw);
    //   return;
    // }
  }

  private static onPartialUserData(data: RawMessage, key: string) {
    // connected-from
    // connecting from
    // :avalon.hira.io 378 Tulkalex Tulkalex :is connecting from ~Tulkalandi@167.99.172.78 167.99.172.78
    // WhoIsHandler.addWhoisPartial(raw.partials[3], 'connectedFrom', raw.body.replace('is connecting from ', ''));

    // registered
    // nick registered
    // WhoIsHandler.addWhoisPartial(raw.partials[3], 'registered', raw.body);

    // real-name
    // :hiperion.hirana.net 311 Zerpiente Zerpiente Zerpiente Hirana-8kh.svf.168.181.IP * :IRCoreV2
    // WhoIsHandler.addWhoisPartial(raw.partials[3], 'realn', raw.body);

    // server
    // server desde donde está conectado
    // :avalon.hira.io 312 Tulkalex Tulkalex avalon.hira.io :Avalon - Frankfurt, Germany
    // WhoIsHandler.addWhoisPartial(raw.partials[3], 'server', raw.body);

    // is-gop
    // :avalon.hira.io 313 Tulkalex Tulkalex :is a GlobalOp on Hira
    // WhoIsHandler.addWhoisPartial(raw.partials[3], 'isGOP', true);

    // modes
    // :avalon.hira.io 379 Tulkalex Tulkalex :is using modes +Iiow
    // const modes = raw.body.split(' ');
    // WhoIsHandler.addWhoisPartial(raw.partials[3], 'modes', modes[modes.length - 1]);

    // user-account
    // :avalon.hira.io 330 Tulkalex Tulkalex alexander1712 :is logged in as
    // WhoIsHandler.addWhoisPartial(raw.partials[3], 'userAccount', raw.partials[4]);

    // is-secured
    // :avalon.hira.io 671 Tulkalex Tulkalex :is using a secure connection
    // WhoIsHandler.addWhoisPartial(raw.partials[3], 'isSecured', true);

    // idle-llogin
    // :avalon.hira.io 317 Tulkalex Tulkalex 6318 1602266231 :seconds idle, signon time
    // WhoIsHandler.addWhoisPartial(raw.partials[3], 'idle', raw.partials[4]);
    // WhoIsHandler.addWhoisPartial(raw.partials[3], 'lastLogin', raw.partials[5]);
  }

  private static onUknownMessage(raw: RawMessage) {
    // TODO: generic message
  }

  private static onPongReceived(raw: RawMessage) { }

  private static onCommandNamesFinish(raw: RawMessage) {
    // const channel = raw.partials[3];
  }

  private static onFinishWho(raw: RawMessage) {
    // End of who
  }

}
