import { GlobUserService } from './../services/glob-user.service';
import { PrivsService } from './../services/privs.service';
import { ModeParser } from './ModeParser';
import { MessageData } from './custom.websocket';
import { Message } from '../domain/message';
import { UModes, UserData } from '../domain/userData';
import { Channel } from '../domain/channelChat';
import { RawMessage } from '../domain/rawMessage';
import { ServerService } from '../services/server.service';
import { ChannelsService } from '../services/channels.service';
import { NoticesService } from '../services/notices.service';

// @dynamic
export class IRCParserV3 {

  private static chanSrv: ChannelsService;
  private static noticeSrv: NoticesService;
  private static privSrv: PrivsService;
  private static globUsrSrv: GlobUserService;
  private static currentNick: {[key: string]: string} = {};

  private static listeners: {[code: string]: ((raw: RawMessage) => void)[]} = {}

  public static addListener(code: string, fn: (raw: RawMessage) => void) {
    if(!this.listeners[code]) {
      this.listeners[code] = [];
    }
    this.listeners[code].push(fn);
  }

  public static clearListeners(code: string) {
    this.listeners[code] = []
  }

  public static addDefaultListeners() {
    this.addListener('PRIVMSG', (c) => this.onPrivMSG(c));
    this.addListener('NOTICE', (c) => this.onNotice(c));
    this.addListener('JOIN', (c) => this.onJoin(c));
    this.addListener('PART', (c) => this.onPart(c));
    this.addListener('MODE', (c) => this.onModeCommand(c));
    this.addListener('NICK', (c) => this.onNickChanged(c));
    this.addListener('TOPIC', (c) => this.onChannelTopic(c));
    this.addListener('KICK', (c) => this.onKick(c));
    this.addListener('PONG', (c) => this.onPongReceived(c));
    this.addListener('QUIT', (c) => this.onQuit(c));
    this.addListener('301', (c) => this.onAwayMessage(c));
    this.addListener('307', (c) => this.onPartialUserData(c));
    this.addListener('311', (c) => this.onPartialUserData(c));
    this.addListener('312', (c) => this.onPartialUserData(c));
    this.addListener('313', (c) => this.onPartialUserData(c));
    this.addListener('315', (c) => this.onFinishWho(c));
    this.addListener('317', (c) => this.onPartialUserData(c));
    this.addListener('318', (c) => this.onFinishWhois(c));
    this.addListener('319', (c) => this.onChannelList(c));
    this.addListener('321', (c) => this.onStartCommandList(c));
    this.addListener('322', (c) => this.onCommandListNewChannel(c));
    this.addListener('323', (c) => this.onFinishCommandlList(c));
    this.addListener('330', (c) => this.onPartialUserData(c));
    this.addListener('332', (c) => this.onChannelTopicChanged(c));
    this.addListener('352', (c) => this.onWhoResponse(c));
    this.addListener('353', (c) => this.onCommandNamesResponse(c));
    this.addListener('366', (c) => this.onCommandNamesFinish(c));
    this.addListener('375', (c) => this.onMotd(c));
    this.addListener('376', (c) => this.onMotdEnd(c));
    this.addListener('378', (c) => this.onPartialUserData(c));
    this.addListener('379', (c) => this.onPartialUserData(c));
    this.addListener('401', (c) => this.onNonExistantNick(c));
    this.addListener('404', (c) => this.onChannelModerated(c));
    this.addListener('433', (c) => this.onNickAlreadyInUse(c));
    this.addListener('464', (c) => this.onNickRequirePassword(c));
    this.addListener('474', (c) => this.onBanned(c));
    this.addListener('671', (c) => this.onPartialUserData(c));
    this.addListener('716', (c) => this.onServerSideIgnore(c));
    this.addListener('718', (c) => this.onRequestPMGmode(c));
  }

  public static setChanSrv(chanSrv: ChannelsService) {
    this.chanSrv = chanSrv;
  }

