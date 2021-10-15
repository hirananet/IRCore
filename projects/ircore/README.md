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

- `public sendChannelMSG(serverID: string, channel: string, message: string): void`
  Send message to channel, is not necessary to add # in channel name.

- `public sendTo(serverID: string, chanOrNick: string, message: string): void`
  Send message to channel or privmessage, in this case you need to add # in channels

- `public getCurrentNick(serverID: string): string`
  Get the current nick, this change for example when global op use /sanick in you.

- `public static getServerData(id: string): ServerData `
  This is for globally find ServerData of serverID without inject the service instance.

# Event Handling

### this.notices.notifications

types:
* motd: message of te day received.
* require-pass: 464 (usually for znc logins).
* notice: global notice message recived.
* uknown: no listener for this message code.
* pong: pong command received.
* nick-in-use: this nick is in use

### this.channels.notifications

types:
* message: new message in channel
* user-mode: User mode changed in channel
* chan-mode: channel mode changed
* nick-changed: all-channels user change nick
* topic: topic changed
* channels: list of channels of me updated
* names: response to command names. (users in channel)
* kick: user kicked from channel
* new-channel: me joined to new channel
* join: user joined to channel
* close-channel: me parted from channel
* leave: user leaved channel
* banned: from channel
* channel-moderated: channel is in moderated mode.
* notice: external notice in channel.

### this.privs.notifications

types:
* message: private message
* non-existant: message to non existant nick or channel
* sside-ignored: server side ignore.
* away: away message
* gmode: is messaging you, and you have user mode +g set.

# IRCParser V3

## Extensions
