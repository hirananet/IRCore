(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/webSocket'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('ircore', ['exports', '@angular/core', 'rxjs/webSocket', 'rxjs'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ircore = {}, global.ng.core, global.rxjs.webSocket, global.rxjs));
}(this, (function (exports, i0, webSocket, rxjs) { 'use strict';

    var Join = /** @class */ (function () {
        function Join() {
        }
        return Join;
    }());

    // @dynamic
    var PartHandler = /** @class */ (function () {
        function PartHandler() {
        }
        PartHandler.onPart = function (part) {
            this.partResponse.emit(part);
        };
        PartHandler.setHandler = function (hdlr) {
            this.partResponse.subscribe(function (data) {
                hdlr.onPart(data);
            });
        };
        return PartHandler;
    }());
    PartHandler.partResponse = new i0.EventEmitter();

    var KickInfo = /** @class */ (function () {
        function KickInfo() {
        }
        return KickInfo;
    }());

    // @dynamic
    var KickHandler = /** @class */ (function () {
        function KickHandler() {
        }
        KickHandler.kickParse = function (rawMessage) {
            return /#([^\s]+)\s([^:]+)\s/.exec(rawMessage);
        };
        KickHandler.onKick = function (kick) {
            this.kicked.emit(kick);
        };
        KickHandler.setHandler = function (hdlr) {
            this.kicked.subscribe(function (data) {
                hdlr.onKick(data);
            });
        };
        return KickHandler;
    }());
    KickHandler.kicked = new i0.EventEmitter();

    var Away = /** @class */ (function () {
        function Away() {
        }
        return Away;
    }());

    var NewMode = /** @class */ (function () {
        function NewMode() {
        }
        return NewMode;
    }());

    /*
      Clase para manejar los request en +g
    */
    // @dynamic
    var GmodeHandler = /** @class */ (function () {
        function GmodeHandler() {
        }
        GmodeHandler.privateRequest = function (user) {
            GmodeHandler.onPrivateRequest.emit(user);
        };
        return GmodeHandler;
    }());
    GmodeHandler.onPrivateRequest = new i0.EventEmitter();

    (function (UModes) {
        UModes[UModes["FOUNDER"] = 0] = "FOUNDER";
        UModes[UModes["ADMIN"] = 1] = "ADMIN";
        UModes[UModes["OPER"] = 2] = "OPER";
        UModes[UModes["HALFOPER"] = 3] = "HALFOPER";
        UModes[UModes["VOICE"] = 4] = "VOICE";
        UModes[UModes["BANNED"] = 5] = "BANNED";
    })(exports.UModes || (exports.UModes = {}));

    var Channel = /** @class */ (function () {
        function Channel(channel) {
            if (channel[0] === '~') {
                this.mode = exports.UModes.FOUNDER;
                channel = channel.substr(1);
            }
            else if (channel[0] === '&') {
                this.mode = exports.UModes.ADMIN;
                channel = channel.substr(1);
            }
            else if (channel[0] === '@') {
                this.mode = exports.UModes.OPER;
                channel = channel.substr(1);
            }
            else if (channel[0] === '%') {
                this.mode = exports.UModes.HALFOPER;
                channel = channel.substr(1);
            }
            else if (channel[0] === '+') {
                this.mode = exports.UModes.VOICE;
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
        return Channel;
    }());

    /*
      Clase para manejar los canales que tiene un usuario.
      Lista de canales que trae el whois de un usuario o el mensaje inicial
    */
    // @dynamic
    var ChannelListHandler = /** @class */ (function () {
        function ChannelListHandler() {
        }
        ChannelListHandler.setChannelList = function (user, channelList) {
            // FIXME: update the same instance.
            this.uChannelList[user] = channelList;
            this.channelListUpdated.emit(new UpdateChannelList(user, channelList));
        };
        ChannelListHandler.getChannels = function () {
            return this.uChannelList;
        };
        ChannelListHandler.setHandler = function (hdlr) {
            this.channelListUpdated.subscribe(function (data) {
                hdlr.onChannelList(data.user, data.channels);
            });
        };
        return ChannelListHandler;
    }());
    ChannelListHandler.uChannelList = {};
    ChannelListHandler.channelListUpdated = new i0.EventEmitter();
    var UserChannelList = /** @class */ (function () {
        function UserChannelList() {
        }
        return UserChannelList;
    }());
    var UpdateChannelList = /** @class */ (function () {
        function UpdateChannelList(user, channels) {
            this.channels = [];
            this.user = user;
            this.channels = channels;
        }
        return UpdateChannelList;
    }());

    var WhoIsData = /** @class */ (function () {
        function WhoIsData() {
            this.isGOP = false;
            this.isSecured = false;
        }
        WhoIsData.prototype.getLastLogin = function () {
            var date = new Date(parseInt(this.lastLogin, 10) * 1000);
            var hs = date.getHours();
            if (hs < 10) {
                hs = '0' + hs;
            }
            var mins = date.getMinutes();
            if (mins < 10) {
                mins = '0' + mins;
            }
            var day = date.getDate();
            if (day < 10) {
                day = '0' + day;
            }
            var month = (date.getMonth() + 1);
            if (month < 10) {
                month = '0' + month;
            }
            return day + '/' + month + '/' + date.getFullYear() + ' ' + hs + ':' + mins;
        };
        WhoIsData.prototype.getIdle = function () {
            var out = '';
            var idle = this.idle;
            if (idle >= 60) {
                var secs = (this.idle % 60);
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
                var mins = (idle % 60);
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
                var hs = (idle % 24);
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
        };
        return WhoIsData;
    }());

    /*
      Clase para manejar el Whois de un usuario.
    */
    // @dynamic
    var WhoIsHandler = /** @class */ (function () {
        function WhoIsHandler() {
        }
        WhoIsHandler.addWhoisPartial = function (user, field, data) {
            if (!this.whoisdatas[user]) {
                this.whoisdatas[user] = new WhoIsData();
                this.whoisdatas[user].username = user;
            }
            this.whoisdatas[user][field] = data;
        };
        WhoIsHandler.finalWhoisMessage = function (user) {
            this.onWhoisResponse.emit(this.whoisdatas[user]);
        };
        WhoIsHandler.getWhoisResponses = function () {
            return this.whoisdatas;
        };
        return WhoIsHandler;
    }());
    WhoIsHandler.whoisdatas = {};
    WhoIsHandler.onWhoisResponse = new i0.EventEmitter();
    var WhoDatas = /** @class */ (function () {
        function WhoDatas() {
        }
        return WhoDatas;
    }());

    /*
      Clase para manejar el estado de los usuarios (si está away, es netop, de donde se conecta, etc.)
    */
    // @dynamic
    var WhoHandler = /** @class */ (function () {
        function WhoHandler() {
        }
        WhoHandler.addWhoData = function (user, data) {
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
        };
        WhoHandler.getWhoData = function (user) {
            return this.usersWho[user];
        };
        WhoHandler.WHOUserParser = function (message) {
            return /:([^\s]+)\s([0-9]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s(H|G)(\*?)(\~|\&|\@|\%|\+)?/.exec(message);
        };
        return WhoHandler;
    }());
    WhoHandler.usersWho = {};
    WhoHandler.onWhoResponse = new i0.EventEmitter();
    var UsersWhos = /** @class */ (function () {
        function UsersWhos() {
        }
        return UsersWhos;
    }());

    var Who = /** @class */ (function () {
        function Who() {
        }
        return Who;
    }());

    /*
      Clase para manejar los usuarios que hay en un canal (mensaje inicial de usuarios por names)
    */
    // @dynamic
    var UsersHandler = /** @class */ (function () {
        function UsersHandler() {
        }
        UsersHandler.addUsersToChannel = function (channel, users) {
            this.usersInChannel[channel] = users;
            this.usersInChannelResponse.emit(new ChannelAndUserList(channel, users));
        };
        UsersHandler.getChannelOfMessage = function (message) {
            var messages = /(=|@|\*)([^:]+):/.exec(message);
            if (messages && messages.length > 2) {
                return messages[2].trim();
            }
            else {
                console.error('GCOM, ', message);
            }
        };
        UsersHandler.getUsersInChannel = function (channel) {
            return this.usersInChannel[channel];
        };
        UsersHandler.setHandler = function (hdlr) {
            this.usersInChannelResponse.subscribe(function (data) {
                hdlr.onUserList(data.channel, data.userList);
            });
        };
        return UsersHandler;
    }());
    UsersHandler.usersInChannel = {};
    UsersHandler.usersInChannelResponse = new i0.EventEmitter();
    var ChannelAndUserList = /** @class */ (function () {
        function ChannelAndUserList(channel, userList) {
            this.channel = channel;
            this.userList = userList;
        }
        return ChannelAndUserList;
    }());
    var ChannelUserList = /** @class */ (function () {
        function ChannelUserList() {
        }
        return ChannelUserList;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var User = /** @class */ (function () {
        function User(nick) {
            if (nick[0] === '~') {
                this.mode = exports.UModes.FOUNDER;
                nick = nick.substr(1);
            }
            else if (nick[0] === '&') {
                this.mode = exports.UModes.ADMIN;
                nick = nick.substr(1);
            }
            else if (nick[0] === '@') {
                this.mode = exports.UModes.OPER;
                nick = nick.substr(1);
            }
            else if (nick[0] === '%') {
                this.mode = exports.UModes.HALFOPER;
                nick = nick.substr(1);
            }
            else if (nick[0] === '+') {
                this.mode = exports.UModes.VOICE;
                nick = nick.substr(1);
            }
            this.nick = nick;
        }
        return User;
    }());

    var UserInChannel = /** @class */ (function (_super) {
        __extends(UserInChannel, _super);
        function UserInChannel(nick, channel) {
            var _this = _super.call(this, nick) || this;
            _this.channel = new Channel(channel);
            return _this;
        }
        return UserInChannel;
    }(User));

    /*
      Clase para manejar el comando /list
    */
    // @dynamic
    var ListHandler = /** @class */ (function () {
        function ListHandler() {
        }
        ListHandler.addChannels = function (channel) {
            this.channels.push(channel);
        };
        ListHandler.newChannelList = function () {
            this.channels = [];
            this.channelListCreated.emit(this.channels);
        };
        ListHandler.getChannelList = function () {
            return this.channels;
        };
        return ListHandler;
    }());
    ListHandler.channels = [];
    ListHandler.channelListCreated = new i0.EventEmitter();

    var ChannelInfo = /** @class */ (function () {
        function ChannelInfo(name, description, flags, users) {
            this.name = name;
            this.description = description;
            this.flags = flags;
            this.users = users;
        }
        return ChannelInfo;
    }());

    /*
      Clase para manejar los cambios de estado del usuario, como cuando es banneado, o kickeado de un canal.
    */
    // @dynamic
    var StatusHandler = /** @class */ (function () {
        function StatusHandler() {
        }
        StatusHandler.onNickAlreadyInUse = function (nickInUse) {
            this.nickAlreadyInUse.emit(nickInUse);
        };
        StatusHandler.onBanned = function (channel) {
            this.banned.emit(channel);
        };
        StatusHandler.onNickChanged = function (nick) {
            this.nickChanged.emit(nick);
        };
        StatusHandler.setHandlerNickAlreadyInUse = function (hdlr) {
            this.nickAlreadyInUse.subscribe(function (data) {
                hdlr.onNickAlreadyInUse(data);
            });
        };
        StatusHandler.setHandlerBanned = function (hdlr) {
            this.banned.subscribe(function (data) {
                hdlr.onBanned(data);
            });
        };
        StatusHandler.setHandlerNickChanged = function (hdlr) {
            this.nickChanged.subscribe(function (data) {
                hdlr.onNickChanged(data);
            });
        };
        return StatusHandler;
    }());
    StatusHandler.nickAlreadyInUse = new i0.EventEmitter();
    StatusHandler.banned = new i0.EventEmitter();
    StatusHandler.nickChanged = new i0.EventEmitter();

    var NickChange = /** @class */ (function () {
        function NickChange(old, nnick) {
            this.oldNick = old;
            this.newNick = nnick;
        }
        return NickChange;
    }());

    var OriginData = /** @class */ (function () {
        function OriginData() {
        }
        return OriginData;
    }());
    var IRCMessage = /** @class */ (function () {
        function IRCMessage() {
        }
        return IRCMessage;
    }());

    // @dynamic
    var ValidRegex = /** @class */ (function () {
        function ValidRegex() {
        }
        ValidRegex.channelRegex = function () {
            return '#([a-zA-Z0-9_#]+)';
        };
        ValidRegex.userRegex = function () {
            return '([a-zA-Z_][a-zA-Z0-9_]+)';
        };
        ValidRegex.actionRegex = function () {
            return /\x01ACTION ([^\x01]+)\x01/;
        };
        ValidRegex.modeRegex = function () {
            return '(\\+|\-)?([a-zA-Z]+)';
        };
        ValidRegex.getRegex = function (regex) {
            return new RegExp(regex);
        };
        ValidRegex.pingRegex = function (nick) {
            return '^(.*(\\s|,|:))?(' + nick.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')((\\s|,|:).*)?$';
        };
        return ValidRegex;
    }());

    /**
     * Clase para gestionar los cambios de modos en un canal (sobre un usuario)
     */
    // @dynamic
    var ModeHandler = /** @class */ (function () {
        function ModeHandler() {
        }
        ModeHandler.modeParser = function (rawMessage) {
            var modeRaw = rawMessage.split(' MODE ')[1];
            if (modeRaw.indexOf('#') == -1) {
                var modeCut = modeRaw.split(':');
                var regex = ValidRegex.getRegex(ValidRegex.modeRegex()).exec(modeCut[1]);
                return [
                    undefined,
                    regex[1],
                    regex[2].trim(),
                    modeCut[0].trim() // usuario
                ];
            }
            else {
                var regex = ValidRegex.channelRegex() +
                    '\\s' + ValidRegex.modeRegex() + '\\s\\:?' + // modos
                    ValidRegex.userRegex();
                var regOut = ValidRegex.getRegex(regex).exec(modeRaw);
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
                    var modos = modeRaw.split(':');
                    return [
                        undefined,
                        undefined,
                        modos[1],
                        undefined
                    ];
                }
            }
        };
        ModeHandler.changeMode = function (mode) {
            this.modeChange.emit(mode);
        };
        return ModeHandler;
    }());
    ModeHandler.modeChange = new i0.EventEmitter();

    /**
     * Handler de mensajes de away
     */
    // @dynamic
    var AwayHandler = /** @class */ (function () {
        function AwayHandler() {
        }
        AwayHandler.onAway = function (away) {
            this.awayResponse.emit(away);
        };
        return AwayHandler;
    }());
    AwayHandler.awayResponse = new i0.EventEmitter();

    /**
     * clase para manejar los eventos de ignorar.
     */
    // @dynamic
    var IgnoreHandler = /** @class */ (function () {
        function IgnoreHandler() {
        }
        IgnoreHandler.onIgnore = function (ignore) {
            this.ignoreResponse.emit(ignore);
        };
        return IgnoreHandler;
    }());
    IgnoreHandler.ignoreResponse = new i0.EventEmitter();

    /**
     * clase para manejar los mensajes del día y el hook para enviar el auth al bouncer
     */
    // @dynamic
    var MotdHandler = /** @class */ (function () {
        function MotdHandler() {
        }
        return MotdHandler;
    }());
    MotdHandler.motdResponse = new i0.EventEmitter();
    MotdHandler.requirePasswordResponse = new i0.EventEmitter();

    /**
     * clase para manejar los cambios de estado de un canal, como el topic y los modos.
     */
    // @dynamic
    var ChannelStatusHandler = /** @class */ (function () {
        function ChannelStatusHandler() {
        }
        ChannelStatusHandler.setChannelTopic = function (channel, topic) {
            this.channelsTopics[channel] = topic;
            this.channelTopicResponse.emit(new ChannelTopicUpdate(channel, topic));
        };
        ChannelStatusHandler.getChannelTopic = function (channel) {
            return this.channelsTopics[channel];
        };
        ChannelStatusHandler.findChannels = function (message) {
            var channels = /#([^\s]+)/g.exec(message);
            channels = channels.slice(1);
            return channels;
        };
        ChannelStatusHandler.setHandler = function (hdlr) {
            this.channelTopicResponse.subscribe(function (topic) {
                hdlr.onTopicUpdate(topic.channel, topic.newTopic);
            });
        };
        return ChannelStatusHandler;
    }());
    ChannelStatusHandler.channelsTopics = {};
    ChannelStatusHandler.channelTopicResponse = new i0.EventEmitter();
    var ChannelsTopic = /** @class */ (function () {
        function ChannelsTopic() {
        }
        return ChannelsTopic;
    }());
    var ChannelTopicUpdate = /** @class */ (function () {
        function ChannelTopicUpdate(channel, newTopic) {
            this.channel = channel;
            this.newTopic = newTopic;
        }
        return ChannelTopicUpdate;
    }());

    var Part = /** @class */ (function () {
        function Part() {
        }
        return Part;
    }());

    // @dynamic
    var QuitHandler = /** @class */ (function () {
        function QuitHandler() {
        }
        QuitHandler.onQuit = function (quit) {
            this.quitResponse.emit(quit);
        };
        QuitHandler.setHandler = function (hdlr) {
            this.quitResponse.subscribe(function (data) {
                hdlr.onQuit(data);
            });
        };
        return QuitHandler;
    }());
    QuitHandler.quitResponse = new i0.EventEmitter();

    var Quit = /** @class */ (function () {
        function Quit(user) {
            this.user = new User(user);
        }
        return Quit;
    }());

    // @dynamic
    var JoinHandler = /** @class */ (function () {
        function JoinHandler() {
        }
        JoinHandler.onJoin = function (join) {
            this.joinResponse.emit(join);
        };
        JoinHandler.setHandler = function (hdlr) {
            this.joinResponse.subscribe(function (join) {
                hdlr.onJoin(join);
            });
        };
        return JoinHandler;
    }());
    JoinHandler.joinResponse = new i0.EventEmitter();

    // @dynamic
    var ServerHandler = /** @class */ (function () {
        function ServerHandler() {
        }
        ServerHandler.onServerResponse = function (msg) {
            this.serverResponse.emit(msg);
        };
        ServerHandler.onServerNoticeResponse = function (msg) {
            this.serverNoticeResponse.emit(msg);
        };
        return ServerHandler;
    }());
    ServerHandler.serverResponse = new i0.EventEmitter();
    ServerHandler.serverNoticeResponse = new i0.EventEmitter();

    /**
     * Clase para manejar la recepción de mensajes privados y de canal.
     */
    // @dynamic
    var MessageHandler = /** @class */ (function () {
        function MessageHandler() {
        }
        MessageHandler.onMessage = function (message) {
            this.messageResponse.emit(message);
        };
        MessageHandler.getMeAction = function (parsedMessage) {
            return ValidRegex.actionRegex().exec(parsedMessage.message);
        };
        MessageHandler.setHandler = function (hdlr) {
            this.messageResponse.subscribe(function (message) {
                hdlr.onMessageReceived(message);
            });
        };
        return MessageHandler;
    }());
    MessageHandler.messageResponse = new i0.EventEmitter();

    var IndividualMessage = /** @class */ (function () {
        function IndividualMessage() {
        }
        return IndividualMessage;
    }());
    (function (IndividualMessageTypes) {
        IndividualMessageTypes[IndividualMessageTypes["PRIVMSG"] = 0] = "PRIVMSG";
        IndividualMessageTypes[IndividualMessageTypes["CHANMSG"] = 1] = "CHANMSG";
        IndividualMessageTypes[IndividualMessageTypes["NOTIFY"] = 2] = "NOTIFY"; // notificación contra un canal.
    })(exports.IndividualMessageTypes || (exports.IndividualMessageTypes = {}));

    var Time = /** @class */ (function () {
        function Time() {
        }
        Time.getTime = function () {
            var now = new Date();
            var hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
            var min = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
            var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
            return hours + ':' + min + ':' + second;
        };
        Time.getDateStr = function () {
            var now = new Date();
            var month = (now.getMonth() + 1);
            var monthStr = month < 10 ? '0' + month : month;
            var day = now.getDate();
            var dayStr = day < 10 ? '0' + day : day;
            return dayStr + '/' + monthStr + '/' + now.getFullYear();
        };
        return Time;
    }());

    // @dynamic
    var ModeratedHandler = /** @class */ (function () {
        function ModeratedHandler() {
        }
        return ModeratedHandler;
    }());
    ModeratedHandler.channelModerated = new i0.EventEmitter();

    var IRCParserV2 = /** @class */ (function () {
        function IRCParserV2() {
        }
        IRCParserV2.parseMessage = function (message) {
            var out = [];
            message.split('\r\n').forEach(function (msgLine) {
                var r = /:([^:]+):?(.*)/.exec(msgLine);
                var TAG = r[1];
                var MSG = r[2];
                var partials = TAG.split(' ');
                var im = new IRCMessage();
                im.body = MSG;
                im.tag = TAG;
                im.partials = partials;
                im.code = partials[1];
                var target = /([^!]*!)?([^@]+@)?(.*)/.exec(partials[0]);
                var od = new OriginData();
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
        };
        IRCParserV2.processMessage = function (parsedMessage, rawMessage, actualNick) {
            if (parsedMessage.code === '319') { // lista de canales
                var chnlList_1 = [];
                parsedMessage.message.split(' ').forEach(function (pmChnl) {
                    var chnl = new Channel(pmChnl);
                    chnlList_1.push(chnl);
                });
                WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'channelList', chnlList_1);
                ChannelListHandler.setChannelList(parsedMessage.partials[3], chnlList_1);
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
                var modes = parsedMessage.body.split(' ');
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
                var data = WhoHandler.WHOUserParser(rawMessage);
                if (data) {
                    var whoData = new Who();
                    whoData.serverFrom = data[7];
                    whoData.nick = data[8];
                    whoData.isAway = data[9] === 'G';
                    whoData.isNetOp = data[10] === '*';
                    whoData.rawMsg = rawMessage;
                    var mod = data[11];
                    if (mod === '~') {
                        whoData.mode = exports.UModes.FOUNDER;
                    }
                    else if (mod === '&') {
                        whoData.mode = exports.UModes.ADMIN;
                    }
                    else if (mod === '@') {
                        whoData.mode = exports.UModes.OPER;
                    }
                    else if (mod === '%') {
                        whoData.mode = exports.UModes.HALFOPER;
                    }
                    else if (mod === '+') {
                        whoData.mode = exports.UModes.VOICE;
                    }
                    WhoHandler.addWhoData(data[8], whoData);
                }
                else {
                    console.error('BAD WHO RESPONSE PARSED: ', rawMessage, data);
                }
                return;
            }
            if (parsedMessage.code === '353') { // names
                var channel_1 = UsersHandler.getChannelOfMessage(rawMessage);
                var users = parsedMessage.message.trim().split(' ');
                var usersInChannel_1 = [];
                users.forEach(function (user) {
                    usersInChannel_1.push(new UserInChannel(user, channel_1));
                });
                var chnlObj = new Channel(channel_1);
                UsersHandler.addUsersToChannel(chnlObj.name, usersInChannel_1);
                return;
            }
            // 321 inicio lista de canales (borrar)
            if (parsedMessage.code === '321') {
                ListHandler.newChannelList();
                return;
            }
            // 322 canal de lista de canales
            if (parsedMessage.code === '322') {
                var body = parsedMessage.body.split(']');
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
                var mode = ModeHandler.modeParser(rawMessage);
                if (mode[3]) {
                    var nmode = new NewMode();
                    nmode.userTarget = new User(mode[3]);
                    nmode.channelTarget = parsedMessage.target;
                    nmode.modeAdded = mode[1] === '+';
                    nmode.mode = mode[2];
                    ModeHandler.changeMode(nmode);
                }
                else {
                    var nmode = new NewMode();
                    nmode.channelTarget = parsedMessage.target;
                    nmode.userTarget = new User(parsedMessage.target);
                    nmode.mode = mode[2];
                    ModeHandler.changeMode(nmode);
                }
                return;
            }
            if (parsedMessage.code === '301') { // away message
                var away = new Away();
                away.author = parsedMessage.partials[3];
                away.message = parsedMessage.message;
                AwayHandler.onAway(away);
                return;
            }
            if (parsedMessage.code === '716') { // server side ignored
                var ignore = new Away();
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
                    var message = new IndividualMessage();
                    message.messageType = exports.IndividualMessageTypes.NOTIFY;
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
                var channels = ChannelStatusHandler.findChannels(rawMessage);
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
                var channel = parsedMessage.target;
                var kickData = KickHandler.kickParse(rawMessage);
                var kickInfo = new KickInfo();
                kickInfo.channel = new Channel(channel);
                kickInfo.operator = parsedMessage.message;
                kickInfo.userTarget = new User(kickData[2]);
                KickHandler.onKick(kickInfo);
            }
            if (parsedMessage.code === 'PART') {
                // :Harko!~Harkolandia@harkonidaz.irc.tandilserver.com PART #SniferL4bs :"Leaving"
                var channel = parsedMessage.target;
                if (!channel) {
                    channel = parsedMessage.message;
                }
                var part = new Part();
                part.channel = new Channel(channel);
                part.message = parsedMessage.message;
                part.user = new User(parsedMessage.simplyOrigin);
                PartHandler.onPart(part);
            }
            if (parsedMessage.code === 'QUIT') {
                QuitHandler.onQuit(new Quit(parsedMessage.simplyOrigin));
            }
            if (parsedMessage.code === 'JOIN') {
                var join = new Join();
                var channel = parsedMessage.message ? parsedMessage.message : parsedMessage.target;
                join.channel = new Channel(channel);
                join.user = new User(parsedMessage.simplyOrigin);
                join.origin = parsedMessage.origin;
                JoinHandler.onJoin(join);
            }
            if (parsedMessage.code === 'PRIVMSG') {
                var meMsg = MessageHandler.getMeAction(parsedMessage);
                var message = new IndividualMessage();
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
                    message.messageType = exports.IndividualMessageTypes.PRIVMSG;
                }
                else {
                    message.messageType = exports.IndividualMessageTypes.CHANMSG;
                    message.channel = parsedMessage.target;
                }
                message.mention = message.message ? message.message.indexOf(actualNick) >= 0 : false;
                MessageHandler.onMessage(message);
                return;
            }
            ServerHandler.onServerResponse(parsedMessage);
            return;
        };
        return IRCParserV2;
    }());

    var IRCoreModule = /** @class */ (function () {
        function IRCoreModule() {
        }
        return IRCoreModule;
    }());
    IRCoreModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [],
                    imports: [],
                    exports: []
                },] }
    ];

    var WebSocketUtil = /** @class */ (function () {
        function WebSocketUtil() {
            this.onOpenSubject = new rxjs.Subject();
            this.onCloseSubject = new rxjs.Subject();
        }
        WebSocketUtil.prototype.connect = function (url, uuid) {
            this.wss = webSocket.webSocket({
                url: url,
                serializer: function (msg) { return msg; },
                deserializer: function (msg) { return msg.data; },
                openObserver: this.onOpenSubject,
                closeObserver: this.onCloseSubject
            });
            var obs = this.wss.asObservable();
            obs.subscribe(function (msg) {
                WebSocketUtil.messageReceived.emit(new MessageData(uuid, msg));
            }, function (err) {
                var status = new ConnectionStatusData();
                status.status = exports.ConnectionStatus.ERROR;
                status.data = { uuid: uuid, err: err };
                console.error('WS errror?', status.data);
                WebSocketUtil.statusChanged.emit(status);
                WebSocketUtil.connected = false;
            });
            this.onCloseSubject.subscribe(function () {
                var status = new ConnectionStatusData();
                status.status = exports.ConnectionStatus.DISCONNECTED;
                status.data = uuid;
                WebSocketUtil.statusChanged.emit(status);
                WebSocketUtil.connected = false;
            });
            this.onOpenSubject.subscribe(function () {
                var status = new ConnectionStatusData();
                status.status = exports.ConnectionStatus.CONNECTED;
                status.data = uuid;
                WebSocketUtil.statusChanged.emit(status);
                WebSocketUtil.connected = true;
            });
            return obs;
        };
        WebSocketUtil.prototype.send = function (msg) {
            this.wss.next(msg);
        };
        WebSocketUtil.prototype.disconnect = function () {
            this.wss.complete();
        };
        WebSocketUtil.isConnected = function () {
            return WebSocketUtil.connected;
        };
        return WebSocketUtil;
    }());
    WebSocketUtil.messageReceived = new i0.EventEmitter();
    WebSocketUtil.statusChanged = new i0.EventEmitter();
    WebSocketUtil.connected = false;
    var ConnectionStatusData = /** @class */ (function () {
        function ConnectionStatusData() {
        }
        return ConnectionStatusData;
    }());
    (function (ConnectionStatus) {
        ConnectionStatus[ConnectionStatus["CONNECTED"] = 0] = "CONNECTED";
        ConnectionStatus[ConnectionStatus["DISCONNECTED"] = 1] = "DISCONNECTED";
        ConnectionStatus[ConnectionStatus["ERROR"] = 2] = "ERROR";
    })(exports.ConnectionStatus || (exports.ConnectionStatus = {}));
    var MessageData = /** @class */ (function () {
        function MessageData(uuid, message) {
            this.uuid = uuid;
            this.message = message;
        }
        return MessageData;
    }());

    /**
     * Servicio para gestionar mi información
     */
    var UserInfoService = /** @class */ (function () {
        function UserInfoService() {
            this.onChangeNick = new i0.EventEmitter();
            StatusHandler.setHandlerNickChanged(this);
        }
        UserInfoService.prototype.getNick = function () {
            return this.actualNick;
        };
        UserInfoService.prototype.setNick = function (nick) {
            this.actualNick = nick;
            this.onChangeNick.emit(nick);
        };
        UserInfoService.prototype.onNickChanged = function (nick) {
            if (nick.oldNick === this.actualNick) {
                this.actualNick = nick.newNick;
            }
        };
        return UserInfoService;
    }());
    UserInfoService.ɵprov = i0.ɵɵdefineInjectable({ factory: function UserInfoService_Factory() { return new UserInfoService(); }, token: UserInfoService, providedIn: "root" });
    UserInfoService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    UserInfoService.ctorParameters = function () { return []; };

    var IRCoreService = /** @class */ (function () {
        function IRCoreService(userSrv) {
            var _this = this;
            this.userSrv = userSrv;
            WebSocketUtil.messageReceived.subscribe(function (message) {
                if (message.message.indexOf('PING') === 0) {
                    var pingResp = message.message.slice(5);
                    _this.sendRaw('PONG ' + pingResp);
                    return;
                }
                if (message.message.indexOf('ERROR') === 0) {
                    console.error('Received error from stream: ', message.message);
                    return;
                }
                IRCParserV2.parseMessage(message.message).forEach(function (msg) {
                    IRCParserV2.processMessage(msg, message.message, _this.userSrv.getNick());
                });
            });
        }
        IRCoreService.prototype.connect = function (url) {
            this.webSocket = new WebSocketUtil();
            this.webSocket.connect(url, 'WSocket');
        };
        IRCoreService.prototype.handshake = function (username, apodo, gatwayHost) {
            this.sendRaw('ENCODING UTF-8');
            if (gatwayHost) {
                this.sendRaw('HOST ' + gatwayHost);
            }
            this.sendRaw('USER ' + username + ' * * :' + IRCoreService.clientName);
            this.setNick(apodo);
        };
        IRCoreService.prototype.identify = function (password) {
            this.sendRaw('PRIVMSG NickServ identify ' + password);
        };
        IRCoreService.prototype.serverPass = function (user, password) {
            this.sendRaw('PASS ' + user + ':' + password);
        };
        IRCoreService.prototype.setNick = function (nick) {
            this.sendRaw('NICK ' + nick);
            this.userSrv.setNick(nick);
        };
        IRCoreService.prototype.sendWhox = function (channel) {
            channel = channel[0] === '#' ? channel : '#' + channel;
            this.sendRaw('WHO ' + channel);
        };
        IRCoreService.prototype.join = function (channel) {
            if (channel[0] != '#') {
                channel = '#' + channel;
            }
            this.sendRaw('JOIN ' + channel);
        };
        IRCoreService.prototype.disconnect = function () {
            this.webSocket.disconnect();
        };
        IRCoreService.prototype.sendRaw = function (rawMessage) {
            this.webSocket.send(rawMessage);
        };
        IRCoreService.prototype.sendMessageOrCommand = function (command, target) {
            if (command[0] === '/') {
                var cmd = command.slice(1);
                var verb = cmd.split(' ')[0].toLowerCase();
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
                        var now = new Date();
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
        };
        IRCoreService.prototype._triggerMessage = function (command, target, isMe) {
            var iMessage = new IndividualMessage();
            iMessage.author = this.userSrv.getNick();
            iMessage.message = command;
            iMessage.meAction = isMe;
            iMessage.date = Time.getDateStr();
            iMessage.time = Time.getTime();
            iMessage.messageType = target[0] == '#' ? exports.IndividualMessageTypes.CHANMSG : exports.IndividualMessageTypes.PRIVMSG;
            if (iMessage.messageType === exports.IndividualMessageTypes.CHANMSG) {
                iMessage.channel = target;
            }
            else {
                iMessage.privateAuthor = iMessage.author;
                iMessage.author = target;
            }
            MessageHandler.onMessage(iMessage);
        };
        IRCoreService.prototype.getWS = function () {
            return this.webSocket;
        };
        return IRCoreService;
    }());
    IRCoreService.clientName = 'IRCoreV2';
    IRCoreService.ɵprov = i0.ɵɵdefineInjectable({ factory: function IRCoreService_Factory() { return new IRCoreService(i0.ɵɵinject(UserInfoService)); }, token: IRCoreService, providedIn: "root" });
    IRCoreService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    IRCoreService.ctorParameters = function () { return [
        { type: UserInfoService }
    ]; };

    // @dynamic
    var AvatarHelper = /** @class */ (function () {
        function AvatarHelper() {
        }
        AvatarHelper.setAvatarURL = function (url) {
            this.avatarURL = url;
        };
        AvatarHelper.getAvatarURL = function () {
            return this.avatarURL;
        };
        return AvatarHelper;
    }());

    var ChannelData = /** @class */ (function () {
        function ChannelData() {
            this.users = [];
            this.messages = [];
        }
        return ChannelData;
    }());
    var GenericMessage = /** @class */ (function () {
        function GenericMessage() {
        }
        return GenericMessage;
    }());
    var Quote = /** @class */ (function () {
        function Quote() {
        }
        return Quote;
    }());
    var Author = /** @class */ (function () {
        function Author(user) {
            var imageURL = AvatarHelper.getAvatarURL();
            if (typeof user == 'string') {
                this.image = imageURL + user;
            }
            else {
                this.image = imageURL + user.nick;
            }
            this.user = user;
        }
        return Author;
    }());

    var EmoteList = /** @class */ (function () {
        function EmoteList() {
        }
        EmoteList.getMeme = function (name, author) {
            if (this.memes.findIndex(function (meme) { return meme === name; }) >= 0) {
                return this.memesLocation + name + this.memesExtension;
            }
            else {
                return undefined;
            }
        };
        EmoteList.getFace = function (name, author) {
            if (this.faces.findIndex(function (meme) { return meme === name; }) >= 0) {
                return this.facesLocation + name + this.facesExtension;
            }
            else if (this.specialFaces[author] &&
                this.specialFaces[author].findIndex(function (meme) { return meme === name; }) >= 0) {
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
        };
        return EmoteList;
    }());
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

    var PostProcessor = /** @class */ (function () {
        function PostProcessor() {
        }
        PostProcessor.processMessage = function (message, author, me) {
            var mwm = new MessageWithMetadata();
            var youtubeLink = /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/.exec(message);
            if (youtubeLink) {
                message = message.replace(youtubeLink[0], '');
                mwm.youtube = youtubeLink[5];
            }
            var imageLink = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|gif|png)/.exec(message);
            if (imageLink) {
                message = message.replace(imageLink[0], '');
                mwm.image = imageLink[0];
            }
            var otherLink = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/.exec(message);
            if (otherLink) {
                message = message.replace(otherLink[0], '');
                mwm.link = otherLink[0];
            }
            var quote = /^<([^>]+)>\s([^|]+)\|?(.*)$/.exec(message);
            if (quote) {
                mwm.quote = {
                    author: quote[1],
                    originalMessage: quote[2]
                };
                message = quote[3];
            }
            // prevent XSS:
            var temp = document.createElement('div');
            temp.textContent = message;
            message = temp.innerHTML;
            // end of xss prevention
            // replacing memes
            var faces = message.match(/:([a-zA-Z0-9]+):/g);
            if (faces) {
                faces.forEach(function (face) {
                    var realName = face.replace(':', '').replace(':', '');
                    var realLocation = EmoteList.getFace(realName, author);
                    if (realLocation) {
                        message = message.replace(face, '<img src="' + realLocation + '" class="faceEmote ' + realName + '" data-name="' +
                            realName + '" title=":' + realName + '" alt=":' + realName + '"/>');
                    }
                });
            }
            var memes = message.match(/;([a-zA-Z0-9]+);/g);
            if (memes) {
                memes.forEach(function (meme) {
                    var realName = meme.replace(';', '').replace(';', '');
                    var realLocation = EmoteList.getMeme(realName, author);
                    if (realLocation) {
                        message = message.replace(meme, '<img src="' + realLocation + '" class="memeEmote ' + realName + '" data-name="' + realName +
                            '" title=";' + realName + '" alt=";' + realName + '"/>');
                    }
                });
            }
            mwm.message = PostProcessor.processPings(message, me);
            return mwm;
        };
        PostProcessor.processPings = function (mwm, me) {
            var regex = ValidRegex.getRegex(ValidRegex.pingRegex(me));
            var result = regex.exec(mwm);
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
        };
        PostProcessor.deconverHTML = function (msg) {
            var matchs = msg.match(/\<img\ssrc\=\"([^"]+)\"\sclass\=\"([^"]+)\"\sdata-name="([^"]+)"\stitle="([^"]+)"\salt="([^"]+)"\/\>/g);
            if (matchs) {
                matchs.forEach(function (match) {
                    var data = /\<img\ssrc\=\"([^"]+)\"\sclass\=\"([^"]+)\"\sdata-name="([^"]+)"\stitle="([^"]+)"\salt="([^"]+)"\/\>/.exec(match);
                    msg = msg.replace(data[0], data[4]);
                });
            }
            return msg;
        };
        PostProcessor.processUserMetadata = function (user) {
            var mod = user[0];
            if (mod === '~' ||
                mod === '&' ||
                mod === '@' ||
                mod === '%' ||
                mod === '+') {
                user = user.slice(1);
            }
            var out = new UserWithMetadata();
            out.nick = user;
            if (mod === '~') {
                out.status = exports.UserStatuses.FOUNDER;
            }
            else if (mod === '&') {
                out.status = exports.UserStatuses.NET_OPERATOR;
            }
            else if (mod === '@') {
                out.status = exports.UserStatuses.OPERATOR;
            }
            else if (mod === '%') {
                out.status = exports.UserStatuses.HALF_OPERATOR;
            }
            else if (mod === '+') {
                out.status = exports.UserStatuses.VOICE;
            }
            return out;
        };
        return PostProcessor;
    }());
    var UserWithMetadata = /** @class */ (function () {
        function UserWithMetadata() {
        }
        return UserWithMetadata;
    }());
    var MessageWithMetadata = /** @class */ (function () {
        function MessageWithMetadata() {
        }
        return MessageWithMetadata;
    }());
    var QuoteMessage = /** @class */ (function () {
        function QuoteMessage() {
        }
        return QuoteMessage;
    }());
    (function (UserStatuses) {
        UserStatuses["FOUNDER"] = "FOUNDER";
        UserStatuses["NET_OPERATOR"] = "NET_OPERATOR";
        UserStatuses["OPERATOR"] = "OPERATOR";
        UserStatuses["HALF_OPERATOR"] = "HALF_OPERATOR";
        UserStatuses["VOICE"] = "VOICE";
        UserStatuses["BANNED"] = "BANNED";
    })(exports.UserStatuses || (exports.UserStatuses = {}));

    /**
     * Servicio para gestionar mis canales y los usuarios en esos canales
     */
    var ChannelsService = /** @class */ (function () {
        function ChannelsService(userSrv) {
            var _this = this;
            this.userSrv = userSrv;
            this.listChanged = new i0.EventEmitter();
            this.messagesReceived = new i0.EventEmitter();
            this.membersChanged = new i0.EventEmitter();
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
            ModeratedHandler.channelModerated.subscribe(function (d) {
                // canal moderado:
                var channel = d.partials[3][0] == '#' ? d.partials[3].substring(1) : d.partials[3];
                var channelObj = _this.channels.find(function (chnl) { return chnl.name === channel; });
                if (channelObj) {
                    _this.sendSpecialMSG(channelObj, d.body);
                }
            });
            ModeHandler.modeChange.subscribe(function (d) {
                if (d.channelTarget != d.userTarget.nick) {
                    var channel_1 = d.channelTarget[0] == '#' ? d.channelTarget.substring(1) : d.channelTarget;
                    var channelObj = _this.channels.find(function (chnl) { return chnl.name === channel_1; });
                    if (channelObj) {
                        var user = channelObj.users.find(function (user) { return user.nick === d.userTarget.nick; });
                        if (user) {
                            if (d.modeAdded) {
                                if (d.mode.indexOf('q') > -1) {
                                    user.mode = exports.UModes.FOUNDER;
                                }
                                else if (d.mode.indexOf('a') > -1 || d.mode.indexOf('A') > -1) {
                                    user.mode = exports.UModes.ADMIN;
                                }
                                else if (d.mode.indexOf('o') > -1 || d.mode.indexOf('O') > -1) {
                                    user.mode = exports.UModes.OPER;
                                }
                                else if (d.mode.indexOf('h') > -1 || d.mode.indexOf('H') > -1) {
                                    user.mode = exports.UModes.HALFOPER;
                                }
                                else if (d.mode.indexOf('v') > -1 || d.mode.indexOf('V') > -1) {
                                    user.mode = exports.UModes.VOICE;
                                }
                            }
                            else {
                                user.mode = undefined; // FIXME: acá habría que ver que modos le quedan.
                            }
                            _this.membersChanged.emit({
                                channel: channel_1,
                                users: channelObj.users
                            });
                        }
                        var action = d.modeAdded ? 'agregó' : 'quitó';
                        var mod = d.modeAdded ? '+' : '-';
                        _this.sendSpecialMSG(channelObj, 'Se ' + action + ' el modo "' + mod + d.mode + '" a ' + d.userTarget.nick);
                    }
                }
                else {
                    // modo de canal
                    var channel_2 = d.channelTarget[0] == '#' ? d.channelTarget.substring(1) : d.channelTarget;
                    var channelObj = _this.channels.find(function (chnl) { return chnl.name === channel_2; });
                    if (channelObj) {
                        _this.sendSpecialMSG(channelObj, 'Se cambió el modo del canal: ' + d.mode);
                    }
                }
            });
            this.history = JSON.parse(localStorage.getItem('chan_history'));
            if (!this.history) {
                this.history = {};
            }
        }
        ChannelsService.prototype.saveHistory = function (channel, msg) {
            if (!this.history[channel]) {
                this.history[channel] = [];
            }
            var msC = Object.assign({}, msg);
            msC.fromHistory = true;
            this.history[channel].push(msC);
            localStorage.setItem('chan_history', JSON.stringify(this.history));
        };
        ChannelsService.prototype.getHistory = function (author) {
            return this.history[author];
        };
        ChannelsService.prototype.onChannelList = function (user, channels) {
            var _this = this;
            // actualizamos nuestra lista de canales:
            if (user === this.userSrv.getNick()) {
                // agregamos nuevos canales
                var actualChnls_1 = [];
                channels.forEach(function (channel) {
                    var oldChnl = _this.channels.find(function (chnl) { return chnl.name === channel.name; });
                    if (!oldChnl) {
                        _this.addChannel(channel.name);
                    }
                    actualChnls_1.push(channel.name);
                });
                // buscamos elementos inexistentes
                this.channels.forEach(function (channel, idx) {
                    if (!actualChnls_1.find(function (chName) { return chName === channel.name; })) {
                        _this.channels.splice(idx, 1);
                    }
                });
                this.listChanged.emit(this.channels);
            }
        };
        ChannelsService.prototype.addChannel = function (channel) {
            var nChannel = new ChannelData();
            nChannel.name = channel;
            nChannel.topic = ChannelStatusHandler.getChannelTopic(nChannel.name);
            nChannel.messages = []; // Get from log?
            this.channels.push(nChannel);
            return nChannel;
        };
        ChannelsService.prototype.onUserList = function (channel, users) {
            var channelObj = this.channels.find(function (chnl) { return chnl.name === channel; });
            // si no existe este canal lo agregamos.
            if (!channelObj) {
                channelObj = this.addChannel(channel);
            }
            var actualUsers = [];
            users.forEach(function (currentUser) {
                var oldUser = channelObj.users.find(function (user) { return user.nick === currentUser.nick; });
                if (!oldUser) {
                    var newUser = new User(currentUser.nick);
                    newUser.mode = currentUser.mode;
                    channelObj.users.push(newUser);
                }
                else {
                    oldUser.mode = currentUser.mode;
                }
                actualUsers.push(currentUser.nick);
            });
            // buscamos usuarios que ya no estan
            channelObj.users.forEach(function (user, idx) {
                if (!actualUsers.find(function (acu) { return user.nick === acu; })) {
                    channelObj.users.splice(idx, 1);
                }
            });
            this.membersChanged.emit({ channel: channel, users: channelObj.users });
        };
        ChannelsService.prototype.sendSpecialMSG = function (channel, message) {
            var msg = {
                message: message,
                date: Time.getTime() + ' ' + Time.getDateStr(),
                special: false,
                target: channel.name,
                notify: true
            };
            channel.messages.push(msg);
            this.messagesReceived.emit(msg);
        };
        ChannelsService.prototype.onKick = function (data) {
            if (data.userTarget.nick === this.userSrv.getNick()) {
                this.channels.splice(this.channels.findIndex(function (chan) { return chan.name === data.channel.name; }));
                this.listChanged.emit(this.channels);
            }
            else {
                var chnlObj = this.channels.find(function (chnl) { return chnl.name === data.channel.name; });
                if (chnlObj) {
                    var idx = chnlObj.users.findIndex(function (user) { return user.nick === data.userTarget.nick; });
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
        };
        ChannelsService.prototype.onPart = function (data) {
            if (data.user.nick === this.userSrv.getNick()) {
                this.channels.splice(this.channels.findIndex(function (chan) { return chan.name === data.channel.name; }), 1);
                this.listChanged.emit(this.channels);
            }
            else {
                var chnlObj = this.channels.find(function (chnl) { return chnl.name === data.channel.name; });
                if (chnlObj) {
                    var idx = chnlObj.users.findIndex(function (user) { return user.nick === data.user.nick; });
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
        };
        ChannelsService.prototype.onJoin = function (data) {
            if (data.user.nick === this.userSrv.getNick()) {
                if (!this.channels.find(function (chnl) { return chnl.name === data.channel.name; })) {
                    this.addChannel(data.channel.name);
                }
                this.listChanged.emit(this.channels);
            }
            else {
                var chnlObj = this.channels.find(function (chnl) { return chnl.name === data.channel.name; });
                if (chnlObj) {
                    var newUser = new User(data.user.nick);
                    newUser.mode = data.user.mode;
                    chnlObj.users.push(newUser);
                }
                else {
                    console.error('No se encontró el canal en el que se unió el usuario.', data.channel);
                }
                this.membersChanged.emit({ channel: data.channel.name, users: chnlObj.users });
                this.sendSpecialMSG(chnlObj, data.user.nick + ' se unió al canal');
            }
        };
        ChannelsService.prototype.onNickChanged = function (nick) {
            var _this = this;
            // buscar en la lista de usuarios en cada canal el nick y cambiarlo
            this.channels.forEach(function (chnl) {
                var oldUsr = chnl.users.find(function (usr) { return usr.nick === nick.oldNick; });
                oldUsr.nick = nick.newNick;
                _this.membersChanged.emit({ channel: chnl.name, users: chnl.users });
                _this.sendSpecialMSG(chnl, nick.oldNick + ' se cambió el nick a ' + nick.newNick);
            });
        };
        ChannelsService.prototype.onTopicUpdate = function (channel, newTopic) {
            if (channel[0] === '#') {
                channel = channel.substring(1);
            }
            var chnlObj = this.channels.find(function (chnl) { return chnl.name === channel; });
            if (chnlObj) {
                chnlObj.topic = newTopic;
            }
            else {
                console.error('No se encontró el canal en el que se cambió el topic. ', channel);
            }
        };
        ChannelsService.prototype.getChannels = function () {
            return this.channels;
        };
        ChannelsService.prototype.getChannel = function (channel) {
            return this.channels.find(function (chanObj) { return chanObj.name == channel; });
        };
        ChannelsService.prototype.onMessageReceived = function (message) {
            if (message.messageType == exports.IndividualMessageTypes.CHANMSG) {
                var tgtChan_1 = message.channel[0] == '#' ? message.channel.substring(1) : message.channel;
                var chanObj = this.channels.find(function (chan) { return chan.name == tgtChan_1; });
                var msg = {
                    message: message.message,
                    messageWithMetadata: PostProcessor.processMessage(message.message, message.author, this.userSrv.getNick()),
                    author: new Author(message.author),
                    date: message.date + ' ' + message.time,
                    special: message.meAction,
                    target: tgtChan_1
                };
                chanObj.messages.push(msg);
                this.messagesReceived.emit(msg);
                this.saveHistory(tgtChan_1, msg);
            }
        };
        return ChannelsService;
    }());
    ChannelsService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ChannelsService_Factory() { return new ChannelsService(i0.ɵɵinject(UserInfoService)); }, token: ChannelsService, providedIn: "root" });
    ChannelsService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    ChannelsService.ctorParameters = function () { return [
        { type: UserInfoService }
    ]; };

    var PrivmsgData = /** @class */ (function () {
        function PrivmsgData() {
            this.messages = [];
        }
        return PrivmsgData;
    }());

    var PrivmsgService = /** @class */ (function () {
        function PrivmsgService(userSrv) {
            this.userSrv = userSrv;
            this.messagesReceived = new i0.EventEmitter();
            this.newPrivOpened = new i0.EventEmitter();
            this.closedPriv = new i0.EventEmitter();
            this.privMsgs = {};
            MessageHandler.setHandler(this);
            this.history = JSON.parse(localStorage.getItem('pv_history'));
            if (!this.history) {
                this.history = {};
            }
        }
        PrivmsgService.prototype.onMessageReceived = function (message) {
            if (message.messageType == exports.IndividualMessageTypes.PRIVMSG) {
                var msgAuthor = message.privateAuthor ? message.privateAuthor : message.author;
                var msg = {
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
        };
        PrivmsgService.prototype.saveHistory = function (author, msg) {
            if (!this.history[author]) {
                this.history[author] = [];
            }
            var msC = Object.assign({}, msg);
            msC.fromHistory = true;
            this.history[author].push(msC);
            localStorage.setItem('pv_history', JSON.stringify(this.history));
        };
        PrivmsgService.prototype.getHistory = function (author) {
            return this.history[author];
        };
        PrivmsgService.prototype.getPrivate = function (nick) {
            if (!this.privMsgs[nick]) {
                this.privMsgs[nick] = new PrivmsgData();
                this.privMsgs[nick].user = nick;
                this.newPrivOpened.emit(nick);
            }
            return this.privMsgs[nick];
        };
        PrivmsgService.prototype.closePrivate = function (nick) {
            delete this.privMsgs[nick];
            this.closedPriv.emit(nick);
        };
        return PrivmsgService;
    }());
    PrivmsgService.ɵprov = i0.ɵɵdefineInjectable({ factory: function PrivmsgService_Factory() { return new PrivmsgService(i0.ɵɵinject(UserInfoService)); }, token: PrivmsgService, providedIn: "root" });
    PrivmsgService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    PrivmsgService.ctorParameters = function () { return [
        { type: UserInfoService }
    ]; };

    var ServerMsgService = /** @class */ (function () {
        function ServerMsgService() {
            var _this = this;
            this.messages = [];
            this.newMessage = new i0.EventEmitter();
            ServerHandler.serverResponse.subscribe(function (d) {
                _this.messages.push(d);
                _this.newMessage.emit(d);
            });
            ServerHandler.serverNoticeResponse.subscribe(function (d) {
                _this.messages.push(d);
                _this.newMessage.emit(d);
            });
        }
        return ServerMsgService;
    }());
    ServerMsgService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ServerMsgService_Factory() { return new ServerMsgService(); }, token: ServerMsgService, providedIn: "root" });
    ServerMsgService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    ServerMsgService.ctorParameters = function () { return []; };

    var WhoStatusService = /** @class */ (function () {
        function WhoStatusService() {
            var _this = this;
            this.whoStatus = {};
            WhoHandler.onWhoResponse.subscribe(function (dW) {
                _this.whoStatus[dW.nick] = dW;
            });
        }
        WhoStatusService.prototype.isAway = function (nick) {
            if (this.whoStatus[nick] && this.whoStatus[nick].isAway) {
                return true;
            }
            return false;
        };
        return WhoStatusService;
    }());
    WhoStatusService.ɵprov = i0.ɵɵdefineInjectable({ factory: function WhoStatusService_Factory() { return new WhoStatusService(); }, token: WhoStatusService, providedIn: "root" });
    WhoStatusService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    WhoStatusService.ctorParameters = function () { return []; };

    /*
     * Public API Surface of ircore
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.Author = Author;
    exports.AvatarHelper = AvatarHelper;
    exports.Away = Away;
    exports.AwayHandler = AwayHandler;
    exports.Channel = Channel;
    exports.ChannelAndUserList = ChannelAndUserList;
    exports.ChannelData = ChannelData;
    exports.ChannelInfo = ChannelInfo;
    exports.ChannelListHandler = ChannelListHandler;
    exports.ChannelStatusHandler = ChannelStatusHandler;
    exports.ChannelTopicUpdate = ChannelTopicUpdate;
    exports.ChannelUserList = ChannelUserList;
    exports.ChannelsService = ChannelsService;
    exports.ChannelsTopic = ChannelsTopic;
    exports.ConnectionStatusData = ConnectionStatusData;
    exports.EmoteList = EmoteList;
    exports.GenericMessage = GenericMessage;
    exports.GmodeHandler = GmodeHandler;
    exports.IRCMessage = IRCMessage;
    exports.IRCParserV2 = IRCParserV2;
    exports.IRCoreModule = IRCoreModule;
    exports.IRCoreService = IRCoreService;
    exports.IgnoreHandler = IgnoreHandler;
    exports.IndividualMessage = IndividualMessage;
    exports.Join = Join;
    exports.JoinHandler = JoinHandler;
    exports.KickHandler = KickHandler;
    exports.KickInfo = KickInfo;
    exports.ListHandler = ListHandler;
    exports.MessageData = MessageData;
    exports.MessageHandler = MessageHandler;
    exports.MessageWithMetadata = MessageWithMetadata;
    exports.ModeHandler = ModeHandler;
    exports.ModeratedHandler = ModeratedHandler;
    exports.MotdHandler = MotdHandler;
    exports.NewMode = NewMode;
    exports.NickChange = NickChange;
    exports.OriginData = OriginData;
    exports.Part = Part;
    exports.PartHandler = PartHandler;
    exports.PostProcessor = PostProcessor;
    exports.PrivmsgData = PrivmsgData;
    exports.PrivmsgService = PrivmsgService;
    exports.Quit = Quit;
    exports.QuitHandler = QuitHandler;
    exports.Quote = Quote;
    exports.QuoteMessage = QuoteMessage;
    exports.ServerHandler = ServerHandler;
    exports.ServerMsgService = ServerMsgService;
    exports.StatusHandler = StatusHandler;
    exports.Time = Time;
    exports.UpdateChannelList = UpdateChannelList;
    exports.User = User;
    exports.UserChannelList = UserChannelList;
    exports.UserInChannel = UserInChannel;
    exports.UserInfoService = UserInfoService;
    exports.UserWithMetadata = UserWithMetadata;
    exports.UsersHandler = UsersHandler;
    exports.UsersWhos = UsersWhos;
    exports.ValidRegex = ValidRegex;
    exports.WebSocketUtil = WebSocketUtil;
    exports.Who = Who;
    exports.WhoDatas = WhoDatas;
    exports.WhoHandler = WhoHandler;
    exports.WhoIsData = WhoIsData;
    exports.WhoIsHandler = WhoIsHandler;
    exports.WhoStatusService = WhoStatusService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ircore.umd.js.map
