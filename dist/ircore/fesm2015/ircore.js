import { EventEmitter, NgModule, ɵɵdefineInjectable, Injectable, ɵɵinject } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Subject } from 'rxjs';

class Join {
}

// @dynamic
class PartHandler {
    static onPart(part) {
        this.partResponse.emit(part);
    }
    static setHandler(hdlr) {
        this.partResponse.subscribe(data => {
            hdlr.onPart(data);
        });
    }
}
PartHandler.partResponse = new EventEmitter();

class KickInfo {
}

// @dynamic
class KickHandler {
    static kickParse(rawMessage) {
        return /#([^\s]+)\s([^:]+)\s/.exec(rawMessage);
    }
    static onKick(kick) {
        this.kicked.emit(kick);
    }
    static setHandler(hdlr) {
        this.kicked.subscribe(data => {
            hdlr.onKick(data);
        });
    }
}
KickHandler.kicked = new EventEmitter();

class Away {
}

class NewMode {
}

/*
  Clase para manejar los request en +g
*/
// @dynamic
class GmodeHandler {
    static privateRequest(user) {
        GmodeHandler.onPrivateRequest.emit(user);
    }
}
GmodeHandler.onPrivateRequest = new EventEmitter();

var UModes;
(function (UModes) {
    UModes[UModes["FOUNDER"] = 0] = "FOUNDER";
    UModes[UModes["ADMIN"] = 1] = "ADMIN";
    UModes[UModes["OPER"] = 2] = "OPER";
    UModes[UModes["HALFOPER"] = 3] = "HALFOPER";
    UModes[UModes["VOICE"] = 4] = "VOICE";
    UModes[UModes["BANNED"] = 5] = "BANNED";
})(UModes || (UModes = {}));

class Channel {
    constructor(channel) {
        if (channel[0] === '~') {
            this.mode = UModes.FOUNDER;
            channel = channel.substr(1);
        }
        else if (channel[0] === '&') {
            this.mode = UModes.ADMIN;
            channel = channel.substr(1);
        }
        else if (channel[0] === '@') {
            this.mode = UModes.OPER;
            channel = channel.substr(1);
        }
        else if (channel[0] === '%') {
            this.mode = UModes.HALFOPER;
            channel = channel.substr(1);
        }
        else if (channel[0] === '+') {
            this.mode = UModes.VOICE;
            channel = channel.substr(1);
        }
        if (channel[0] === '#') {
            this.channel = channel;
            this.name = channel.substr(1);
        }
        else {
            this.channel = '#' + channel;
            this.name = channel;
        }
    }
}

/*
  Clase para manejar los canales que tiene un usuario.
  Lista de canales que trae el whois de un usuario o el mensaje inicial
*/
// @dynamic
class ChannelListHandler {
    static setChannelList(user, channelList) {
        // FIXME: update the same instance.
        this.uChannelList[user] = channelList;
        this.channelListUpdated.emit(new UpdateChannelList(user, channelList));
    }
    static getChannels() {
        return this.uChannelList;
    }
    static setHandler(hdlr) {
        this.channelListUpdated.subscribe(data => {
            hdlr.onChannelList(data.user, data.channels);
        });
    }
}
ChannelListHandler.uChannelList = {};
ChannelListHandler.channelListUpdated = new EventEmitter();
class UserChannelList {
}
class UpdateChannelList {
    constructor(user, channels) {
        this.channels = [];
        this.user = user;
        this.channels = channels;
    }
}

class WhoIsData {
    constructor() {
        this.isGOP = false;
        this.isSecured = false;
    }
    getLastLogin() {
        const date = new Date(parseInt(this.lastLogin, 10) * 1000);
        let hs = date.getHours();
        if (hs < 10) {
            hs = '0' + hs;
        }
        let mins = date.getMinutes();
        if (mins < 10) {
            mins = '0' + mins;
        }
        let day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        let month = (date.getMonth() + 1);
        if (month < 10) {
            month = '0' + month;
        }
        return day + '/' + month + '/' + date.getFullYear() + ' ' + hs + ':' + mins;
    }
    getIdle() {
        let out = '';
        let idle = this.idle;
        if (idle >= 60) {
            let secs = (this.idle % 60);
            if (secs < 10) {
                secs = '0' + secs;
            }
            out = secs + 's';
            idle = Math.floor(idle / 60);
        }
        else {
            return this.idle + 's';
        }
        if (idle >= 60) {
            let mins = (idle % 60);
            if (mins < 10) {
                mins = '0' + mins;
            }
            out = mins + 'm ' + out;
            idle = Math.floor(idle / 60);
        }
        else {
            return idle + 'm ' + out;
        }
        if (idle >= 24) {
            let hs = (idle % 24);
            if (hs < 10) {
                hs = '0' + hs;
            }
            out = hs + 'h ' + out;
            idle = Math.floor(idle / 24);
        }
        else {
            return idle + 'h ' + out;
        }
        return idle + 'd ' + out;
    }
}

/*
  Clase para manejar el Whois de un usuario.
*/
// @dynamic
class WhoIsHandler {
    static addWhoisPartial(user, field, data) {
        if (!this.whoisdatas[user]) {
            this.whoisdatas[user] = new WhoIsData();
            this.whoisdatas[user].username = user;
        }
        this.whoisdatas[user][field] = data;
    }
    static finalWhoisMessage(user) {
        this.onWhoisResponse.emit(this.whoisdatas[user]);
    }
    static getWhoisResponses() {
        return this.whoisdatas;
    }
}
WhoIsHandler.whoisdatas = {};
WhoIsHandler.onWhoisResponse = new EventEmitter();
class WhoDatas {
}

