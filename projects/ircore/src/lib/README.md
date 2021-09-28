# IRCore

Angular IRC Core services.

This library is an IRC client for Angular/typescript, uses websocket or kiwiircgateway for connections.
Most of the events are handled in two ways, one is using Observer pattern via static handlers classes, and another is using angular services.

This library works fine with Inspircd and Anope (not tested this version in atheme).

# Services

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