  public static setNoticeSrv(noticeSrv: NoticesService) {
    this.noticeSrv = noticeSrv;
  }

  public static setPrivSrv(privSrv: PrivsService) {
    this.privSrv = privSrv;
  }

  public static setGlobUserSrv(globUsr: GlobUserService) {
    this.globUsrSrv = globUsr;
  }

  public static setNick(newNick: string, serverId: string) {
    this.currentNick[serverId] = newNick;
  }

  public static process(socketMessage: MessageData) {
    const raw = new RawMessage(socketMessage.message, socketMessage.uuid);
    if(this.listeners[raw.code]) {
      this.listeners[raw.code].forEach(fn => {
        fn(raw);
      });
      return;
    }
    return this.onUknownMessage(raw);
  }

  private static onPrivMSG(raw: RawMessage) {
    const message = Message.parseMessage(raw, this.currentNick[raw.serverID].toLowerCase());
    if(raw.partials[2].toLowerCase() == this.currentNick[raw.serverID].toLowerCase()) {
      const origin = raw.getOrigin().simplyOrigin;
      this.privSrv.onNewMessage(raw.serverID, origin, origin, message);
      this.privSrv.notifications.emit({
        raw,
        parsedObject: message,
        type: 'message'
      });
    } else {
      const channel = new Channel(raw.partials[2]);
      this.chanSrv.addMessageToChannel(raw.serverID, channel, message);
      this.chanSrv.notifications.emit({
        raw,
        type: 'message',
        parsedObject: message
      });
    }
  }