/*
  Clase para manejar el estado de los usuarios (si está away, es netop, de donde se conecta, etc.)
*/
// @dynamic
class WhoHandler {
    static addWhoData(user, data) {
        if (!this.usersWho[user]) {
            this.usersWho[user] = data;
        }
        else {
            this.usersWho[user].isAway = data.isAway;
            this.usersWho[user].isNetOp = data.isNetOp;
            this.usersWho[user].mode = data.mode;
            this.usersWho[user].nick = data.nick;
            this.usersWho[user].rawMsg = data.rawMsg;
            this.usersWho[user].serverFrom = data.serverFrom;
        }
        this.onWhoResponse.emit(this.usersWho[user]);
    }
    static getWhoData(user) {
        return this.usersWho[user];
    }
    static WHOUserParser(message) {
        return /:([^\s]+)\s([0-9]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s(H|G)(\*?)(\~|\&|\@|\%|\+)?/.exec(message);
    }
}
WhoHandler.usersWho = {};
WhoHandler.onWhoResponse = new EventEmitter();
class UsersWhos {
}

class Who {
}

/*
  Clase para manejar los usuarios que hay en un canal (mensaje inicial de usuarios por names)
*/
// @dynamic
class UsersHandler {
    static addUsersToChannel(channel, users) {
        this.usersInChannel[channel] = users;
        this.usersInChannelResponse.emit(new ChannelAndUserList(channel, users));
    }
    static getChannelOfMessage(message) {
        const messages = /(=|@|\*)([^:]+):/.exec(message);
        if (messages && messages.length > 2) {
            return messages[2].trim();
        }
        else {
            console.error('GCOM, ', message);
        }
    }
    static getUsersInChannel(channel) {
        return this.usersInChannel[channel];
    }
    static setHandler(hdlr) {
        this.usersInChannelResponse.subscribe(data => {
            hdlr.onUserList(data.channel, data.userList);
        });
    }
}
UsersHandler.usersInChannel = {};
UsersHandler.usersInChannelResponse = new EventEmitter();
class ChannelAndUserList {
    constructor(channel, userList) {
        this.channel = channel;
        this.userList = userList;
    }
}
class ChannelUserList {
}

class User {
    constructor(nick) {
        if (nick[0] === '~') {
            this.mode = UModes.FOUNDER;
            nick = nick.substr(1);
        }
        else if (nick[0] === '&') {
            this.mode = UModes.ADMIN;
            nick = nick.substr(1);
        }
        else if (nick[0] === '@') {
            this.mode = UModes.OPER;
            nick = nick.substr(1);
        }
        else if (nick[0] === '%') {
            this.mode = UModes.HALFOPER;
            nick = nick.substr(1);
        }
        else if (nick[0] === '+') {
            this.mode = UModes.VOICE;
            nick = nick.substr(1);
        }
        this.nick = nick;
    }
}

class UserInChannel extends User {
    constructor(nick, channel) {
        super(nick);
        this.channel = new Channel(channel);
    }
}

/*
  Clase para manejar el comando /list
*/
// @dynamic
class ListHandler {
    static addChannels(channel) {
        this.channels.push(channel);
    }
    static newChannelList() {
        this.channels = [];
        this.channelListCreated.emit(this.channels);
    }
    static getChannelList() {
        return this.channels;
    }
}
ListHandler.channels = [];
ListHandler.channelListCreated = new EventEmitter();

class ChannelInfo {
    constructor(name, description, flags, users) {
        this.name = name;
        this.description = description;
        this.flags = flags;
        this.users = users;
    }
}

/*
  Clase para manejar los cambios de estado del usuario, como cuando es banneado, o kickeado de un canal.
*/
// @dynamic
class StatusHandler {
    static onNickAlreadyInUse(nickInUse) {
        this.nickAlreadyInUse.emit(nickInUse);
    }
    static onBanned(channel) {
        this.banned.emit(channel);
    }
    static onNickChanged(nick) {
        this.nickChanged.emit(nick);
    }
    static setHandlerNickAlreadyInUse(hdlr) {
        this.nickAlreadyInUse.subscribe(data => {
            hdlr.onNickAlreadyInUse(data);
        });
    }
    static setHandlerBanned(hdlr) {
        this.banned.subscribe(data => {
            hdlr.onBanned(data);
        });
    }
    static setHandlerNickChanged(hdlr) {
        this.nickChanged.subscribe(data => {
            hdlr.onNickChanged(data);
        });
    }
}
StatusHandler.nickAlreadyInUse = new EventEmitter();
StatusHandler.banned = new EventEmitter();
StatusHandler.nickChanged = new EventEmitter();

class NickChange {
    constructor(old, nnick) {
        this.oldNick = old;
        this.newNick = nnick;
    }
}

class OriginData {
}
class IRCMessage {
}

// @dynamic
class ValidRegex {
    static channelRegex() {
        return '#([a-zA-Z0-9_#]+)';
    }
    static userRegex() {
        return '([a-zA-Z_][a-zA-Z0-9_]+)';
    }
    static actionRegex() {
        return /\x01ACTION ([^\x01]+)\x01/;
    }
    static modeRegex() {
        return '(\\+|\-)?([a-zA-Z]+)';
    }
    static getRegex(regex) {
        return new RegExp(regex);
    }
    static pingRegex(nick) {
        return '^(.*(\\s|,|:))?(' + nick.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')((\\s|,|:).*)?$';
    }
}

/**
 * Clase para gestionar los cambios de modos en un canal (sobre un usuario)
 */
// @dynamic
class ModeHandler {
    static modeParser(rawMessage) {
        let modeRaw = rawMessage.split(' MODE ')[1];
        if (modeRaw.indexOf('#') == -1) {
            const modeCut = modeRaw.split(':');
            const regex = ValidRegex.getRegex(ValidRegex.modeRegex()).exec(modeCut[1]);
            return [
                undefined,
                regex[1],
                regex[2].trim(),
                modeCut[0].trim() // usuario
            ];
        }
        else {
            const regex = ValidRegex.channelRegex() +
                '\\s' + ValidRegex.modeRegex() + '\\s\\:?' + // modos
                ValidRegex.userRegex();
            const regOut = ValidRegex.getRegex(regex).exec(modeRaw);
            if (regOut) {
                return [
                    undefined,
                    regOut[2],
                    regOut[3].trim(),
                    regOut[4]
                ];
            }
            else {
                // modo de canal?
                const modos = modeRaw.split(':');
                return [
                    undefined,
                    undefined,
                    modos[1],
                    undefined
                ];
            }
        }
    }
    static changeMode(mode) {
        this.modeChange.emit(mode);
    }
}
ModeHandler.modeChange = new EventEmitter();

/**
 * Handler de mensajes de away
 */
// @dynamic
class AwayHandler {
    static onAway(away) {
        this.awayResponse.emit(away);
    }
}
AwayHandler.awayResponse = new EventEmitter();

/**
 * clase para manejar los eventos de ignorar.
 */
// @dynamic
class IgnoreHandler {
    static onIgnore(ignore) {
        this.ignoreResponse.emit(ignore);
    }
}
IgnoreHandler.ignoreResponse = new EventEmitter();

/**
 * clase para manejar los mensajes del día y el hook para enviar el auth al bouncer
 */
// @dynamic
class MotdHandler {
}
MotdHandler.motdResponse = new EventEmitter();
MotdHandler.requirePasswordResponse = new EventEmitter();

/**
 * clase para manejar los cambios de estado de un canal, como el topic y los modos.
 */
// @dynamic
class ChannelStatusHandler {
    static setChannelTopic(channel, topic) {
        this.channelsTopics[channel] = topic;
        this.channelTopicResponse.emit(new ChannelTopicUpdate(channel, topic));
    }
    static getChannelTopic(channel) {
        return this.channelsTopics[channel];
    }
    static findChannels(message) {
        let channels = /#([^\s]+)/g.exec(message);
        channels = channels.slice(1);
        return channels;
    }
    static setHandler(hdlr) {
        this.channelTopicResponse.subscribe(topic => {
            hdlr.onTopicUpdate(topic.channel, topic.newTopic);
        });
    }
}
ChannelStatusHandler.channelsTopics = {};
ChannelStatusHandler.channelTopicResponse = new EventEmitter();
class ChannelsTopic {
}
class ChannelTopicUpdate {
    constructor(channel, newTopic) {
        this.channel = channel;
        this.newTopic = newTopic;
    }
}

class Part {
}

// @dynamic
class QuitHandler {
    static onQuit(quit) {
        this.quitResponse.emit(quit);
    }
    static setHandler(hdlr) {
        this.quitResponse.subscribe(data => {
            hdlr.onQuit(data);
        });
    }
}
QuitHandler.quitResponse = new EventEmitter();

class Quit {
    constructor(user) {
        this.user = new User(user);
    }
}

// @dynamic
class JoinHandler {
    static onJoin(join) {
        this.joinResponse.emit(join);
    }
    static setHandler(hdlr) {
        this.joinResponse.subscribe((join) => {
            hdlr.onJoin(join);
        });
    }
}
JoinHandler.joinResponse = new EventEmitter();

// @dynamic
class ServerHandler {
    static onServerResponse(msg) {
        this.serverResponse.emit(msg);
    }
    static onServerNoticeResponse(msg) {
        this.serverNoticeResponse.emit(msg);
    }
}
ServerHandler.serverResponse = new EventEmitter();
ServerHandler.serverNoticeResponse = new EventEmitter();

/**
 * Clase para manejar la recepción de mensajes privados y de canal.
 */
// @dynamic
class MessageHandler {
    static onMessage(message) {
        this.messageResponse.emit(message);
    }
    static getMeAction(parsedMessage) {
        return ValidRegex.actionRegex().exec(parsedMessage.message);
    }
    static setHandler(hdlr) {
        this.messageResponse.subscribe(message => {
            hdlr.onMessageReceived(message);
        });
    }
}
MessageHandler.messageResponse = new EventEmitter();

class IndividualMessage {
}
var IndividualMessageTypes;
(function (IndividualMessageTypes) {
    IndividualMessageTypes[IndividualMessageTypes["PRIVMSG"] = 0] = "PRIVMSG";
    IndividualMessageTypes[IndividualMessageTypes["CHANMSG"] = 1] = "CHANMSG";
    IndividualMessageTypes[IndividualMessageTypes["NOTIFY"] = 2] = "NOTIFY"; // notificación contra un canal.
})(IndividualMessageTypes || (IndividualMessageTypes = {}));

class Time {
    static getTime() {
        const now = new Date();
        const hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
        const min = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
        const second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
        return hours + ':' + min + ':' + second;
    }
    static getDateStr() {
        const now = new Date();
        const month = (now.getMonth() + 1);
        const monthStr = month < 10 ? '0' + month : month;
        const day = now.getDate();
        const dayStr = day < 10 ? '0' + day : day;
        return dayStr + '/' + monthStr + '/' + now.getFullYear();
    }
}

// @dynamic
class ModeratedHandler {
}
ModeratedHandler.channelModerated = new EventEmitter();

class IRCParserV2 {
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

class IRCoreModule {
}
IRCoreModule.decorators = [
    { type: NgModule, args: [{
                declarations: [],
                imports: [],
                exports: []
            },] }
];

class WebSocketUtil {
    constructor() {
        this.onOpenSubject = new Subject();
        this.onCloseSubject = new Subject();
    }
    connect(url, uuid) {
        this.wss = webSocket({
            url,
            serializer: msg => msg,
            deserializer: msg => msg.data,
            openObserver: this.onOpenSubject,
            closeObserver: this.onCloseSubject
        });
        const obs = this.wss.asObservable();
        obs.subscribe(msg => {
            WebSocketUtil.messageReceived.emit(new MessageData(uuid, msg));
        }, err => {
            const status = new ConnectionStatusData();
            status.status = ConnectionStatus.ERROR;
            status.data = { uuid, err };
            console.error('WS errror?', status.data);
            WebSocketUtil.statusChanged.emit(status);
            WebSocketUtil.connected = false;
        });
        this.onCloseSubject.subscribe(() => {
            const status = new ConnectionStatusData();
            status.status = ConnectionStatus.DISCONNECTED;
            status.data = uuid;
            WebSocketUtil.statusChanged.emit(status);
            WebSocketUtil.connected = false;
        });
        this.onOpenSubject.subscribe(() => {
            const status = new ConnectionStatusData();
            status.status = ConnectionStatus.CONNECTED;
            status.data = uuid;
            WebSocketUtil.statusChanged.emit(status);
            WebSocketUtil.connected = true;
        });
        return obs;
    }
    send(msg) {
        this.wss.next(msg);
    }
    disconnect() {
        this.wss.complete();
    }
    static isConnected() {
        return WebSocketUtil.connected;
    }
}
WebSocketUtil.messageReceived = new EventEmitter();
WebSocketUtil.statusChanged = new EventEmitter();
WebSocketUtil.connected = false;
class ConnectionStatusData {
}
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["CONNECTED"] = 0] = "CONNECTED";
    ConnectionStatus[ConnectionStatus["DISCONNECTED"] = 1] = "DISCONNECTED";
    ConnectionStatus[ConnectionStatus["ERROR"] = 2] = "ERROR";
})(ConnectionStatus || (ConnectionStatus = {}));
class MessageData {
    constructor(uuid, message) {
        this.uuid = uuid;
        this.message = message;
    }
}

