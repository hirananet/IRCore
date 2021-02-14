import { Join } from './dto/Join';
import { PartHandler } from './handlers/Part.handler';
import { KickInfo } from './dto/KickInfo';
import { KickHandler } from './handlers/Kick.handler';
import { Away } from './dto/Away';
import { NewMode } from './dto/NewMode';
import { GmodeHandler } from './handlers/Gmode.handler';
import { Channel } from './dto/Channel';
import { ChannelListHandler } from './handlers/ChannelList.handler';
import { WhoIsHandler } from './handlers/Whois.handler';
import { WhoHandler } from './handlers/Who.handler';
import { Who } from './dto/Who';
import { UModes } from './utils/UModes.utils';
import { UsersHandler } from './handlers/Users.handler';
import { UserInChannel } from './dto/UserInChannel';
import { ListHandler } from './handlers/List.handler';
import { ChannelInfo } from './dto/ChannelInfo';
import { StatusHandler } from './handlers/Status.handler';
import { NickChange } from './dto/NickChange';
import { IRCMessage, OriginData } from './utils/IRCMessage.util';
import { ModeHandler } from './handlers/Mode.handler';
import { User } from './dto/User';
import { AwayHandler } from './handlers/Away.handler';
import { IgnoreHandler } from './handlers/Ignore.Handler';
import { MotdHandler } from './handlers/Motd.handler';
import { ChannelStatusHandler } from './handlers/ChannelStatus.handler';
import { Part } from './dto/Part';
import { QuitHandler } from './handlers/Quit.handler';
import { Quit } from './dto/Quit';
import { JoinHandler } from './handlers/Join.handler';
import { ServerHandler } from './handlers/Server.handler';
import { MessageHandler } from './handlers/Message.handler';
import { IndividualMessage, IndividualMessageTypes } from './dto/IndividualMessage';
import { Time } from './utils/Time.util';
import { ModeratedHandler } from './handlers/Moderated.handler';
export class IRCParserV2 {
    static parseMessage(message) {
        const out = [];
        message.split('\r\n').forEach(msgLine => {
            const r = /:([^:]+):?(.*)/.exec(msgLine);
            const TAG = r[1];
            const MSG = r[2];
            const partials = TAG.split(' ');
            const im = new IRCMessage();
            im.body = MSG;
            im.tag = TAG;
            im.partials = partials;
            im.code = partials[1];
            const target = /([^!]*!)?([^@]+@)?(.*)/.exec(partials[0]);
            const od = new OriginData();
            if (!target[2]) {
                od.server = target[1];
                im.simplyOrigin = od.server;
            }
            else if (!target[3]) {
                od.server = target[2];
                od.identitity = target[1].slice(0, target[1].length - 1);
                im.simplyOrigin = od.identitity;
            }
            else {
                od.server = target[3];
                od.identitity = target[2].slice(0, target[1].length - 1);
                od.nick = target[1].slice(0, target[1].length - 1);
                im.simplyOrigin = od.nick;
            }
            im.origin = od;
            im.target = partials[2];
            im.message = MSG;
            out.push(im);
        });
        return out;
    }
    static processMessage(parsedMessage, rawMessage, actualNick) {
        if (parsedMessage.code === '319') { // lista de canales
            const chnlList = [];
            parsedMessage.message.split(' ').forEach(pmChnl => {
                const chnl = new Channel(pmChnl);
                chnlList.push(chnl);
            });
            WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'channelList', chnlList);
            ChannelListHandler.setChannelList(parsedMessage.partials[3], chnlList);
            return;
        }
        if (parsedMessage.code === '718') {
            // :avalon.hira.io 718 Tulkalex Tulkaz ~Harkito@net-j7j.cur.32.45.IP :is messaging you, and you have user mode +g set.
            // Use /ACCEPT +Tulkaz to allow.
            GmodeHandler.privateRequest(parsedMessage.partials[3]);
            return;
        }
        if (parsedMessage.code === '378') {
            // connecting from
            // :avalon.hira.io 378 Tulkalex Tulkalex :is connecting from ~Tulkalandi@167.99.172.78 167.99.172.78
            WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'connectedFrom', parsedMessage.body.replace('is connecting from ', ''));
            return;
        }
        if (parsedMessage.code === '312') {
            // server desde donde está conectado
            // :avalon.hira.io 312 Tulkalex Tulkalex avalon.hira.io :Avalon - Frankfurt, Germany
            WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'server', parsedMessage.body);
            return;
        }
        if (parsedMessage.code === '313') {
            // :avalon.hira.io 313 Tulkalex Tulkalex :is a GlobalOp on Hira
            WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'isGOP', true);
            return;
        }
        if (parsedMessage.code === '379') {
            // :avalon.hira.io 379 Tulkalex Tulkalex :is using modes +Iiow
            const modes = parsedMessage.body.split(' ');
            WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'modes', modes[modes.length - 1]);
            return;
        }
        if (parsedMessage.code === '330') {
            // :avalon.hira.io 330 Tulkalex Tulkalex alexander1712 :is logged in as
            WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'userAccount', parsedMessage.partials[4]);
            return;
        }
        if (parsedMessage.code === '671') {
            // :avalon.hira.io 671 Tulkalex Tulkalex :is using a secure connection
            WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'isSecured', true);
            return;
        }
        if (parsedMessage.code === '317') {
            // :avalon.hira.io 317 Tulkalex Tulkalex 6318 1602266231 :seconds idle, signon time
            WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'idle', parsedMessage.partials[4]);
            WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'lastLogin', parsedMessage.partials[5]);
            return;
        }
        if (parsedMessage.code === '318') {
            WhoIsHandler.finalWhoisMessage(parsedMessage.partials[3]);
            return;
        }
        if (parsedMessage.code === '352') { // user info (WHO response)
            const data = WhoHandler.WHOUserParser(rawMessage);
            if (data) {
                const whoData = new Who();
                whoData.serverFrom = data[7];
                whoData.nick = data[8];
                whoData.isAway = data[9] === 'G';
                whoData.isNetOp = data[10] === '*';
                whoData.rawMsg = rawMessage;
                const mod = data[11];
                if (mod === '~') {
                    whoData.mode = UModes.FOUNDER;
                }
                else if (mod === '&') {
                    whoData.mode = UModes.ADMIN;
                }
                else if (mod === '@') {
                    whoData.mode = UModes.OPER;
                }
                else if (mod === '%') {
                    whoData.mode = UModes.HALFOPER;
                }
                else if (mod === '+') {
                    whoData.mode = UModes.VOICE;
                }
                WhoHandler.addWhoData(data[8], whoData);
            }
            else {
                console.error('BAD WHO RESPONSE PARSED: ', rawMessage, data);
            }
            return;
        }
        if (parsedMessage.code === '353') { // names
            const channel = UsersHandler.getChannelOfMessage(rawMessage);
            const users = parsedMessage.message.trim().split(' ');
            const usersInChannel = [];
            users.forEach(user => {
                usersInChannel.push(new UserInChannel(user, channel));
            });
            const chnlObj = new Channel(channel);
            UsersHandler.addUsersToChannel(chnlObj.name, usersInChannel);
            return;
        }
        // 321 inicio lista de canales (borrar)
        if (parsedMessage.code === '321') {
            ListHandler.newChannelList();
            return;
        }
        // 322 canal de lista de canales
        if (parsedMessage.code === '322') {
            const body = parsedMessage.body.split(']');
            ListHandler.addChannels(new ChannelInfo(parsedMessage.partials[3].slice(1), body[1], body[0].replace('[', ''), parseInt(parsedMessage.partials[4])));
            return;
        }
        if (parsedMessage.code === '433') { // nick already in use
            // TODO: obtener nick anterior.
            StatusHandler.onNickAlreadyInUse('');
            return;
        }
        if (parsedMessage.code === '474') {
            // TODO: obtener canal.
            StatusHandler.onBanned('');
            return;
        }
        if (parsedMessage.code === 'NICK') {
            StatusHandler.onNickChanged(new NickChange(parsedMessage.simplyOrigin, parsedMessage.target ? parsedMessage.target : parsedMessage.message));
            return;
        }
        if (parsedMessage.code === 'MODE') {
            const mode = ModeHandler.modeParser(rawMessage);
            if (mode[3]) {
                const nmode = new NewMode();
                nmode.userTarget = new User(mode[3]);
                nmode.channelTarget = parsedMessage.target;
                nmode.modeAdded = mode[1] === '+';
                nmode.mode = mode[2];
                ModeHandler.changeMode(nmode);
            }
            else {
                const nmode = new NewMode();
                nmode.channelTarget = parsedMessage.target;
                nmode.userTarget = new User(parsedMessage.target);
                nmode.mode = mode[2];
                ModeHandler.changeMode(nmode);
            }
            return;
        }
        if (parsedMessage.code === '301') { // away message
            const away = new Away();
            away.author = parsedMessage.partials[3];
            away.message = parsedMessage.message;
            AwayHandler.onAway(away);
            return;
        }
        if (parsedMessage.code === '716') { // server side ignored
            const ignore = new Away();
            ignore.author = parsedMessage.partials[3];
            ignore.message = parsedMessage.message;
            IgnoreHandler.onIgnore(ignore);
        }
        if (parsedMessage.code === '464') {
            MotdHandler.requirePasswordResponse.emit(parsedMessage);
            return;
        }
        if (parsedMessage.code === '404') {
            ModeratedHandler.channelModerated.emit(parsedMessage);
            return;
        }
        if (parsedMessage.code === '375') {
            MotdHandler.motdResponse.emit(parsedMessage);
            return;
        }
        if (parsedMessage.code === 'PONG') {
            return;
        }
        if (parsedMessage.code === 'NOTICE') {
            if (parsedMessage.simplyOrigin && parsedMessage.simplyOrigin !== '*status' && parsedMessage.target[0] === '#') {
                const message = new IndividualMessage();
                message.messageType = IndividualMessageTypes.NOTIFY;
                message.author = parsedMessage.simplyOrigin;
                message.message = parsedMessage.message;
                message.meAction = false;
                message.channel = parsedMessage.target;
                message.time = Time.getTime();
                message.date = Time.getDateStr();
                MessageHandler.onMessage(message);
                return;
            }
            else {
                ServerHandler.onServerNoticeResponse(parsedMessage);
                return;
            }
        }
        if (parsedMessage.code === '332') {
            const channels = ChannelStatusHandler.findChannels(rawMessage);
            ChannelStatusHandler.setChannelTopic(channels[0], parsedMessage.message);
            return;
        }
        if (parsedMessage.code === 'TOPIC') {
            ChannelStatusHandler.setChannelTopic(parsedMessage.target, parsedMessage.message);
            return;
        }
        if (parsedMessage.code === '315') {
            // TODO: check this... End of who
            return;
        }
        if (parsedMessage.code === 'KICK') {
            let channel = parsedMessage.target;
            const kickData = KickHandler.kickParse(rawMessage);
            const kickInfo = new KickInfo();
            kickInfo.channel = new Channel(channel);
            kickInfo.operator = parsedMessage.message;
            kickInfo.userTarget = new User(kickData[2]);
            KickHandler.onKick(kickInfo);
        }
        if (parsedMessage.code === 'PART') {
            // :Harko!~Harkolandia@harkonidaz.irc.tandilserver.com PART #SniferL4bs :"Leaving"
            let channel = parsedMessage.target;
            if (!channel) {
                channel = parsedMessage.message;
            }
            const part = new Part();
            part.channel = new Channel(channel);
            part.message = parsedMessage.message;
            part.user = new User(parsedMessage.simplyOrigin);
            PartHandler.onPart(part);
        }
        if (parsedMessage.code === 'QUIT') {
            QuitHandler.onQuit(new Quit(parsedMessage.simplyOrigin));
        }
        if (parsedMessage.code === 'JOIN') {
            const join = new Join();
            const channel = parsedMessage.message ? parsedMessage.message : parsedMessage.target;
            join.channel = new Channel(channel);
            join.user = new User(parsedMessage.simplyOrigin);
            join.origin = parsedMessage.origin;
            JoinHandler.onJoin(join);
        }
        if (parsedMessage.code === 'PRIVMSG') {
            const meMsg = MessageHandler.getMeAction(parsedMessage);
            const message = new IndividualMessage();
            message.author = parsedMessage.simplyOrigin;
            if (meMsg) {
                message.message = meMsg[1];
                message.meAction = true;
            }
            else {
                message.message = parsedMessage.message;
                message.meAction = false;
            }
            message.time = Time.getTime();
            message.date = Time.getDateStr();
            if (parsedMessage.target === actualNick) { // privado
                message.messageType = IndividualMessageTypes.PRIVMSG;
            }
            else {
                message.messageType = IndividualMessageTypes.CHANMSG;
                message.channel = parsedMessage.target;
            }
            message.mention = message.message ? message.message.indexOf(actualNick) >= 0 : false;
            MessageHandler.onMessage(message);
            return;
        }
        ServerHandler.onServerResponse(parsedMessage);
        return;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSVJDUGFyc2VyVjIuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvYWxleGEvZ2l0L0lSQ29yZS9wcm9qZWN0cy9pcmNvcmUvc3JjLyIsInNvdXJjZXMiOlsibGliL0lSQ1BhcnNlclYyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNsQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDcEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNoQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxhQUFhLEVB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TCxPQUFPLENBQUMsV0FBVyxHQUFHLHNCQUFzQixDQUFDLE9BQU8sQ0FBQztnQkFDckQsT0FBTyxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDO2FBQ3hDO1lBQ0QsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNyRixjQUFjLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLE9BQU87U0FDUjtRQUVELGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5QyxPQUFPO0lBQ1QsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSm9pbiB9IGZyb20gJy4vZHRvL0pvaW4nO1xuaW1wb3J0IHsgUGFydEhhbmRsZXIgfSBmcm9tICcuL2hhbmRsZXJzL1BhcnQuaGFuZGxlcic7XG5pbXBvcnQgeyBLaWNrSW5mbyB9IGZyb20gJy4vZHRvL0tpY2tJbmZvJztcbmltcG9ydCB7IEtpY2tIYW5kbGVyIH0gZnJvbSAnLi9oYW5kbGVycy9LaWNrLmhhbmRsZXInO1xuaW1wb3J0IHsgQXdheSB9IGZyb20gJy4vZHRvL0F3YXknO1xuaW1wb3J0IHsgTmV3TW9kZSB9IGZyb20gJy4vZHRvL05ld01vZGUnO1xuaW1wb3J0IHsgR21vZGVIYW5kbGVyIH0gZnJvbSAnLi9oYW5kbGVycy9HbW9kZS5oYW5kbGVyJztcbmltcG9ydCB7IENoYW5uZWwgfSBmcm9tICcuL2R0by9DaGFubmVsJztcbmltcG9ydCB7IENoYW5uZWxMaXN0SGFuZGxlciB9IGZyb20gJy4vaGFuZGxlcnMvQ2hhbm5lbExpc3QuaGFuZGxlcic7XG5pbXBvcnQgeyBXaG9Jc0hhbmRsZXIgfSBmcm9tICcuL2hhbmRsZXJzL1dob2lzLmhhbmRsZXInO1xuaW1wb3J0IHsgV2hvSGFuZGxlciB9IGZyb20gJy4vaGFuZGxlcnMvV2hvLmhhbmRsZXInO1xuaW1wb3J0IHsgV2hvIH0gZnJvbSAnLi9kdG8vV2hvJztcbmltcG9ydCB7IFVNb2RlcyB9IGZyb20gJy4vdXRpbHMvVU1vZGVzLnV0aWxzJztcbmltcG9ydCB7IFVzZXJzSGFuZGxlciB9IGZyb20gJy4vaGFuZGxlcnMvVXNlcnMuaGFuZGxlcic7XG5pbXBvcnQgeyBVc2VySW5DaGFubmVsIH0gZnJvbSAnLi9kdG8vVXNlckluQ2hhbm5lbCc7XG5pbXBvcnQgeyBMaXN0SGFuZGxlciB9IGZyb20gJy4vaGFuZGxlcnMvTGlzdC5oYW5kbGVyJztcbmltcG9ydCB7IENoYW5uZWxJbmZvIH0gZnJvbSAnLi9kdG8vQ2hhbm5lbEluZm8nO1xuaW1wb3J0IHsgU3RhdHVzSGFuZGxlciB9IGZyb20gJy4vaGFuZGxlcnMvU3RhdHVzLmhhbmRsZXInO1xuaW1wb3J0IHsgTmlja0NoYW5nZSB9IGZyb20gJy4vZHRvL05pY2tDaGFuZ2UnO1xuaW1wb3J0IHsgSVJDTWVzc2FnZSwgT3JpZ2luRGF0YSB9IGZyb20gJy4vdXRpbHMvSVJDTWVzc2FnZS51dGlsJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyIH0gZnJvbSAnLi9oYW5kbGVycy9Nb2RlLmhhbmRsZXInO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vZHRvL1VzZXInO1xuaW1wb3J0IHsgQXdheUhhbmRsZXIgfSBmcm9tICcuL2hhbmRsZXJzL0F3YXkuaGFuZGxlcic7XG5pbXBvcnQgeyBJZ25vcmVIYW5kbGVyIH0gZnJvbSAnLi9oYW5kbGVycy9JZ25vcmUuSGFuZGxlcic7XG5pbXBvcnQgeyBNb3RkSGFuZGxlciB9IGZyb20gJy4vaGFuZGxlcnMvTW90ZC5oYW5kbGVyJztcbmltcG9ydCB7IENoYW5uZWxTdGF0dXNIYW5kbGVyIH0gZnJvbSAnLi9oYW5kbGVycy9DaGFubmVsU3RhdHVzLmhhbmRsZXInO1xuaW1wb3J0IHsgUGFydCB9IGZyb20gJy4vZHRvL1BhcnQnO1xuaW1wb3J0IHsgUXVpdEhhbmRsZXIgfSBmcm9tICcuL2hhbmRsZXJzL1F1aXQuaGFuZGxlcic7XG5pbXBvcnQgeyBRdWl0IH0gZnJvbSAnLi9kdG8vUXVpdCc7XG5pbXBvcnQgeyBKb2luSGFuZGxlciB9IGZyb20gJy4vaGFuZGxlcnMvSm9pbi5oYW5kbGVyJztcbmltcG9ydCB7IFNlcnZlckhhbmRsZXIgfSBmcm9tICcuL2hhbmRsZXJzL1NlcnZlci5oYW5kbGVyJztcbmltcG9ydCB7IE1lc3NhZ2VIYW5kbGVyIH0gZnJvbSAnLi9oYW5kbGVycy9NZXNzYWdlLmhhbmRsZXInO1xuaW1wb3J0IHsgSW5kaXZpZHVhbE1lc3NhZ2UsIEluZGl2aWR1YWxNZXNzYWdlVHlwZXMgfSBmcm9tICcuL2R0by9JbmRpdmlkdWFsTWVzc2FnZSc7XG5pbXBvcnQgeyBUaW1lIH0gZnJvbSAnLi91dGlscy9UaW1lLnV0aWwnO1xuaW1wb3J0IHsgTW9kZXJhdGVkSGFuZGxlciB9IGZyb20gJy4vaGFuZGxlcnMvTW9kZXJhdGVkLmhhbmRsZXInO1xuXG5leHBvcnQgY2xhc3MgSVJDUGFyc2VyVjIge1xuXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZyk6IElSQ01lc3NhZ2VbXSB7XG4gICAgICBjb25zdCBvdXQgPSBbXTtcbiAgICAgIG1lc3NhZ2Uuc3BsaXQoJ1xcclxcbicpLmZvckVhY2gobXNnTGluZSA9PiB7XG4gICAgICAgICAgY29uc3QgciA9IC86KFteOl0rKTo/KC4qKS8uZXhlYyhtc2dMaW5lKTtcbiAgICAgICAgICBjb25zdCBUQUcgPSByWzFdO1xuICAgICAgICAgIGNvbnN0IE1TRyA9IHJbMl07XG4gICAgICAgICAgY29uc3QgcGFydGlhbHMgPSBUQUcuc3BsaXQoJyAnKTtcbiAgICAgICAgICBjb25zdCBpbSA9IG5ldyBJUkNNZXNzYWdlKCk7XG4gICAgICAgICAgaW0uYm9keSA9IE1TRztcbiAgICAgICAgICBpbS50YWcgPSBUQUc7XG4gICAgICAgICAgaW0ucGFydGlhbHMgPSBwYXJ0aWFscztcbiAgICAgICAgICBpbS5jb2RlID0gcGFydGlhbHNbMV07XG4gICAgICAgICAgY29uc3QgdGFyZ2V0ID0gLyhbXiFdKiEpPyhbXkBdK0ApPyguKikvLmV4ZWMocGFydGlhbHNbMF0pO1xuICAgICAgICAgIGNvbnN0IG9kID0gbmV3IE9yaWdpbkRhdGEoKTtcbiAgICAgICAgICBpZiAoIXRhcmdldFsyXSkge1xuICAgICAgICAgICAgICBvZC5zZXJ2ZXIgPSB0YXJnZXRbMV07XG4gICAgICAgICAgICAgIGltLnNpbXBseU9yaWdpbiA9IG9kLnNlcnZlcjtcbiAgICAgICAgICB9IGVsc2UgaWYgKCF0YXJnZXRbM10pIHtcbiAgICAgICAgICAgICAgb2Quc2VydmVyID0gdGFyZ2V0WzJdO1xuICAgICAgICAgICAgICBvZC5pZGVudGl0aXR5ID0gdGFyZ2V0WzFdLnNsaWNlKDAsIHRhcmdldFsxXS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgaW0uc2ltcGx5T3JpZ2luID0gb2QuaWRlbnRpdGl0eTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvZC5zZXJ2ZXIgPSB0YXJnZXRbM107XG4gICAgICAgICAgICAgIG9kLmlkZW50aXRpdHkgPSB0YXJnZXRbMl0uc2xpY2UoMCwgdGFyZ2V0WzFdLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICBvZC5uaWNrID0gdGFyZ2V0WzFdLnNsaWNlKDAsIHRhcmdldFsxXS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgaW0uc2ltcGx5T3JpZ2luID0gb2QubmljaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaW0ub3JpZ2luID0gb2Q7XG4gICAgICAgICAgaW0udGFyZ2V0ID0gcGFydGlhbHNbMl07XG4gICAgICAgICAgaW0ubWVzc2FnZSA9IE1TRztcbiAgICAgICAgICBvdXQucHVzaChpbSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNZXNzYWdlKHBhcnNlZE1lc3NhZ2U6IElSQ01lc3NhZ2UsIHJhd01lc3NhZ2U6IHN0cmluZywgYWN0dWFsTmljazogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBpZiAocGFyc2VkTWVzc2FnZS5jb2RlID09PSAnMzE5JykgeyAvLyBsaXN0YSBkZSBjYW5hbGVzXG4gICAgICBjb25zdCBjaG5sTGlzdCA9IFtdO1xuICAgICAgcGFyc2VkTWVzc2FnZS5tZXNzYWdlLnNwbGl0KCcgJykuZm9yRWFjaChwbUNobmwgPT4ge1xuICAgICAgICBjb25zdCBjaG5sID0gbmV3IENoYW5uZWwocG1DaG5sKTtcbiAgICAgICAgY2hubExpc3QucHVzaChjaG5sKTtcbiAgICAgIH0pO1xuICAgICAgV2hvSXNIYW5kbGVyLmFkZFdob2lzUGFydGlhbChwYXJzZWRNZXNzYWdlLnBhcnRpYWxzWzNdLCAnY2hhbm5lbExpc3QnLCBjaG5sTGlzdCk7XG4gICAgICBDaGFubmVsTGlzdEhhbmRsZXIuc2V0Q2hhbm5lbExpc3QocGFyc2VkTWVzc2FnZS5wYXJ0aWFsc1szXSwgY2hubExpc3QpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICc3MTgnKSB7XG4gICAgICAvLyA6YXZhbG9uLmhpcmEuaW8gNzE4IFR1bGthbGV4IFR1bGtheiB+SGFya2l0b0BuZXQtajdqLmN1ci4zMi40NS5JUCA6aXMgbWVzc2FnaW5nIHlvdSwgYW5kIHlvdSBoYXZlIHVzZXIgbW9kZSArZyBzZXQuXG4gICAgICAvLyBVc2UgL0FDQ0VQVCArVHVsa2F6IHRvIGFsbG93LlxuICAgICAgR21vZGVIYW5kbGVyLnByaXZhdGVSZXF1ZXN0KHBhcnNlZE1lc3NhZ2UucGFydGlhbHNbM10pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICczNzgnKSB7XG4gICAgICAvLyBjb25uZWN0aW5nIGZyb21cbiAgICAgIC8vIDphdmFsb24uaGlyYS5pbyAzNzggVHVsa2FsZXggVHVsa2FsZXggOmlzIGNvbm5lY3RpbmcgZnJvbSB+VHVsa2FsYW5kaUAxNjcuOTkuMTcyLjc4IDE2Ny45OS4xNzIuNzhcbiAgICAgIFdob0lzSGFuZGxlci5hZGRXaG9pc1BhcnRpYWwocGFyc2VkTWVzc2FnZS5wYXJ0aWFsc1szXSwgJ2Nvbm5lY3RlZEZyb20nLCBwYXJzZWRNZXNzYWdlLmJvZHkucmVwbGFjZSgnaXMgY29ubmVjdGluZyBmcm9tICcsICcnKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICczMTInKSB7XG4gICAgICAvLyBzZXJ2ZXIgZGVzZGUgZG9uZGUgZXN0w6EgY29uZWN0YWRvXG4gICAgICAvLyA6YXZhbG9uLmhpcmEuaW8gMzEyIFR1bGthbGV4IFR1bGthbGV4IGF2YWxvbi5oaXJhLmlvIDpBdmFsb24gLSBGcmFua2Z1cnQsIEdlcm1hbnlcbiAgICAgIFdob0lzSGFuZGxlci5hZGRXaG9pc1BhcnRpYWwocGFyc2VkTWVzc2FnZS5wYXJ0aWFsc1szXSwgJ3NlcnZlcicsIHBhcnNlZE1lc3NhZ2UuYm9keSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICczMTMnKSB7XG4gICAgICAvLyA6YXZhbG9uLmhpcmEuaW8gMzEzIFR1bGthbGV4IFR1bGthbGV4IDppcyBhIEdsb2JhbE9wIG9uIEhpcmFcbiAgICAgIFdob0lzSGFuZGxlci5hZGRXaG9pc1BhcnRpYWwocGFyc2VkTWVzc2FnZS5wYXJ0aWFsc1szXSwgJ2lzR09QJywgdHJ1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICczNzknKSB7XG4gICAgICAvLyA6YXZhbG9uLmhpcmEuaW8gMzc5IFR1bGthbGV4IFR1bGthbGV4IDppcyB1c2luZyBtb2RlcyArSWlvd1xuICAgICAgY29uc3QgbW9kZXMgPSBwYXJzZWRNZXNzYWdlLmJvZHkuc3BsaXQoJyAnKTtcbiAgICAgIFdob0lzSGFuZGxlci5hZGRXaG9pc1BhcnRpYWwocGFyc2VkTWVzc2FnZS5wYXJ0aWFsc1szXSwgJ21vZGVzJywgbW9kZXNbbW9kZXMubGVuZ3RoIC0gMV0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGFyc2VkTWVzc2FnZS5jb2RlID09PSAnMzMwJykge1xuICAgICAgLy8gOmF2YWxvbi5oaXJhLmlvIDMzMCBUdWxrYWxleCBUdWxrYWxleCBhbGV4YW5kZXIxNzEyIDppcyBsb2dnZWQgaW4gYXNcbiAgICAgIFdob0lzSGFuZGxlci5hZGRXaG9pc1BhcnRpYWwocGFyc2VkTWVzc2FnZS5wYXJ0aWFsc1szXSwgJ3VzZXJBY2NvdW50JywgcGFyc2VkTWVzc2FnZS5wYXJ0aWFsc1s0XSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICc2NzEnKSB7XG4gICAgICAvLyA6YXZhbG9uLmhpcmEuaW8gNjcxIFR1bGthbGV4IFR1bGthbGV4IDppcyB1c2luZyBhIHNlY3VyZSBjb25uZWN0aW9uXG4gICAgICBXaG9Jc0hhbmRsZXIuYWRkV2hvaXNQYXJ0aWFsKHBhcnNlZE1lc3NhZ2UucGFydGlhbHNbM10sICdpc1NlY3VyZWQnLCB0cnVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHBhcnNlZE1lc3NhZ2UuY29kZSA9PT0gJzMxNycpIHtcbiAgICAgIC8vIDphdmFsb24uaGlyYS5pbyAzMTcgVHVsa2FsZXggVHVsa2FsZXggNjMxOCAxNjAyMjY2MjMxIDpzZWNvbmRzIGlkbGUsIHNpZ25vbiB0aW1lXG4gICAgICBXaG9Jc0hhbmRsZXIuYWRkV2hvaXNQYXJ0aWFsKHBhcnNlZE1lc3NhZ2UucGFydGlhbHNbM10sICdpZGxlJywgcGFyc2VkTWVzc2FnZS5wYXJ0aWFsc1s0XSk7XG4gICAgICBXaG9Jc0hhbmRsZXIuYWRkV2hvaXNQYXJ0aWFsKHBhcnNlZE1lc3NhZ2UucGFydGlhbHNbM10sICdsYXN0TG9naW4nLCBwYXJzZWRNZXNzYWdlLnBhcnRpYWxzWzVdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkTWVzc2FnZS5jb2RlID09PSAnMzE4Jykge1xuICAgICAgV2hvSXNIYW5kbGVyLmZpbmFsV2hvaXNNZXNzYWdlKHBhcnNlZE1lc3NhZ2UucGFydGlhbHNbM10pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICczNTInKSB7IC8vIHVzZXIgaW5mbyAoV0hPIHJlc3BvbnNlKVxuICAgICAgY29uc3QgZGF0YSA9IFdob0hhbmRsZXIuV0hPVXNlclBhcnNlcihyYXdNZXNzYWdlKTtcbiAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgIGNvbnN0IHdob0RhdGEgPSBuZXcgV2hvKCk7XG4gICAgICAgIHdob0RhdGEuc2VydmVyRnJvbSA9IGRhdGFbN107XG4gICAgICAgIHdob0RhdGEubmljayA9IGRhdGFbOF07XG4gICAgICAgIHdob0RhdGEuaXNBd2F5ID0gZGF0YVs5XSA9PT0gJ0cnO1xuICAgICAgICB3aG9EYXRhLmlzTmV0T3AgPSBkYXRhWzEwXSA9PT0gJyonO1xuICAgICAgICB3aG9EYXRhLnJhd01zZyA9IHJhd01lc3NhZ2U7XG4gICAgICAgIGNvbnN0IG1vZCA9IGRhdGFbMTFdO1xuICAgICAgICBpZiAobW9kID09PSAnficpIHtcbiAgICAgICAgICB3aG9EYXRhLm1vZGUgPSBVTW9kZXMuRk9VTkRFUjtcbiAgICAgICAgfSBlbHNlIGlmIChtb2QgPT09ICcmJykge1xuICAgICAgICAgIHdob0RhdGEubW9kZSA9IFVNb2Rlcy5BRE1JTjtcbiAgICAgICAgfSBlbHNlIGlmIChtb2QgPT09ICdAJykge1xuICAgICAgICAgIHdob0RhdGEubW9kZSA9IFVNb2Rlcy5PUEVSO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZCA9PT0gJyUnKSB7XG4gICAgICAgICAgd2hvRGF0YS5tb2RlID0gVU1vZGVzLkhBTEZPUEVSO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZCA9PT0gJysnKSB7XG4gICAgICAgICAgd2hvRGF0YS5tb2RlID0gVU1vZGVzLlZPSUNFO1xuICAgICAgICB9XG4gICAgICAgIFdob0hhbmRsZXIuYWRkV2hvRGF0YShkYXRhWzhdLCB3aG9EYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0JBRCBXSE8gUkVTUE9OU0UgUEFSU0VEOiAnLCByYXdNZXNzYWdlLCBkYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkTWVzc2FnZS5jb2RlID09PSAnMzUzJykgeyAvLyBuYW1lc1xuICAgICAgY29uc3QgY2hhbm5lbCA9IFVzZXJzSGFuZGxlci5nZXRDaGFubmVsT2ZNZXNzYWdlKHJhd01lc3NhZ2UpO1xuICAgICAgY29uc3QgdXNlcnMgPSBwYXJzZWRNZXNzYWdlLm1lc3NhZ2UudHJpbSgpLnNwbGl0KCcgJyk7XG4gICAgICBjb25zdCB1c2Vyc0luQ2hhbm5lbDogVXNlckluQ2hhbm5lbFtdID0gW107XG4gICAgICB1c2Vycy5mb3JFYWNoKHVzZXIgPT4ge1xuICAgICAgICB1c2Vyc0luQ2hhbm5lbC5wdXNoKG5ldyBVc2VySW5DaGFubmVsKHVzZXIsIGNoYW5uZWwpKTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgY2hubE9iaiA9IG5ldyBDaGFubmVsKGNoYW5uZWwpO1xuICAgICAgVXNlcnNIYW5kbGVyLmFkZFVzZXJzVG9DaGFubmVsKGNobmxPYmoubmFtZSwgdXNlcnNJbkNoYW5uZWwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIDMyMSBpbmljaW8gbGlzdGEgZGUgY2FuYWxlcyAoYm9ycmFyKVxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICczMjEnKSB7XG4gICAgICBMaXN0SGFuZGxlci5uZXdDaGFubmVsTGlzdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIDMyMiBjYW5hbCBkZSBsaXN0YSBkZSBjYW5hbGVzXG4gICAgaWYgKHBhcnNlZE1lc3NhZ2UuY29kZSA9PT0gJzMyMicpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBwYXJzZWRNZXNzYWdlLmJvZHkuc3BsaXQoJ10nKTtcbiAgICAgIExpc3RIYW5kbGVyLmFkZENoYW5uZWxzKG5ldyBDaGFubmVsSW5mbyhwYXJzZWRNZXNzYWdlLnBhcnRpYWxzWzNdLnNsaWNlKDEpLCBib2R5WzFdLCBib2R5WzBdLnJlcGxhY2UoJ1snICwgJycpLCBwYXJzZUludChwYXJzZWRNZXNzYWdlLnBhcnRpYWxzWzRdKSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICc0MzMnKSB7IC8vIG5pY2sgYWxyZWFkeSBpbiB1c2VcbiAgICAgIC8vIFRPRE86IG9idGVuZXIgbmljayBhbnRlcmlvci5cbiAgICAgIFN0YXR1c0hhbmRsZXIub25OaWNrQWxyZWFkeUluVXNlKCcnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkTWVzc2FnZS5jb2RlID09PSAnNDc0Jykge1xuICAgICAgLy8gVE9ETzogb2J0ZW5lciBjYW5hbC5cbiAgICAgIFN0YXR1c0hhbmRsZXIub25CYW5uZWQoJycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICdOSUNLJykge1xuICAgICAgU3RhdHVzSGFuZGxlci5vbk5pY2tDaGFuZ2VkKFxuICAgICAgICBuZXcgTmlja0NoYW5nZShwYXJzZWRNZXNzYWdlLnNpbXBseU9yaWdpbiwgcGFyc2VkTWVzc2FnZS50YXJnZXQgPyBwYXJzZWRNZXNzYWdlLnRhcmdldCA6IHBhcnNlZE1lc3NhZ2UubWVzc2FnZSlcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZE1lc3NhZ2UuY29kZSA9PT0gJ01PREUnKSB7XG4gICAgICBjb25zdCBtb2RlID0gTW9kZUhhbmRsZXIubW9kZVBhcnNlcihyYXdNZXNzYWdlKTtcbiAgICAgIGlmKG1vZGVbM10pIHtcbiAgICAgICAgY29uc3Qgbm1vZGUgPSBuZXcgTmV3TW9kZSgpO1xuICAgICAgICBubW9kZS51c2VyVGFyZ2V0ID0gbmV3IFVzZXIobW9kZVszXSk7XG4gICAgICAgIG5tb2RlLmNoYW5uZWxUYXJnZXQgPSBwYXJzZWRNZXNzYWdlLnRhcmdldDtcbiAgICAgICAgbm1vZGUubW9kZUFkZGVkID0gbW9kZVsxXSA9PT0gJysnO1xuICAgICAgICBubW9kZS5tb2RlID0gbW9kZVsyXTtcbiAgICAgICAgTW9kZUhhbmRsZXIuY2hhbmdlTW9kZShubW9kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBubW9kZSA9IG5ldyBOZXdNb2RlKCk7XG4gICAgICAgIG5tb2RlLmNoYW5uZWxUYXJnZXQgPSBwYXJzZWRNZXNzYWdlLnRhcmdldDtcbiAgICAgICAgbm1vZGUudXNlclRhcmdldCA9IG5ldyBVc2VyKHBhcnNlZE1lc3NhZ2UudGFyZ2V0KTtcbiAgICAgICAgbm1vZGUubW9kZSA9IG1vZGVbMl07XG4gICAgICAgIE1vZGVIYW5kbGVyLmNoYW5nZU1vZGUobm1vZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICczMDEnKSB7IC8vIGF3YXkgbWVzc2FnZVxuICAgICAgY29uc3QgYXdheSA9IG5ldyBBd2F5KCk7XG4gICAgICBhd2F5LmF1dGhvciA9IHBhcnNlZE1lc3NhZ2UucGFydGlhbHNbM107XG4gICAgICBhd2F5Lm1lc3NhZ2UgPSBwYXJzZWRNZXNzYWdlLm1lc3NhZ2U7XG4gICAgICBBd2F5SGFuZGxlci5vbkF3YXkoYXdheSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZE1lc3NhZ2UuY29kZSA9PT0gJzcxNicpIHsgLy8gc2VydmVyIHNpZGUgaWdub3JlZFxuICAgICAgY29uc3QgaWdub3JlID0gbmV3IEF3YXkoKTtcbiAgICAgIGlnbm9yZS5hdXRob3IgPSBwYXJzZWRNZXNzYWdlLnBhcnRpYWxzWzNdO1xuICAgICAgaWdub3JlLm1lc3NhZ2UgPSBwYXJzZWRNZXNzYWdlLm1lc3NhZ2U7XG4gICAgICBJZ25vcmVIYW5kbGVyLm9uSWdub3JlKGlnbm9yZSk7XG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZE1lc3NhZ2UuY29kZSA9PT0gJzQ2NCcpIHtcbiAgICAgIE1vdGRIYW5kbGVyLnJlcXVpcmVQYXNzd29yZFJlc3BvbnNlLmVtaXQocGFyc2VkTWVzc2FnZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZE1lc3NhZ2UuY29kZSA9PT0gJzQwNCcpIHtcbiAgICAgIE1vZGVyYXRlZEhhbmRsZXIuY2hhbm5lbE1vZGVyYXRlZC5lbWl0KHBhcnNlZE1lc3NhZ2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICczNzUnKSB7XG4gICAgICBNb3RkSGFuZGxlci5tb3RkUmVzcG9uc2UuZW1pdChwYXJzZWRNZXNzYWdlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkTWVzc2FnZS5jb2RlID09PSAnUE9ORycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkTWVzc2FnZS5jb2RlID09PSAnTk9USUNFJykge1xuICAgICAgaWYgKHBhcnNlZE1lc3NhZ2Uuc2ltcGx5T3JpZ2luICYmIHBhcnNlZE1lc3NhZ2Uuc2ltcGx5T3JpZ2luICE9PSAnKnN0YXR1cycgJiYgcGFyc2VkTWVzc2FnZS50YXJnZXRbMF0gPT09ICcjJykge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gbmV3IEluZGl2aWR1YWxNZXNzYWdlKCk7XG4gICAgICAgIG1lc3NhZ2UubWVzc2FnZVR5cGUgPSBJbmRpdmlkdWFsTWVzc2FnZVR5cGVzLk5PVElGWTtcbiAgICAgICAgbWVzc2FnZS5hdXRob3IgPSBwYXJzZWRNZXNzYWdlLnNpbXBseU9yaWdpbjtcbiAgICAgICAgbWVzc2FnZS5tZXNzYWdlID0gcGFyc2VkTWVzc2FnZS5tZXNzYWdlO1xuICAgICAgICBtZXNzYWdlLm1lQWN0aW9uID0gZmFsc2U7XG4gICAgICAgIG1lc3NhZ2UuY2hhbm5lbCA9IHBhcnNlZE1lc3NhZ2UudGFyZ2V0O1xuICAgICAgICBtZXNzYWdlLnRpbWUgPSBUaW1lLmdldFRpbWUoKTtcbiAgICAgICAgbWVzc2FnZS5kYXRlID0gVGltZS5nZXREYXRlU3RyKCk7XG4gICAgICAgIE1lc3NhZ2VIYW5kbGVyLm9uTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU2VydmVySGFuZGxlci5vblNlcnZlck5vdGljZVJlc3BvbnNlKHBhcnNlZE1lc3NhZ2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZE1lc3NhZ2UuY29kZSA9PT0gJzMzMicpIHtcbiAgICAgIGNvbnN0IGNoYW5uZWxzID0gQ2hhbm5lbFN0YXR1c0hhbmRsZXIuZmluZENoYW5uZWxzKHJhd01lc3NhZ2UpO1xuICAgICAgQ2hhbm5lbFN0YXR1c0hhbmRsZXIuc2V0Q2hhbm5lbFRvcGljKGNoYW5uZWxzWzBdLCBwYXJzZWRNZXNzYWdlLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICdUT1BJQycpIHtcbiAgICAgIENoYW5uZWxTdGF0dXNIYW5kbGVyLnNldENoYW5uZWxUb3BpYyhwYXJzZWRNZXNzYWdlLnRhcmdldCwgcGFyc2VkTWVzc2FnZS5tZXNzYWdlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkTWVzc2FnZS5jb2RlID09PSAnMzE1Jykge1xuICAgICAgLy8gVE9ETzogY2hlY2sgdGhpcy4uLiBFbmQgb2Ygd2hvXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZE1lc3NhZ2UuY29kZSA9PT0gJ0tJQ0snKSB7XG4gICAgICBsZXQgY2hhbm5lbCA9IHBhcnNlZE1lc3NhZ2UudGFyZ2V0O1xuICAgICAgY29uc3Qga2lja0RhdGEgPSBLaWNrSGFuZGxlci5raWNrUGFyc2UocmF3TWVzc2FnZSk7XG4gICAgICBjb25zdCBraWNrSW5mbyA9IG5ldyBLaWNrSW5mbygpO1xuICAgICAga2lja0luZm8uY2hhbm5lbCA9IG5ldyBDaGFubmVsKGNoYW5uZWwpO1xuICAgICAga2lja0luZm8ub3BlcmF0b3IgPSBwYXJzZWRNZXNzYWdlLm1lc3NhZ2U7XG4gICAgICBraWNrSW5mby51c2VyVGFyZ2V0ID0gbmV3IFVzZXIoa2lja0RhdGFbMl0pO1xuICAgICAgS2lja0hhbmRsZXIub25LaWNrKGtpY2tJbmZvKTtcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkTWVzc2FnZS5jb2RlID09PSAnUEFSVCcpIHtcbiAgICAgIC8vIDpIYXJrbyF+SGFya29sYW5kaWFAaGFya29uaWRhei5pcmMudGFuZGlsc2VydmVyLmNvbSBQQVJUICNTbmlmZXJMNGJzIDpcIkxlYXZpbmdcIlxuICAgICAgbGV0IGNoYW5uZWwgPSBwYXJzZWRNZXNzYWdlLnRhcmdldDtcbiAgICAgIGlmICghY2hhbm5lbCkge1xuICAgICAgICBjaGFubmVsID0gcGFyc2VkTWVzc2FnZS5tZXNzYWdlO1xuICAgICAgfVxuICAgICAgY29uc3QgcGFydCA9IG5ldyBQYXJ0KCk7XG4gICAgICBwYXJ0LmNoYW5uZWwgPSBuZXcgQ2hhbm5lbChjaGFubmVsKTtcbiAgICAgIHBhcnQubWVzc2FnZSA9IHBhcnNlZE1lc3NhZ2UubWVzc2FnZTtcbiAgICAgIHBhcnQudXNlciA9IG5ldyBVc2VyKHBhcnNlZE1lc3NhZ2Uuc2ltcGx5T3JpZ2luKTtcbiAgICAgIFBhcnRIYW5kbGVyLm9uUGFydChwYXJ0KTtcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkTWVzc2FnZS5jb2RlID09PSAnUVVJVCcpIHtcbiAgICAgIFF1aXRIYW5kbGVyLm9uUXVpdChuZXcgUXVpdChwYXJzZWRNZXNzYWdlLnNpbXBseU9yaWdpbikpO1xuICAgIH1cblxuICAgIGlmIChwYXJzZWRNZXNzYWdlLmNvZGUgPT09ICdKT0lOJykge1xuICAgICAgY29uc3Qgam9pbiA9IG5ldyBKb2luKCk7XG4gICAgICBjb25zdCBjaGFubmVsID0gcGFyc2VkTWVzc2FnZS5tZXNzYWdlID8gcGFyc2VkTWVzc2FnZS5tZXNzYWdlIDogcGFyc2VkTWVzc2FnZS50YXJnZXQ7XG4gICAgICBqb2luLmNoYW5uZWwgPSBuZXcgQ2hhbm5lbChjaGFubmVsKTtcbiAgICAgIGpvaW4udXNlciA9IG5ldyBVc2VyKHBhcnNlZE1lc3NhZ2Uuc2ltcGx5T3JpZ2luKTtcbiAgICAgIGpvaW4ub3JpZ2luID0gcGFyc2VkTWVzc2FnZS5vcmlnaW47XG4gICAgICBKb2luSGFuZGxlci5vbkpvaW4oam9pbik7XG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZE1lc3NhZ2UuY29kZSA9PT0gJ1BSSVZNU0cnKSB7XG4gICAgICBjb25zdCBtZU1zZyA9IE1lc3NhZ2VIYW5kbGVyLmdldE1lQWN0aW9uKHBhcnNlZE1lc3NhZ2UpO1xuICAgICAgY29uc3QgbWVzc2FnZSA9IG5ldyBJbmRpdmlkdWFsTWVzc2FnZSgpO1xuICAgICAgbWVzc2FnZS5hdXRob3IgPSBwYXJzZWRNZXNzYWdlLnNpbXBseU9yaWdpbjtcbiAgICAgIGlmIChtZU1zZykge1xuICAgICAgICBtZXNzYWdlLm1lc3NhZ2UgPSBtZU1zZ1sxXTtcbiAgICAgICAgbWVzc2FnZS5tZUFjdGlvbiA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXNzYWdlLm1lc3NhZ2UgPSBwYXJzZWRNZXNzYWdlLm1lc3NhZ2U7XG4gICAgICAgIG1lc3NhZ2UubWVBY3Rpb24gPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG1lc3NhZ2UudGltZSA9IFRpbWUuZ2V0VGltZSgpO1xuICAgICAgbWVzc2FnZS5kYXRlID0gVGltZS5nZXREYXRlU3RyKCk7XG4gICAgICBpZiAocGFyc2VkTWVzc2FnZS50YXJnZXQgPT09IGFjdHVhbE5pY2spIHsgLy8gcHJpdmFkb1xuICAgICAgICBtZXNzYWdlLm1lc3NhZ2VUeXBlID0gSW5kaXZpZHVhbE1lc3NhZ2VUeXBlcy5QUklWTVNHO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVzc2FnZS5tZXNzYWdlVHlwZSA9IEluZGl2aWR1YWxNZXNzYWdlVHlwZXMuQ0hBTk1TRztcbiAgICAgICAgbWVzc2FnZS5jaGFubmVsID0gcGFyc2VkTWVzc2FnZS50YXJnZXQ7XG4gICAgICB9XG4gICAgICBtZXNzYWdlLm1lbnRpb24gPSBtZXNzYWdlLm1lc3NhZ2UgPyBtZXNzYWdlLm1lc3NhZ2UuaW5kZXhPZihhY3R1YWxOaWNrKSA+PSAwIDogZmFsc2U7XG4gICAgICBNZXNzYWdlSGFuZGxlci5vbk1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgU2VydmVySGFuZGxlci5vblNlcnZlclJlc3BvbnNlKHBhcnNlZE1lc3NhZ2UpO1xuICAgIHJldHVybjtcbiAgfVxuXG59XG4iXX0=