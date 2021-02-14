/**
 * clase para manejar los cambios de estado de un canal, como el topic y los modos.
 */
import { EventEmitter } from '@angular/core';
// @dynamic
export class ChannelStatusHandler {
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
export class ChannelsTopic {
}
export class ChannelTopicUpdate {
    constructor(channel, newTopic) {
        this.channel = channel;
        this.newTopic = newTopic;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbFN0YXR1cy5oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL2FsZXhhL2dpdC9JUkNvcmUvcHJvamVjdHMvaXJjb3JlL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9oYW5kbGVycy9DaGFubmVsU3RhdHVzLmhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFFSCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdDLFdBQVc7QUFDWCxNQUFNLE9BQU8sb0JBQW9CO0lBS3hCLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBZSxFQUFFLEtBQWE7UUFDMUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDckMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFTSxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQWU7UUFDM0MsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQWU7UUFDeEMsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQWtCLENBQUM7UUFDM0QsUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBbUI7UUFDMUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7QUF0QnVCLG1DQUFjLEdBQWtCLEVBQUUsQ0FBQztBQUNwQyx5Q0FBb0IsR0FBcUMsSUFBSSxZQUFZLEVBQXNCLENBQUM7QUF5QnpILE1BQU0sT0FBTyxhQUFhO0NBRXpCO0FBRUQsTUFBTSxPQUFPLGtCQUFrQjtJQUc3QixZQUFZLE9BQWUsRUFBRSxRQUFnQjtRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGNsYXNlIHBhcmEgbWFuZWphciBsb3MgY2FtYmlvcyBkZSBlc3RhZG8gZGUgdW4gY2FuYWwsIGNvbW8gZWwgdG9waWMgeSBsb3MgbW9kb3MuXG4gKi9cblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8vIEBkeW5hbWljXG5leHBvcnQgY2xhc3MgQ2hhbm5lbFN0YXR1c0hhbmRsZXIge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGNoYW5uZWxzVG9waWNzOiBDaGFubmVsc1RvcGljID0ge307XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgY2hhbm5lbFRvcGljUmVzcG9uc2U6IEV2ZW50RW1pdHRlcjxDaGFubmVsVG9waWNVcGRhdGU+ID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFubmVsVG9waWNVcGRhdGU+KCk7XG5cbiAgcHVibGljIHN0YXRpYyBzZXRDaGFubmVsVG9waWMoY2hhbm5lbDogc3RyaW5nLCB0b3BpYzogc3RyaW5nKSB7XG4gICAgdGhpcy5jaGFubmVsc1RvcGljc1tjaGFubmVsXSA9IHRvcGljO1xuICAgIHRoaXMuY2hhbm5lbFRvcGljUmVzcG9uc2UuZW1pdChuZXcgQ2hhbm5lbFRvcGljVXBkYXRlKGNoYW5uZWwsIHRvcGljKSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldENoYW5uZWxUb3BpYyhjaGFubmVsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1RvcGljc1tjaGFubmVsXTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZmluZENoYW5uZWxzKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICBsZXQgY2hhbm5lbHMgPSAvIyhbXlxcc10rKS9nLmV4ZWMobWVzc2FnZSkgYXMgQXJyYXk8c3RyaW5nPjtcbiAgICBjaGFubmVscyA9IGNoYW5uZWxzLnNsaWNlKDEpO1xuICAgIHJldHVybiBjaGFubmVscztcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgc2V0SGFuZGxlcihoZGxyOiBPblRvcGljVXBkYXRlKSB7XG4gICAgdGhpcy5jaGFubmVsVG9waWNSZXNwb25zZS5zdWJzY3JpYmUodG9waWMgPT4ge1xuICAgICAgaGRsci5vblRvcGljVXBkYXRlKHRvcGljLmNoYW5uZWwsIHRvcGljLm5ld1RvcGljKTtcbiAgICB9KTtcbiAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBDaGFubmVsc1RvcGljIHtcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQ2hhbm5lbFRvcGljVXBkYXRlIHtcbiAgY2hhbm5lbDogc3RyaW5nO1xuICBuZXdUb3BpYzogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihjaGFubmVsOiBzdHJpbmcsIG5ld1RvcGljOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuICAgIHRoaXMubmV3VG9waWMgPSBuZXdUb3BpYztcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9uVG9waWNVcGRhdGUge1xuICBvblRvcGljVXBkYXRlKGNoYW5uZWw6IHN0cmluZywgbmV3VG9waWM6IHN0cmluZyk7XG59XG4iXX0=