/**
 * Servicio para gestionar mi información
 */
class UserInfoService {
    constructor() {
        this.onChangeNick = new EventEmitter();
        StatusHandler.setHandlerNickChanged(this);
    }
    getNick() {
        return this.actualNick;
    }
    setNick(nick) {
        this.actualNick = nick;
        this.onChangeNick.emit(nick);
    }
    onNickChanged(nick) {
        if (nick.oldNick === this.actualNick) {
            this.actualNick = nick.newNick;
        }
    }
}
UserInfoService.ɵprov = ɵɵdefineInjectable({ factory: function UserInfoService_Factory() { return new UserInfoService(); }, token: UserInfoService, providedIn: "root" });
UserInfoService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
UserInfoService.ctorParameters = () => [];

class IRCoreService {
    constructor(userSrv) {
        this.userSrv = userSrv;
        WebSocketUtil.messageReceived.subscribe((message) => {
            if (message.message.indexOf('PING') === 0) {
                const pingResp = message.message.slice(5);
                this.sendRaw('PONG ' + pingResp);
                return;
            }
            if (message.message.indexOf('ERROR') === 0) {
                console.error('Received error from stream: ', message.message);
                return;
            }
            IRCParserV2.parseMessage(message.message).forEach(msg => {
                IRCParserV2.processMessage(msg, message.message, this.userSrv.getNick());
            });
        });
    }
    connect(url) {
        this.webSocket = new WebSocketUtil();
        this.webSocket.connect(url, 'WSocket');
    }
    handshake(username, apodo, gatwayHost) {
        this.sendRaw('ENCODING UTF-8');
        if (gatwayHost) {
            this.sendRaw('HOST ' + gatwayHost);
        }
        this.sendRaw('USER ' + username + ' * * :' + IRCoreService.clientName);
        this.setNick(apodo);
    }
    identify(password) {
        this.sendRaw('PRIVMSG NickServ identify ' + password);
    }
    serverPass(user, password) {
        this.sendRaw('PASS ' + user + ':' + password);
    }
    setNick(nick) {
        this.sendRaw('NICK ' + nick);
        this.userSrv.setNick(nick);
    }
    sendWhox(channel) {
        channel = channel[0] === '#' ? channel : '#' + channel;
        this.sendRaw('WHO ' + channel);
    }
    join(channel) {
        if (channel[0] != '#') {
            channel = '#' + channel;
        }
        this.sendRaw('JOIN ' + channel);
    }
    disconnect() {
        this.webSocket.disconnect();
    }
    sendRaw(rawMessage) {
        this.webSocket.send(rawMessage);
    }
    sendMessageOrCommand(command, target) {
        if (command[0] === '/') {
            let cmd = command.slice(1);
            const verb = cmd.split(' ')[0].toLowerCase();
            if (verb === 'query') {
                cmd = cmd.slice(5).trim();
                // TODO: query a cmd
            }
            if (verb === 'join') {
                // enviar cmd esto es un join
                this.sendRaw(cmd);
                return false;
            }
            if (verb === 'umode') {
                // enviar cmd esto es un join
                cmd = cmd.replace('umode', 'mode ' + this.userSrv.getNick());
            }
            if (verb === 'stop') {
                // enviar cmd esto es un join
                stopEff();
                return false;
            }
            if (verb === 'me') {
                cmd = cmd.slice(2).trim();
                this.sendRaw('PRIVMSG ' + target + ' :' + String.fromCharCode(1) + 'ACTION ' + cmd + String.fromCharCode(1));
                this._triggerMessage(cmd, target, true);
                return true;
            }
            if (verb === 'cs') {
                // chanserv?
                cmd = cmd.replace('cs', 'PRIVMSG ChanServ :');
            }
            if (verb === 'hc') {
                // chanserv?
                cmd = cmd.replace('hc', 'PRIVMSG HiraClient :');
            }
            if (verb === 'ns') {
                // nickserv?
                cmd = cmd.replace('ns', 'PRIVMSG NickServ :');
            }
            if (verb === 'msg') {
                cmd = cmd.replace('msg', 'PRIVMSG');
            }
            if (verb === 'leave') {
                cmd = cmd.replace('leave', 'PART');
            }
            if (verb === 'away') {
                if (cmd.length === 4) {
                    const now = new Date();
                    cmd += ' AFK desde ' + now.getDay() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear() + ' ' +
                        now.getHours() + ':' + now.getMinutes();
                }
            }
            if (verb === 'back') {
                cmd = cmd.replace('back', 'away');
            }
            this.sendRaw(cmd);
            return false;
        }
        else {
            if (target) {
                this.sendRaw('PRIVMSG ' + target + ' :' + command);
                this._triggerMessage(command, target, false);
            }
            else {
                this.sendRaw(command);
            }
            return true;
        }
    }
    _triggerMessage(command, target, isMe) {
        const iMessage = new IndividualMessage();
        iMessage.author = this.userSrv.getNick();
        iMessage.message = command;
        iMessage.meAction = isMe;
        iMessage.date = Time.getDateStr();
        iMessage.time = Time.getTime();
        iMessage.messageType = target[0] == '#' ? IndividualMessageTypes.CHANMSG : IndividualMessageTypes.PRIVMSG;
        if (iMessage.messageType === IndividualMessageTypes.CHANMSG) {
            iMessage.channel = target;
        }
        else {
            iMessage.privateAuthor = iMessage.author;
            iMessage.author = target;
        }
        MessageHandler.onMessage(iMessage);
    }
    getWS() {
        return this.webSocket;
    }
}
IRCoreService.clientName = 'IRCoreV2';
IRCoreService.ɵprov = ɵɵdefineInjectable({ factory: function IRCoreService_Factory() { return new IRCoreService(ɵɵinject(UserInfoService)); }, token: IRCoreService, providedIn: "root" });
IRCoreService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
IRCoreService.ctorParameters = () => [
    { type: UserInfoService }
];

