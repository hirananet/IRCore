# IRCore

Angular IRC Core services v3.

This library is an IRC client for Angular/typescript, uses websocket or kiwiircgateway for connections.
Most of the events are handled in two ways, one is using Observer pattern via static handlers classes, and another is using angular services.

This library works fine with Inspircd and Anope (not tested this version in atheme).

# Services

## ServerService

This service is for handle global server connections and commands, can connect/disconnect/reconnect, send sample commands as join, leave, set, etc.

### Usage example:

```
constructor(private readonly notySrv: NoticesService, private readonly serverSrv: ServerService) {
  const srvData = new ServerData();
  srvData.ircServer = 'irc.hirana.net';
  srvData.ircPort = 443;
  srvData.user.nick = this.nick2;
  srvData.user.altNick = this.nick2+'_';
  srvData.user.user = this.nick2;
  srvData.user.password = this.password;
  srvData.user.identify = true;
  srvData.withWebSocket = true;
  srvData.withSSL = true;
  srvData.serverID = 'RANDOM-UUID-FOR-MULTIPLE-SERVER-CONNECTION-HANDLING';

  serverSrv.connect(server: ServerData);
  this.notySrv.notifications.subscribe(d => {
    if(d.type == 'endMotd') {
      serverSrv.join(srvData.serverID, '#channel');
      serverSrv.setNick(srvData.serverID, 'NewNick');
    }
  });
}
```
### List of methods:

- `public connect(server: ServerData): void`

  Connect to a server using ServerData object.

- `public sendWhox(serverID: string, channel: string): void`

  Send Who command to channel

- `public join(serverID: string, channel: string): void`

  Join to a channel, you can pass the channel with and without # for example .join('sid', '#main') .join('sid', 'main').
  But if you want to join to a channel starting with two #, you need to write both numerals: .join('sid', '##espanol')

