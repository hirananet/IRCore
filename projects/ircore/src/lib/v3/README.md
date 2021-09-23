# IRCore

Angular IRC Core services.

This library is an IRC client for Angular/typescript, uses websocket or kiwiircgateway for connections.
Most of the events are handled in two ways, one is using Observer pattern via static handlers classes, and another is using angular services.

This library works fine with Inspircd and Anope (not tested this version in atheme).

# Services

# Event Handling

this.chanSrv.notifications

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
* notice: external notice in channel.

# IRCParser V3

## Extensions