// @dynamic
class AvatarHelper {
    static setAvatarURL(url) {
        this.avatarURL = url;
    }
    static getAvatarURL() {
        return this.avatarURL;
    }
}

class ChannelData {
    constructor() {
        this.users = [];
        this.messages = [];
    }
}
class GenericMessage {
}
class Quote {
}
class Author {
    constructor(user) {
        let imageURL = AvatarHelper.getAvatarURL();
        if (typeof user == 'string') {
            this.image = imageURL + user;
        }
        else {
            this.image = imageURL + user.nick;
        }
        this.user = user;
    }
}

class EmoteList {
    static getMeme(name, author) {
        if (this.memes.findIndex(meme => meme === name) >= 0) {
            return this.memesLocation + name + this.memesExtension;
        }
        else {
            return undefined;
        }
    }
    static getFace(name, author) {
        if (this.faces.findIndex(meme => meme === name) >= 0) {
            return this.facesLocation + name + this.facesExtension;
        }
        else if (this.specialFaces[author] &&
            this.specialFaces[author].findIndex(meme => meme === name) >= 0) {
            return this.specialLocation + name + this.facesExtension;
        }
        else if (author === 'Gabriela-') {
            if (name === 'magia') {
                startEventEffect();
            }
            if (name === 'primavera') {
                startEventEffectPrimavera();
            }
            if (name === 'verano') {
                startEventEffectVerano();
            }
            if (name === 'otono') {
                startEventEffectOtono();
            }
            if (name === 'cabritas') {
                startEventEffectCabritas();
            }
            if (name === 'regalos') {
                startEventEffectRegalo();
            }
            if (name === 'lluvia') {
                startEventEffectMeteor();
            }
            if (name === 'kz2') {
                startEventEffectKz2s();
            }
            return undefined;
        }
        else if (author === 'Alex' || author === 'Tulkalex' || author === 'Tulkalen') {
            if (name === 'kz2') {
                startEventEffectKz2s(); // Probando
            }
            return undefined;
        }
        else {
            return undefined;
        }
    }
}
EmoteList.facesLocation = 'assets/faces/';
EmoteList.specialLocation = 'assets/specials/';
EmoteList.facesExtension = '.png';
EmoteList.memesLocation = 'assets/em-mem/';
EmoteList.memesExtension = '';
EmoteList.specialFaces = {
    'Gabriela-': [
        'regla',
        'magico',
        'stamp'
    ],
    Polsaker: [
        'stamp'
    ]
};
EmoteList.faces = [
    'aaa',
    'break',
    'chaky',
    'challenge',
    'cry',
    'ehh',
    'facepalm',
    'fap',
    'fffpf',
    'fu',
    'fuckyeah',
    'genius',
    'hmmm',
    'hpm',
    'jij',
    'laugh',
    'LOL',
    'magicBook',
    'magicCircle',
    'magicDrug',
    'magichat',
    'no',
    'oka',
    'rage',
    'siuu',
    'sparkle',
    'stickmagic',
    'stickmagic2',
    'trollface',
    'mog',
    'why',
    'WitchHat',
    'why',
    'yao',
    'true',
    'amazing',
    'forever',
    'notbad',
    'brindis',
    'buttcoin',
    'cigar',
    'cigar2',
    'coffee',
    'coffee2',
    'coffee3',
    'goatman',
    'hacker',
    'service',
    'stick',
    'wine',
    'wineBottle',
    'escoba',
    'principito',
    'baskerville',
    'cumple',
    'cumple2',
    'abrazo',
    'agua1',
    'agua2',
    'angry',
    'barco',
    'eagle',
    'fatcat',
    'fox',
    'handshake',
    'kiss',
    'rose',
    'tarta',
    'te',
    'whisky',
    'zumo',
    'burger',
    'candy',
    'caniche',
    'celtic',
    'coca',
    'editorial',
    'gaviota',
    'goat',
    'icecream',
    'listado',
    'magicwind',
    'medal',
    'musical',
    'palette',
    'pizza',
    'podium',
    'batido',
    'fresas',
    'wizard',
    'xane'
];
EmoteList.memes = [
    'baneo',
    'baneo2',
    'baneo3',
    'buscar',
    'buscar2',
    'comunicacion',
    'despedida',
    'expulsar',
    'hacker',
    'hacker2',
    'hacker3',
    'hacker4',
    'hacker5',
    'hacker6',
    'hacker7',
    'hacker8',
    'hacker9',
    'hacker10',
    'hacker11',
    'hacker12',
    'impuestos',
    'impuestos2',
    'llegada',
    'magia',
    'magia2',
    'magia3',
    'magia4',
    'magia5',
    'magia6',
    'nopreguntas',
    'nopreguntas2',
    'topic',
    'topic2'
];

