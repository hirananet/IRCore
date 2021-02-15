# IRCore

Angular IRC Core services.

This library is an IRC client for Angular/typescript, uses websocket or kiwiircgateway for connections.
Most of the events are handled in two ways, one is using Observer pattern via static handlers classes, and another is using angular services.

This library works fine with Inspircd and Anope (not tested this version in atheme).

## IRCoreService

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/IRCore.service.ts

IRCoreService is an interface for send commands and connect, you can inject in constructor, for example:

```constructor(private ircSrv: IRCoreService) {}```

You can connect usin websockets:

```this.ircSrv.connect('wss://location');```

This works only if the IRC Server supports Websockets, if not, you need to use a gateway, for example, kiwii webircgateway https://github.com/kiwiirc/webircgateway

Once you connect, WebSocketUtils emits a event on "statusChanged", you can use to send handshake (nick or host in irc gateway): 

```
const subscription_status_b = WebSocketUtil.statusChanged.subscribe(status => {
  if(status.status == ConnectionStatus.CONNECTED) {
    // if is websocket directly:
    this.ircSrv.handshake(this.nick, this.nick);
    // if is using gateway:
    // this.ircSrv.handshake(this.nick, this.nick, this.host); // in this case, host is the final network, for example irc.freenode.net and in the ircSrv.connect put the webircgateway location
  }
});
```

You may receive a Nick already in use, you can handle this event:

```
StatusHandler.nickAlreadyInUse.subscribe(d => {
  this.ircSrv.setNick('NewNickAlternative');
});
```

You can handle MOTD:

```MotdHandler.motdResponse.subscribe((d: IRCMessage) => {```

And ZNC or bouncer password request:

```MotdHandler.requirePasswordResponse.subscribe((d: IRCMessage) => {```

You can use this service to send commands: 

* this.ircSrv.identify('PASSWORD') => /ns identify PASSWORD
* this.ircSrv.serverPass('PASSWORD') => /PASS PASSWORD
* this.ircSrv.setNick('NewNick') => /nick NewNick
* this.ircSrv.sendWhox('channel'); => /who channel
* this.ircSrv.join('channel'); => /join channel
* this.ircSrv.sendMessageOrCommand('command/message', <optional>'channel/user');
* this.ircSrv.disconnect(); // disconnect
* this.ircSrv.getWS(); // get websocket


### WebSocketUtil

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/utils/WebSocket.util.ts

The websocketutil class handle connection statuses and socket connection, you can check if i'm connected using static method:

```WebSocketUtil.isConnected();```

or handle connection status changed using observer:

```WebSocketUtil.statusChanged.subscribe((status: ConnectionStatusData<any>) => {```

And you can get raw messages from this observer:

```WebSocketUtil.messageReceived```

## IRCParserV2

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/IRCParserV2.ts

Once you connected, IRCParser subscribes to WebSocketUtil.messageReceived and parse any message received, then send events to all handlers:

### Handlers:

#### ChannelListHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/ChannelList.handler.ts

List of users channels, this handle the list of channels of each user.

Save the list of channel in associative array: uChannelList['Nick']: Channel[]

And emit when list of user change:

channelListUpdated

#### ListHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/List.handler.ts

Handle the /list response command, and saving static array with list of channels, additionally have event to announce a new list.

```
public static readonly channelListCreated: EventEmitter<ChannelInfo[]> = new EventEmitter<ChannelInfo[]>();
public static getChannelList(): ChannelInfo[]
```

#### StatusHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Status.handler.ts

Handle events of NickAlreadyInUse (my nick is in use, request to change), banned of channel (users banned), nickChanged (other users nick changed)

#### JoinHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Join.handler.ts

Handle the joins events, me joins and others joins.

#### PartHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Part.handler.ts

Handle the leaves of channels events.

#### QuitHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Quit.handler.ts

Handle the global quit user (disconnections of users) event.

#### KickHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Kick.handler.ts

Handle the kick of channels

#### MessageHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Message.handler.ts

Handle messages receiveds on private and channels, and handle /me messages

#### ModeHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Mode.handler.ts

Handle channel and users mode changes.

#### ChannelStatusHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/ChannelStatus.handler.ts

Handle topic of channel changes.

#### ServerHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Server.handler.ts

Handle notices and servers unclassified messages. (Uknown codes and others)

#### ModeratedHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Moderated.handler.ts

Handle message of "this channel is in moderated mode"

#### IgnoreHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Ignore.Handler.ts

Handle server ignores of private messages

#### GmodeHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Gmode.handler.ts

Handle /umode +g (request accept to private messages), this handler emit events when a request is received.

#### MotdHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Motd.handler.ts

Handle message of the day received and require passwords in ZNC (or bouncers).

#### UsersHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Users.handler.ts

Handle users in channel (list of users at join)

#### AwayHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Away.handler.ts

Handle response of away in private message.

#### WhoHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Who.handler.ts

Response of who command handler.

#### WhoisHandler

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/handlers/Whois.handler.ts

Response of whois command handler

## ChannelsService

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/services/channels.service.ts

This service handle my list of channels, and users in this channels, you can get channels, (array with objects with more arrays and fully data of users, channel data (as topic), etc.).

You can use sendSpecialMSG to simulate received message (this is useful when you send message and need to simulate "receive" this message to show in chat box).

You can also save history of message using saveHistory method (this use localstorage).

have 3 events:

### listChanged
when the list of channels changes (because a join, kicked, parted)

### membersChanged
When the members in channels changed (because a other user joins, kicked, parted)

### messagesReceived
When channel receive message.

## PrivmsgService

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/services/privmsg.service.ts

This works as ChannelsService but for private messages, handle list of private chats opened, messages, etc.

You can use this methods:

```getPrivate(nick: string): PrivmsgData```

```closePrivate(nick: string): void```

and history as ChannelsServices (using localstorage)

have 3 events:

### messagesReceived
Emitted when private message received

### newPrivOpened
Emitted when private opened (by receiving a first private message of any user)

### closedPriv
Emitted when closePrivate method is called (this method is for clear data of private message).

## ServerMsgService

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/services/server-msg.service.ts

This service is used to store and announce of server messages (or unclassified messages, stranges codes, notice, etc.)

## UserInfoService

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/services/user-info.service.ts

This is useful to see current nick, using getNick(), NOT change the nick from this clase, use IRCoreService to send /nick command.

## WhoStatusService

https://github.com/hirananet/IRCore/blob/main/projects/ircore/src/lib/services/who-status.service.ts

Have info about users, you can use the instance of this service:

```construct(private whoSrv: WhoStatusService) {}```

```this.whoSrv.isAway('nick'): boolean```

or 

```this.whoSrv.whoStatus['nick']: Who```

(You can see if is netOp, isAway, user modes, etc)