- `public leave(serverID: string, channel: string): void`

  Leave channel same format that join (you can pass the channel with and without # for example .leave('sid', '#main') .leave('sid', 'main'))

- `public setNick(serverID: string, nick: string): void`

  Change nick, is **important** you use this function and not send raw command /nick, because this function set the nick internally to detect if the people is chatting with us and other validations.

- `public identify(serverID: string, password: string): void`

  Alias for /ns identify command to login with current nick.

- `public serverPass(serverID: string, user: string, password: string): void`

  Alias for /PASS
  This is used to send /PASS command with password for bouncers.

- `public disconnect(serverID: string): void `

  Disconnect from the server

- `public reconnect(serverID: string): void`

  This reconnect to serverID, and not break any previous subscriptions, 
  I mean, if you are subscripted to events even with deep websocket event emitters
  for example this.coreSrv.getServerData('SERVID').websocket.onStatusChanged().subscribe(status=>{})
  the subscriptions will continue to work after calling reconnect.

- `public getServerById(id: string): ServerData`

  Get the ServerData by server id

- `public requestChannelList(serverID: string): void`

  Alias for /list command

- `public getServerByIrcServer(ircServer: string): ServerData | undefined `

  Search ServerData by irc server host, for example irc.hirana.net

- `public sendToServer(serverID: string, raw: string): void`

  Send raw command to serverID, for example you can use .sendToServer('SERVID', 'PART #channel')
  Don't use this command to change your nick, please use .setNick()

- `public sendPrivMSG(serverID: string, nick: string, message: string): void`

  Send private message to nick
  This command adds the message to private service messages list.

- `public sendChannelMSG(serverID: string, channel: string, message: string): void`

  Send message to channel, is not necessary to add # in channel name.
  This command adds the message to channel service messages list.

- `public sendTo(serverID: string, chanOrNick: string, message: string): void`

  Send message to channel or privmessage, in this case you need to add # in channels

- `public getCurrentNick(serverID: string): string`

  Get the current nick, this change for example when global op use /sanick in you.

- `public static getServerData(id: string): ServerData `

  This is for globally find ServerData of serverID without inject the service instance.

## NoticesService

This service is used to handle global server notices, as MOTD, and responses of commands, it save capability list and global notices message list.

### List of methods:

- `public getCaps(serverID: string): string[]`

  Get capability list of serverID (response of /CAP).

- `public getNotices(serverID: string): {msg: string, isNotice: boolean}[]`

  Get list of notices messages received in serverID, this list is a reference, when new message is comming, is it added using push.
  You can use the response of this command in ngFor for example, and is automatically updated when new messages is added.
  The isNotice boolean indicated that the message received is using exactly code: 'NOTICE' not another code number.

## ListService

This service is used to handle /LIST command response (list of all channels in the server), it has a list of channels.

### List of methods

- `public getList(serverID: string): ChannelListData[]`

  This get a list of channels, is a reference, then when new channels are added this list is expanded, when a channel is removed, this list decrease. You can use this list in ngFor.

## GlobUserService

This service save the global data of users, as ip, nick, realName, usermodes (for example G for ignore privates), isAway, etc.
Catches the response of who, and similar commands to full the information about a nick

### List of methods

- `public getUser(serverID: string, nick: SimplyUser): UserData`

  Get the user data of nick in a server:

  ```
  class UserData {
    public fullNick: FullNick = new FullNick();
    public server?: string;
    public netOp: boolean = false;
    public realName?: string;
    public modes?: string[]; // user modes
    public ssl: boolean = false;
    public registeredNick?: string;
    public isAway: boolean = false;
    public idle?: number;
    public lastLogin?: number;
    public account?: string;
    public chanModes: {[channelID: string]: string[]} = {};
  }
  ```

## ChannelService

This service is designed to handle channels, the messages, users in channel, notifications, etc.

### Example of usage

```
  constructor(private readonly channelsSrv: ChannelsService) {
    channelsSrv.getChannel('SRVID', new Channel('Channel'));
  }
```
**We recommends you use new Channel(myChannel) to pass the channel parameter in order to sanitize formats**

### List of methods

- `public getChannel(serverID: string, channel: Channel): Channel`

  Get the channel and the data:

  ```
  class Channel {
    public name: string;
    public hashedName: string;
    public users: UserData[] = [];
    public topic?: string;
    public channelModes: string[] = [];
    public messages: Message[] = [];
  }
  ```

- `public getChannelList(serverID: string): Channel[]`

  Get all channels opened in a server

- `public enableAutoSave(): void`

  Enable autosave of messages in indexedDB, and if you call this function before to connect, then when is connected to a server, this try to load old messages from indexedDB using serverID (for this reason, we recommends to you to use hashed server host as serverID in order to coincide the hashes in diferent sessions for the same server host, for example: `serverID = hash('irc.hirana.net')`)

  By default, this feature is disabled.

- `public disableAutoSave(): void`

## PrivsService

This service is designed to handle private messages, and list of privs.

### List of methods

- `public getChat(serverID: string, chatName: string): PrivChat`

  Get a private chat between you and another user.
  chatName is the name of the another user of server.
  ```
  class PrivChat {
    public name?: string;
    public target?: UserData;
    public messages: Message[] = [];
  }
  ```

- `public removePriv(serverID: string, chatName: string): boolean`

  Remove a chat from the chat list, and return true or folse if exists and removed or not exists.

- `public getChats(serverID: string): PrivChat[]`

  Get the list of private chats.


- `public enableAutoSave(): void`

  Enable autosave of messages in indexedDB, and if you call this function before to connect, then when is connected to a server, this try to load old messages from indexedDB using serverID (for this reason, we recommends to you to use hashed server host as serverID in order to coincide the hashes in diferent sessions for the same server host, for example: `serverID = hash('irc.hirana.net')`)

  By default, this feature is disabled.

- `public disableAutoSave(): void`


# Event Handling

## Introduction

All of the services has notification event emitter, in order to subscribe to events of type of the service, you can simply use some like this:

```
constructor(private readonly noticesSrv: NoticesService) {
  notiesSrv.notifications.subscribe(e => {
    if(e.type == 'nick-changed') {
      // do some stuff here.
    }
  })
}
```

## NoticesService Emitter

### Definition

The event emitter has this structure:

```
{
  raw: RawMessage,
  type: string,
  parsedObject?: any
}
```

### MOTD event

Type: 'motd'

ParsedObject: <Void>

Trigger: code 375, the first line of MOTD

### END MOTD event

Type: 'endMotd'

ParsedObject: <void>

Trigger: code 376, the last line of MOTD

### Require pass event

Type: 'require-pass'

ParsedObject: <void>

Trigger: code 464, usually sended by BNC to request /PASS command.

### Nick in use event

Type: 'nick-in-use'

ParsedObject: {}

Trigger: code 433, when you try to set a nick in use.

### Nick changed

Type: 'nick-changed'

ParsedObject: Nicks

Nicks:
```
{
  originalNick: SimplyUser,
  newNick: <string>
}
```

Trigger: code NICK, when any user change it nick

### Notice event

Type: 'notice'

ParsedObject: <void>

Trigger: code NOTICE, when a message with "NOTICE" received (not triggered if it is a external notice to channel)

### Whois start:

Type: 'whois-start'

PrsedObject: <void>

Trigger: code 311, first message in response of whois command.

### Uknown message:

Type: 'uknown'

ParsedObject: <void>

Trigger: all messages with a not known code. (like 666)

## ChannelsService Emitter

### Definition:

The event emitter has this structure:

```
{
  raw: RawMessage,
  type: string,
  parsedObject?: any
}
```

### Message received:

Type: 'message'

ParsedObject: <Message> (projects/ircore/src/lib/domain/message.ts)

Trigger: PRIVMS to target starting with # received.

### Usermode:

Type: 'user-mode'

ParsedObject: ModeParsed

ModeParsed:
```
{
  user: SimplyUser{nick, mode: UModes}
  channel: Channel{name, hashedName}
  add: Boolean (mode added or removed)
  mode: The mode code (for example "v")
}
```
Trigger: /mode command targetting user

### Chanmode:

Type: 'chan-mode'

ParsedObject: ModeParsed

ModeParsed:
```
{
  channel: Channel{name, hashedName}
  mode: The mode code (for example "m")
}
```

Trigger: /mode command targetting channel

### Channel moderated:

Type: 'channel-moderated'

ParsedObject: <void> // TODO: get the channel

Trigger: code 404, when you try to chat in a moderated channel

### Channel topic:

Type: 'topic'

ParsedObject: {channel: Channel, topic: string}

Trigger: code TOPIC, when a channel changes it topic.

### Banned

Type: 'banned'

ParsedObject: <void> // TODO: get the channel

Trigger: when you are banned from a channel.

### Channel list

Type: 'channels'

parsedObject: Channel[]

Trigger: code 319, channels opened.

### Names response /names #channel

Type: 'names'

parsedObject: string[]

Trigger: code 353 command /names response.

### Kicked

Type: 'kick'

parsedObject: {channel: Channel, operator: string, userKicked: SimplyUser}

Trigger: code KICK, when a user is kicked from chanel (can be you).

### New channel

Type: 'new-channel'

parsedObject: {channel: Channel, userJoined: SimplyUser}

Trigger: code JOIN, when you are joined to channel, (by you using /join, or by an operator using /sajoin)

### Join

Type: 'join'

parsedObject: {channel: Channel, userJoined: SimplyUser}

Trigger: code JOIN, when a user (not you) join to a channel.

### Close channel

Type: 'close-channel'

parsedObject: {channel: Channel, userParted: SimplyUser}

Trigger: code PART, when you parted a channel.

### Leave channel

Type: 'leave'

parsedObject: {channel: Channel, userParted: SimplyUser, message: string}

Trigger: code PART, when a user (not you) leave a channel

### Notice:

Type: 'notice'

parsedObject: {channel: Channel, author: string, content: string}

Trigger: when a channel received external message as NOTICE.

## PrivsService emitter

### Definition

The event emitter has this structure:

```
{
  raw?: RawMessage,
  type: string,
  parsedObject?: any
}
```

### Message

Type: 'message'

parsedObject: <Message>

Trigger: when a privmsg is received.

### Server side ignored

Type: 'sside-ignored'

ParsedObject: {author: string, message: string}

Trigger: code 716, when you send message to a user that ignores you.

### Non Existant 

Type: 'non-existant'

ParsedObject: {author: string, message: string}

Trigger: code 401, when you send message to a nick that doesn't exists.

### away

Type: 'away'

ParsedObject: {author: string, message: string}

Trigger: code 301, when you send a message to a user that is in away mode.

### gmode

Type: 'gmode'

ParsedObject: {author: string}

Trigger: code 718, when you receive a message in +g mode (you need to accept that user in order to receive messages):

```:avalon.hira.io 718 Tulkalex Tulkaz ~Harkito@net-j7j.cur.32.45.IP :is messaging you, and you have user mode +g set.
Use /ACCEPT +Tulkaz to allow.```

### New private:

Type: 'new-priv'

ParsedObject: {chatName: string, serverID: string}

Trigger: when you received a message of another user for first time.

### this.ListService.notifications

types:
* start-list: initialized new list of channels
* end-list: end of command /LIST and in parsedObject you get the list of channels reference (same than .getList(serverID))

# IRCParser V3

## Extensions
*