class PostProcessor {
    static processMessage(message, author, me) {
        const mwm = new MessageWithMetadata();
        const youtubeLink = /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/.exec(message);
        if (youtubeLink) {
            message = message.replace(youtubeLink[0], '');
            mwm.youtube = youtubeLink[5];
        }
        const imageLink = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|gif|png)/.exec(message);
        if (imageLink) {
            message = message.replace(imageLink[0], '');
            mwm.image = imageLink[0];
        }
        const otherLink = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/.exec(message);
        if (otherLink) {
            message = message.replace(otherLink[0], '');
            mwm.link = otherLink[0];
        }
        const quote = /^<([^>]+)>\s([^|]+)\|?(.*)$/.exec(message);
        if (quote) {
            mwm.quote = {
                author: quote[1],
                originalMessage: quote[2]
            };
            message = quote[3];
        }
        // prevent XSS:
        const temp = document.createElement('div');
        temp.textContent = message;
        message = temp.innerHTML;
        // end of xss prevention
        // replacing memes
        const faces = message.match(/:([a-zA-Z0-9]+):/g);
        if (faces) {
            faces.forEach(face => {
                const realName = face.replace(':', '').replace(':', '');
                const realLocation = EmoteList.getFace(realName, author);
                if (realLocation) {
                    message = message.replace(face, '<img src="' + realLocation + '" class="faceEmote ' + realName + '" data-name="' +
                        realName + '" title=":' + realName + '" alt=":' + realName + '"/>');
                }
            });
        }
        const memes = message.match(/;([a-zA-Z0-9]+);/g);
        if (memes) {
            memes.forEach(meme => {
                const realName = meme.replace(';', '').replace(';', '');
                const realLocation = EmoteList.getMeme(realName, author);
                if (realLocation) {
                    message = message.replace(meme, '<img src="' + realLocation + '" class="memeEmote ' + realName + '" data-name="' + realName +
                        '" title=";' + realName + '" alt=";' + realName + '"/>');
                }
            });
        }
        mwm.message = PostProcessor.processPings(message, me);
        return mwm;
    }
    static processPings(mwm, me) {
        const regex = ValidRegex.getRegex(ValidRegex.pingRegex(me));
        const result = regex.exec(mwm);
        if (result) {
            mwm = '';
            if (result[1]) {
                mwm += result[1];
            }
            if (result[2]) {
                mwm += result[2];
            }
            mwm += '<b class="ping">' + result[3] + '</b>';
            if (result[4]) {
                mwm += result[4];
            }
            if (result[5]) {
                mwm += result[5];
            }
            mwm = mwm.replace(', ,', ',');
        }
        return mwm;
    }
    static deconverHTML(msg) {
        const matchs = msg.match(/\<img\ssrc\=\"([^"]+)\"\sclass\=\"([^"]+)\"\sdata-name="([^"]+)"\stitle="([^"]+)"\salt="([^"]+)"\/\>/g);
        if (matchs) {
            matchs.forEach(match => {
                const data = /\<img\ssrc\=\"([^"]+)\"\sclass\=\"([^"]+)\"\sdata-name="([^"]+)"\stitle="([^"]+)"\salt="([^"]+)"\/\>/.exec(match);
                msg = msg.replace(data[0], data[4]);
            });
        }
        return msg;
    }
    static processUserMetadata(user) {
        const mod = user[0];
        if (mod === '~' ||
            mod === '&' ||
            mod === '@' ||
            mod === '%' ||
            mod === '+') {
            user = user.slice(1);
        }
        const out = new UserWithMetadata();
        out.nick = user;
        if (mod === '~') {
            out.status = UserStatuses.FOUNDER;
        }
        else if (mod === '&') {
            out.status = UserStatuses.NET_OPERATOR;
        }
        else if (mod === '@') {
            out.status = UserStatuses.OPERATOR;
        }
        else if (mod === '%') {
            out.status = UserStatuses.HALF_OPERATOR;
        }
        else if (mod === '+') {
            out.status = UserStatuses.VOICE;
        }
        return out;
    }
}
class UserWithMetadata {
}
class MessageWithMetadata {
}
class QuoteMessage {
}
var UserStatuses;
(function (UserStatuses) {
    UserStatuses["FOUNDER"] = "FOUNDER";
    UserStatuses["NET_OPERATOR"] = "NET_OPERATOR";
    UserStatuses["OPERATOR"] = "OPERATOR";
    UserStatuses["HALF_OPERATOR"] = "HALF_OPERATOR";
    UserStatuses["VOICE"] = "VOICE";
    UserStatuses["BANNED"] = "BANNED";
})(UserStatuses || (UserStatuses = {}));