  private static onModeCommand(raw: RawMessage) { // user modes in channel changed
    const mode = ModeParser.parse(raw.raw);
    console.log('Mode: ', mode);
    if(mode[3]) {
      const modeParsed = {
        user: UserData.parseUser(mode[3]),
        channel: new Channel(raw.partials[2]),
        add: mode[1] === '+',
        mode: mode[2] ? mode[2] : ''
      };
      this.chanSrv.updateUserModeInChannel(raw.serverID, modeParsed);
      this.chanSrv.notifications.emit({
        raw,
        type: 'user-mode',
        parsedObject: modeParsed
      });
    } else {
      const modeParsed = {
        channel: new Channel(raw.partials[2]),
        mode: mode[2] ? mode[2] : ''
      };
      this.chanSrv.updateChannelMode(raw.serverID, modeParsed);
      this.chanSrv.notifications.emit({
        raw,
        type: 'chan-mode',
        parsedObject: modeParsed
      });
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
    this.chanSrv.notifications.emit({
      raw,
      type: 'nick-changed',
      parsedObject: {
        originalNick,
        newNick
      }
    });
  }

  private static onMotdEnd(raw: RawMessage) {
    this.noticeSrv.notifications.emit({
      raw,
      type: 'endMotd'
    });
  }

  private static onMotd(raw: RawMessage) {
    this.noticeSrv.notifications.emit({
      raw,
      type: 'motd'
    });
  }

  private static onNickRequirePassword(raw: RawMessage) {
    this.noticeSrv.notifications.emit({
      raw,
      type: 'require-pass'
    });
  }

  private static onChannelModerated(raw: RawMessage) {
    console.log('Channel moderated', raw);
    this.chanSrv.notifications.emit({
      raw,
      type: 'channel-moderated',
      parsedObject: {
        // TODO: channel in moderated mode
      }
    });
  }

  private static onChannelTopic(raw: RawMessage) {
    const channel = new Channel(raw.partials[2]);
    const topic = raw.content;
    this.chanSrv.setTopic(raw.serverID, channel, topic);
    this.chanSrv.notifications.emit({
      raw,
      type: 'topic',
      parsedObject: {
        channel,
        topic
      }
    });
  }

  private static onChannelTopicChanged(raw: RawMessage) {
    let channels = /#([^\s]+)/g.exec(raw.raw) as Array<string>;
    let channel = new Channel(channels.slice(1)[0]);
    let topic = raw.content;
    this.chanSrv.setTopic(raw.serverID, channel, topic);
    this.chanSrv.notifications.emit({
      raw,
      type: 'topic',
      parsedObject: {
        channel,
        topic
      }
    });
  }

  private static onServerSideIgnore(raw: RawMessage) {
    const author = raw.partials[3];
    const message = raw.content;
    this.privSrv.notifications.emit({
      raw,
      type: 'sside-ignored',
      parsedObject: {
        author,
        message
      }
    });
  }

  private static onNonExistantNick(raw: RawMessage) {
    const author = raw.partials[3];
    const message = raw.content;
    this.privSrv.notifications.emit({
      raw,
      type: 'non-existant',
      parsedObject: {
        author,
        message
      }
    });
  }

  private static onAwayMessage(raw: RawMessage) {
    const author = raw.partials[3];
    const message = raw.content;
    this.privSrv.notifications.emit({
      raw,
      type: 'away',
      parsedObject: {
        author,
        message
      }
    });
  }

  private static onBanned(raw: RawMessage) {
    console.log('Banned messagE: ', raw);
    this.chanSrv.notifications.emit({
      raw,
      type: 'banned',
      parsedObject: {
        // TODO: obtener canal.
      }
    });
  }

  private static onNickAlreadyInUse(raw: RawMessage) {
    // TODO: obtener nick anterior.
    console.log('Nick in use', raw);
    const serverData = ServerService.getServerData(raw.serverID);
    if(this.currentNick[raw.serverID].toLowerCase() == serverData.user.nick.toLowerCase()) {
      // change nick to alt nick
      serverData.websocket?.send(`NICK ${serverData.user.altNick}`)
      this.setNick(serverData.user.altNick, raw.serverID);
    } else if(this.currentNick[raw.serverID].toLowerCase() == serverData.user.altNick.toLowerCase()) {
      // TODO: change to random
    } else {
      // TODO: nick already in use, user changed.
    }
    this.noticeSrv.notifications.emit({
      raw,
      type: 'nick-in-use',
      parsedObject: {

      }
    });
  }

  private static onChannelList(raw: RawMessage) {
    const chnlList: Channel[] = [];
    raw.content.split(' ').forEach(pmChnl => {
      chnlList.push(new Channel(pmChnl));
    });
    const nick = UserData.parseUser(raw.partials[3]);
    if(this.currentNick[raw.serverID].toLowerCase() == nick.nick.toLowerCase()) {
      this.chanSrv.newChannelList(raw.serverID, chnlList);
      this.chanSrv.notifications.emit({
        raw,
        type: 'channels',
        parsedObject: chnlList
      });
    } else {
      // TODO: lista de canales del whois a un usuario
    }
  }

  private static onRequestPMGmode(raw: RawMessage) {  // requiere privado cuando tenes +g
    // :avalon.hira.io 718 Tulkalex Tulkaz ~Harkito@net-j7j.cur.32.45.IP :is messaging you, and you have user mode +g set.
    // Use /ACCEPT +Tulkaz to allow.
    this.privSrv.notifications.emit({
      raw,
      type: 'gmode',
      parsedObject: {
        author: raw.partials[3]
      }
    });
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
    const users = raw.content.trim().split(' ');
    users.forEach(usrStr => {
      const user = UserData.parseUser(usrStr);
      this.chanSrv.addUserToChannel(raw.serverID, channel, user);
    });
    this.chanSrv.notifications.emit({
      raw,
      type: 'names',
      parsedObject: users
    });
  }

  private static onWhoResponse(raw: RawMessage) {
    const data = /:([^\s]+)\s([0-9]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s(H|G)(\*?)(\~|\&|\@|\%|\+)?/.exec(raw.raw);
    if (data) {
      const user = this.globUsrSrv.getUser(raw.serverID, UserData.parseUser(data[8]));
      user.fullNick.origin = data[7];
      user.fullNick.nick = data[8];
      user.isAway = data[9] === 'G';
      user.netOp = data[10] === '*';
      const mod = data[11];
      console.log('WHO Channel? [2]', raw.partials, data)
      if (mod === '~') {
        user.updateModes(new Channel(raw.partials[2]), [UModes.FOUNDER]);
      } else if (mod === '&') {
        user.updateModes(new Channel(raw.partials[2]), [UModes.ADMIN]);
      } else if (mod === '@') {
        user.updateModes(new Channel(raw.partials[2]), [UModes.OPER]);
      } else if (mod === '%') {
        user.updateModes(new Channel(raw.partials[2]), [UModes.HALFOPER]);
      } else if (mod === '+') {
        user.updateModes(new Channel(raw.partials[2]), [UModes.VOICE]);
      }
    } else {
      console.error('BAD WHO RESPONSE PARSED: ', raw.raw, data);
    }
  }

  private static onKick(data: RawMessage) {
    const channel = new Channel(data.partials[2]);
    const operator = data.content;
    const kickData = /#([^\s]+)\s([^:]+)\s/.exec(data.raw);
    if(!kickData) {
      console.error('Error parsing kick data', data.raw);
      return;
    }
    const user = UserData.parseUser(kickData[2])
    this.chanSrv.removeUser(data.serverID, channel, user);
    // TODO: message kick
    this.chanSrv.notifications.emit({
      raw: data,
      type: 'kick',
      parsedObject: {
        channel,
        operator,
        userKicked: user
      }
    });
  }

  private static onQuit(data: RawMessage) {
    const userQuitted = UserData.parseUser(data.getOrigin().simplyOrigin);
    const quitMessage = data.content;
    this.chanSrv.removeUserInAllChannels(data.serverID, userQuitted);
    // TODO: message quit
    // TODO: notification
  }

  private static onJoin(data: RawMessage) {
    // original target = partials[2]
    const channel = new Channel(data.content ? data.content : data.partials[2]);
    const user = UserData.parseUser(data.getOrigin().simplyOrigin)
    if(user.nick == this.currentNick[data.serverID]) {
      this.chanSrv.addChannel(data.serverID, channel);
      this.chanSrv.notifications.emit({
        raw: data,
        type: 'new-channel',
        parsedObject: {
          channel,
          userJoined: user
        }
      });
    } else {
      this.chanSrv.addUserToChannel(data.serverID, channel, user);
      // TODO: message joined
      this.chanSrv.notifications.emit({
        raw: data,
        type: 'join',
        parsedObject: {
          channel,
          userJoined: user
        }
      });
    }
  }

  private static onPart(data: RawMessage) {
    const channel = new Channel(data.partials[2] ? data.partials[2] : data.content);
    const partMessage = data.content;
    const userParted = UserData.parseUser(data.getOrigin().simplyOrigin);
    if(userParted.nick == this.currentNick[data.serverID]) {
      this.chanSrv.removeChannel(data.serverID, channel);
      this.chanSrv.notifications.emit({
        raw: data,
        type: 'close-channel',
        parsedObject: {
          channel,
          userJoined: userParted
        }
      });
    } else {
      this.chanSrv.removeUser(data.serverID, channel, userParted);
      // TODO: message leave
      this.chanSrv.notifications.emit({
        raw: data,
        type: 'leave',
        parsedObject: {
          channel,
          userJoined: userParted,
          message: partMessage
        }
      });
    }
  }

  private static onNotice(data: RawMessage) {
    if(data.partials[2][0] === '#') {
      const channel = new Channel(data.partials[2]);
      // channel notice external
      const msg = new Message();
      msg.author = data.getOrigin().simplyOrigin;
      msg.channel = channel.name;
      msg.content = data.content;
      msg.preloaded = false;
      msg.externalNotice = true;
      msg.haveMention = false;
      this.chanSrv.addMessageToChannel(data.serverID, channel, msg);
      this.chanSrv.notifications.emit({
        raw: data,
        type: 'notice',
        parsedObject: {
          channel: msg.channel,
          author: msg.author,
          content: msg.content
        }
      });
    } else {
      // raw notice
      this.noticeSrv.addNoticeToServer(data.serverID, data.raw, true);
      this.noticeSrv.notifications.emit({
        raw: data,
        type: 'notice'
      });
    }
  }

  private static onPartialUserData(data: RawMessage) {
    const user = UserData.parseUser(data.partials[3]);
    const functions: {[code: string]: (data: RawMessage) => void} = {
      '307': (data: RawMessage) => {
        // nick registered
        this.globUsrSrv.getUser(data.serverID, user).registeredNick = data.content;
      },
      '311': (data: RawMessage) => {
        // :hiperion.hirana.net 311 Zerpiente Zerpiente Zerpiente Hirana-8kh.svf.168.181.IP * :IRCoreV2
        this.globUsrSrv.getUser(data.serverID, user).realName = data.content;
      },
      '312': (data: RawMessage) => {
        // :avalon.hira.io 312 Tulkalex Tulkalex avalon.hira.io :Avalon - Frankfurt, Germany
        this.globUsrSrv.getUser(data.serverID, user).server = data.content;
      },
      '313': (data: RawMessage) => {
        // :avalon.hira.io 313 Tulkalex Tulkalex :is a GlobalOp on Hira
        this.globUsrSrv.getUser(data.serverID, user).netOp = true;
      },
      '317': (data: RawMessage) => {
        // :avalon.hira.io 317 Tulkalex Tulkalex 6318 1602266231 :seconds idle, signon time
        this.globUsrSrv.getUser(data.serverID, user).idle = parseInt(data.partials[4]);
        this.globUsrSrv.getUser(data.serverID, user).lastLogin = parseInt(data.partials[5]);
      },
      '378': (data: RawMessage) => {
        // :avalon.hira.io 378 Tulkalex Tulkalex :is connecting from ~Tulkalandi@167.99.172.78 167.99.172.78
        this.globUsrSrv.getUser(data.serverID, user).fullNick.origin = data.content.replace('is connecting from ', '');
      },
      '379': (data: RawMessage) => {
        // :avalon.hira.io 379 Tulkalex Tulkalex :is using modes +Iiow
        let strModes = data.content.split(' ');
        const userModes = strModes[strModes.length - 1].substr(1);
        this.globUsrSrv.getUser(data.serverID, user).modes = Array.from(userModes);
      },
      '320': (data: RawMessage) => {
        // :avalon.hira.io 330 Tulkalex Tulkalex alexander1712 :is logged in as
        this.globUsrSrv.getUser(data.serverID, user).account = data.partials[4];
      },
      '371': (data: RawMessage) => {
        // :avalon.hira.io 671 Tulkalex Tulkalex :is using a secure connection
        this.globUsrSrv.getUser(data.serverID, user).ssl = true;
      }
    }
    if(functions[data.code]) {
      return functions[data.code](data);
    }
    console.error('Invalid code partial: ' + data.code);
    return;
  }

  private static onUknownMessage(raw: RawMessage) {
    this.noticeSrv.addNoticeToServer(raw.serverID, raw.raw, false);
    this.noticeSrv.notifications.emit({
      raw,
      type: 'uknown'
    });
  }

  private static onPongReceived(raw: RawMessage) {
    this.noticeSrv.notifications.emit({
      raw,
      type: 'pong'
    });
  }

  private static onCommandNamesFinish(raw: RawMessage) {
    // const channel = raw.partials[3];
  }

  private static onFinishWho(raw: RawMessage) {
    // End of who
  }

}