/**
 * Servicio para gestionar mis canales y los usuarios en esos canales
 */
class ChannelsService {
    constructor(userSrv) {
        this.userSrv = userSrv;
        this.listChanged = new EventEmitter();
        this.messagesReceived = new EventEmitter();
        this.membersChanged = new EventEmitter();
        this.channels = [];
        // Subscribe to events
        JoinHandler.setHandler(this);
        KickHandler.setHandler(this);
        PartHandler.setHandler(this);
        UsersHandler.setHandler(this);
        ChannelListHandler.setHandler(this);
        StatusHandler.setHandlerNickChanged(this);
        ChannelStatusHandler.setHandler(this);
        MessageHandler.setHandler(this);
        ModeratedHandler.channelModerated.subscribe(d => {
            // canal moderado:
            const channel = d.partials[3][0] == '#' ? d.partials[3].substring(1) : d.partials[3];
            const channelObj = this.channels.find(chnl => chnl.name === channel);
            if (channelObj) {
                this.sendSpecialMSG(channelObj, d.body);
            }
        });
        ModeHandler.modeChange.subscribe((d) => {
            if (d.channelTarget != d.userTarget.nick) {
                const channel = d.channelTarget[0] == '#' ? d.channelTarget.substring(1) : d.channelTarget;
                const channelObj = this.channels.find(chnl => chnl.name === channel);
                if (channelObj) {
                    const user = channelObj.users.find(user => user.nick === d.userTarget.nick);
                    if (user) {
                        if (d.modeAdded) {
                            if (d.mode.indexOf('q') > -1) {
                                user.mode = UModes.FOUNDER;
                            }
                            else if (d.mode.indexOf('a') > -1 || d.mode.indexOf('A') > -1) {
                                user.mode = UModes.ADMIN;
                            }
                            else if (d.mode.indexOf('o') > -1 || d.mode.indexOf('O') > -1) {
                                user.mode = UModes.OPER;
                            }
                            else if (d.mode.indexOf('h') > -1 || d.mode.indexOf('H') > -1) {
                                user.mode = UModes.HALFOPER;
                            }
                            else if (d.mode.indexOf('v') > -1 || d.mode.indexOf('V') > -1) {
                                user.mode = UModes.VOICE;
                            }
                        }
                        else {
                            user.mode = undefined; // FIXME: acá habría que ver que modos le quedan.
                        }
                        this.membersChanged.emit({
                            channel,
                            users: channelObj.users
                        });
                    }
                    const action = d.modeAdded ? 'agregó' : 'quitó';
                    const mod = d.modeAdded ? '+' : '-';
                    this.sendSpecialMSG(channelObj, 'Se ' + action + ' el modo "' + mod + d.mode + '" a ' + d.userTarget.nick);
                }
            }
            else {
                // modo de canal
                const channel = d.channelTarget[0] == '#' ? d.channelTarget.substring(1) : d.channelTarget;
                const channelObj = this.channels.find(chnl => chnl.name === channel);
                if (channelObj) {
                    this.sendSpecialMSG(channelObj, 'Se cambió el modo del canal: ' + d.mode);
                }
            }
        });
        this.history = JSON.parse(localStorage.getItem('chan_history'));
        if (!this.history) {
            this.history = {};
        }
    }
    saveHistory(channel, msg) {
        if (!this.history[channel]) {
            this.history[channel] = [];
        }
        const msC = Object.assign({}, msg);
        msC.fromHistory = true;
        this.history[channel].push(msC);
        localStorage.setItem('chan_history', JSON.stringify(this.history));
    }
    getHistory(author) {
        return this.history[author];
    }
    onChannelList(user, channels) {
        // actualizamos nuestra lista de canales:
        if (user === this.userSrv.getNick()) {
            // agregamos nuevos canales
            const actualChnls = [];
            channels.forEach(channel => {
                const oldChnl = this.channels.find(chnl => chnl.name === channel.name);
                if (!oldChnl) {
                    this.addChannel(channel.name);
                }
                actualChnls.push(channel.name);
            });
            // buscamos elementos inexistentes
            this.channels.forEach((channel, idx) => {
                if (!actualChnls.find(chName => chName === channel.name)) {
                    this.channels.splice(idx, 1);
                }
            });
            this.listChanged.emit(this.channels);
        }
    }
    addChannel(channel) {
        const nChannel = new ChannelData();
        nChannel.name = channel;
        nChannel.topic = ChannelStatusHandler.getChannelTopic(nChannel.name);
        nChannel.messages = []; // Get from log?
        this.channels.push(nChannel);
        return nChannel;
    }
    onUserList(channel, users) {
        let channelObj = this.channels.find(chnl => chnl.name === channel);
        // si no existe este canal lo agregamos.
        if (!channelObj) {
            channelObj = this.addChannel(channel);
        }
        const actualUsers = [];
        users.forEach(currentUser => {
            const oldUser = channelObj.users.find(user => user.nick === currentUser.nick);
            if (!oldUser) {
                const newUser = new User(currentUser.nick);
                newUser.mode = currentUser.mode;
                channelObj.users.push(newUser);
            }
            else {
                oldUser.mode = currentUser.mode;
            }
            actualUsers.push(currentUser.nick);
        });
        // buscamos usuarios que ya no estan
        channelObj.users.forEach((user, idx) => {
            if (!actualUsers.find(acu => user.nick === acu)) {
                channelObj.users.splice(idx, 1);
            }
        });
        this.membersChanged.emit({ channel: channel, users: channelObj.users });
    }
    sendSpecialMSG(channel, message) {
        const msg = {
            message: message,
            date: Time.getTime() + ' ' + Time.getDateStr(),
            special: false,
            target: channel.name,
            notify: true
        };
        channel.messages.push(msg);
        this.messagesReceived.emit(msg);
    }
    onKick(data) {
        if (data.userTarget.nick === this.userSrv.getNick()) {
            this.channels.splice(this.channels.findIndex(chan => chan.name === data.channel.name));
            this.listChanged.emit(this.channels);
        }
        else {
            const chnlObj = this.channels.find(chnl => chnl.name === data.channel.name);
            if (chnlObj) {
                const idx = chnlObj.users.findIndex(user => user.nick === data.userTarget.nick);
                if (idx >= 0) {
                    chnlObj.users.splice(idx, 1);
                }
            }
            else {
                console.error('No se encontró el canal en el que se kickeó el usuario.', data.channel);
            }
            this.membersChanged.emit({ channel: data.channel.name, users: chnlObj.users });
            this.sendSpecialMSG(chnlObj, data.userTarget.nick + ' fué kickeado/a del canal por ' + data.operator + '.');
        }
    }
    onPart(data) {
        if (data.user.nick === this.userSrv.getNick()) {
            this.channels.splice(this.channels.findIndex(chan => chan.name === data.channel.name), 1);
            this.listChanged.emit(this.channels);
        }
        else {
            const chnlObj = this.channels.find(chnl => chnl.name === data.channel.name);
            if (chnlObj) {
                const idx = chnlObj.users.findIndex(user => user.nick === data.user.nick);
                if (idx >= 0) {
                    chnlObj.users.splice(idx, 1);
                }
            }
            else {
                console.error('No se encontró el canal en el que partió el usuario.', data.channel);
            }
            this.membersChanged.emit({ channel: data.channel.name, users: chnlObj.users });
            this.sendSpecialMSG(chnlObj, data.user.nick + ' se fué del canal');
        }
    }
    onJoin(data) {
        if (data.user.nick === this.userSrv.getNick()) {
            if (!this.channels.find(chnl => chnl.name === data.channel.name)) {
                this.addChannel(data.channel.name);
            }
            this.listChanged.emit(this.channels);
        }
        else {
            const chnlObj = this.channels.find(chnl => chnl.name === data.channel.name);
            if (chnlObj) {
                const newUser = new User(data.user.nick);
                newUser.mode = data.user.mode;
                chnlObj.users.push(newUser);
            }
            else {
                console.error('No se encontró el canal en el que se unió el usuario.', data.channel);
            }
            this.membersChanged.emit({ channel: data.channel.name, users: chnlObj.users });
            this.sendSpecialMSG(chnlObj, data.user.nick + ' se unió al canal');
        }
    }
    onNickChanged(nick) {
        // buscar en la lista de usuarios en cada canal el nick y cambiarlo
        this.channels.forEach((chnl) => {
            const oldUsr = chnl.users.find(usr => usr.nick === nick.oldNick);
            oldUsr.nick = nick.newNick;
            this.membersChanged.emit({ channel: chnl.name, users: chnl.users });
            this.sendSpecialMSG(chnl, nick.oldNick + ' se cambió el nick a ' + nick.newNick);
        });
    }
    onTopicUpdate(channel, newTopic) {
        if (channel[0] === '#') {
            channel = channel.substring(1);
        }
        const chnlObj = this.channels.find(chnl => chnl.name === channel);
        if (chnlObj) {
            chnlObj.topic = newTopic;
        }
        else {
            console.error('No se encontró el canal en el que se cambió el topic. ', channel);
        }
    }
    getChannels() {
        return this.channels;
    }
    getChannel(channel) {
        return this.channels.find(chanObj => chanObj.name == channel);
    }
    onMessageReceived(message) {
        if (message.messageType == IndividualMessageTypes.CHANMSG) {
            const tgtChan = message.channel[0] == '#' ? message.channel.substring(1) : message.channel;
            const chanObj = this.channels.find(chan => chan.name == tgtChan);
            const msg = {
                message: message.message,
                messageWithMetadata: PostProcessor.processMessage(message.message, message.author, this.userSrv.getNick()),
                author: new Author(message.author),
                date: message.date + ' ' + message.time,
                special: message.meAction,
                target: tgtChan
            };
            chanObj.messages.push(msg);
            this.messagesReceived.emit(msg);
            this.saveHistory(tgtChan, msg);
        }
    }
}
ChannelsService.ɵprov = ɵɵdefineInjectable({ factory: function ChannelsService_Factory() { return new ChannelsService(ɵɵinject(UserInfoService)); }, token: ChannelsService, providedIn: "root" });
ChannelsService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
ChannelsService.ctorParameters = () => [
    { type: UserInfoService }
];

class PrivmsgData {
    constructor() {
        this.messages = [];
    }
}

class PrivmsgService {
    constructor(userSrv) {
        this.userSrv = userSrv;
        this.messagesReceived = new EventEmitter();
        this.newPrivOpened = new EventEmitter();
        this.closedPriv = new EventEmitter();
        this.privMsgs = {};
        MessageHandler.setHandler(this);
        this.history = JSON.parse(localStorage.getItem('pv_history'));
        if (!this.history) {
            this.history = {};
        }
    }
    onMessageReceived(message) {
        if (message.messageType == IndividualMessageTypes.PRIVMSG) {
            const msgAuthor = message.privateAuthor ? message.privateAuthor : message.author;
            const msg = {
                message: message.message,
                messageWithMetadata: PostProcessor.processMessage(message.message, msgAuthor, this.userSrv.getNick()),
                author: new Author(msgAuthor),
                date: message.date + ' ' + message.time,
                special: message.meAction,
                target: message.channel
            };
            if (this.privMsgs[message.author]) {
                this.privMsgs[message.author].messages.push(msg);
            }
            else {
                this.newPrivOpened.emit(message.author);
                this.privMsgs[message.author] = new PrivmsgData();
                this.privMsgs[message.author].user = message.author;
                this.privMsgs[message.author].messages.push(msg);
            }
            this.messagesReceived.emit(msg);
            this.saveHistory(message.author, msg);
        }
    }
    saveHistory(author, msg) {
        if (!this.history[author]) {
            this.history[author] = [];
        }
        const msC = Object.assign({}, msg);
        msC.fromHistory = true;
        this.history[author].push(msC);
        localStorage.setItem('pv_history', JSON.stringify(this.history));
    }
    getHistory(author) {
        return this.history[author];
    }
    getPrivate(nick) {
        if (!this.privMsgs[nick]) {
            this.privMsgs[nick] = new PrivmsgData();
            this.privMsgs[nick].user = nick;
            this.newPrivOpened.emit(nick);
        }
        return this.privMsgs[nick];
    }
    closePrivate(nick) {
        delete this.privMsgs[nick];
        this.closedPriv.emit(nick);
    }
}
PrivmsgService.ɵprov = ɵɵdefineInjectable({ factory: function PrivmsgService_Factory() { return new PrivmsgService(ɵɵinject(UserInfoService)); }, token: PrivmsgService, providedIn: "root" });
PrivmsgService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
PrivmsgService.ctorParameters = () => [
    { type: UserInfoService }
];

class ServerMsgService {
    constructor() {
        this.messages = [];
        this.newMessage = new EventEmitter();
        ServerHandler.serverResponse.subscribe((d) => {
            this.messages.push(d);
            this.newMessage.emit(d);
        });
        ServerHandler.serverNoticeResponse.subscribe((d) => {
            this.messages.push(d);
            this.newMessage.emit(d);
        });
    }
}
ServerMsgService.ɵprov = ɵɵdefineInjectable({ factory: function ServerMsgService_Factory() { return new ServerMsgService(); }, token: ServerMsgService, providedIn: "root" });
ServerMsgService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
ServerMsgService.ctorParameters = () => [];

class WhoStatusService {
    constructor() {
        this.whoStatus = {};
        WhoHandler.onWhoResponse.subscribe((dW) => {
            this.whoStatus[dW.nick] = dW;
        });
    }
    isAway(nick) {
        if (this.whoStatus[nick] && this.whoStatus[nick].isAway) {
            return true;
        }
        return false;
    }
}
WhoStatusService.ɵprov = ɵɵdefineInjectable({ factory: function WhoStatusService_Factory() { return new WhoStatusService(); }, token: WhoStatusService, providedIn: "root" });
WhoStatusService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
WhoStatusService.ctorParameters = () => [];

/*
 * Public API Surface of ircore
 */

/**
 * Generated bundle index. Do not edit.
 */

export { Author, AvatarHelper, Away, AwayHandler, Channel, ChannelAndUserList, ChannelData, ChannelInfo, ChannelListHandler, ChannelStatusHandler, ChannelTopicUpdate, ChannelUserList, ChannelsService, ChannelsTopic, ConnectionStatus, ConnectionStatusData, EmoteList, GenericMessage, GmodeHandler, IRCMessage, IRCParserV2, IRCoreModule, IRCoreService, IgnoreHandler, IndividualMessage, IndividualMessageTypes, Join, JoinHandler, KickHandler, KickInfo, ListHandler, MessageData, MessageHandler, MessageWithMetadata, ModeHandler, ModeratedHandler, MotdHandler, NewMode, NickChange, OriginData, Part, PartHandler, PostProcessor, PrivmsgData, PrivmsgService, Quit, QuitHandler, Quote, QuoteMessage, ServerHandler, ServerMsgService, StatusHandler, Time, UModes, UpdateChannelList, User, UserChannelList, UserInChannel, UserInfoService, UserStatuses, UserWithMetadata, UsersHandler, UsersWhos, ValidRegex, WebSocketUtil, Who, WhoDatas, WhoHandler, WhoIsData, WhoIsHandler, WhoStatusService };
//# sourceMappingURL=ircore.js.map
