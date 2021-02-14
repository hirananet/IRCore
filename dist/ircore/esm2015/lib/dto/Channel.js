import { UModes } from '../utils/UModes.utils';
export class Channel {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9hbGV4YS9naXQvSVJDb3JlL3Byb2plY3RzL2lyY29yZS9zcmMvIiwic291cmNlcyI6WyJsaWIvZHRvL0NoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRS9DLE1BQU0sT0FBTyxPQUFPO0lBS2xCLFlBQVksT0FBZTtRQUN6QixJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQzNCLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdCO2FBQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN6QixPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QjthQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDeEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDN0I7YUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQzVCLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdCO2FBQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN6QixPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QjtRQUNELElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0I7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztTQUNyQjtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVNb2RlcyB9IGZyb20gJy4uL3V0aWxzL1VNb2Rlcy51dGlscyc7XG5cbmV4cG9ydCBjbGFzcyBDaGFubmVsIHtcbiAgY2hhbm5lbDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIG1vZGU6IFVNb2RlcztcblxuICBjb25zdHJ1Y3RvcihjaGFubmVsOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hhbm5lbFswXSA9PT0gJ34nKSB7XG4gICAgICB0aGlzLm1vZGUgPSBVTW9kZXMuRk9VTkRFUjtcbiAgICAgIGNoYW5uZWwgPSBjaGFubmVsLnN1YnN0cigxKTtcbiAgICB9IGVsc2UgaWYgKGNoYW5uZWxbMF0gPT09ICcmJykge1xuICAgICAgdGhpcy5tb2RlID0gVU1vZGVzLkFETUlOO1xuICAgICAgY2hhbm5lbCA9IGNoYW5uZWwuc3Vic3RyKDEpO1xuICAgIH0gZWxzZSBpZiAoY2hhbm5lbFswXSA9PT0gJ0AnKSB7XG4gICAgICB0aGlzLm1vZGUgPSBVTW9kZXMuT1BFUjtcbiAgICAgIGNoYW5uZWwgPSBjaGFubmVsLnN1YnN0cigxKTtcbiAgICB9IGVsc2UgaWYgKGNoYW5uZWxbMF0gPT09ICclJykge1xuICAgICAgdGhpcy5tb2RlID0gVU1vZGVzLkhBTEZPUEVSO1xuICAgICAgY2hhbm5lbCA9IGNoYW5uZWwuc3Vic3RyKDEpO1xuICAgIH0gZWxzZSBpZiAoY2hhbm5lbFswXSA9PT0gJysnKSB7XG4gICAgICB0aGlzLm1vZGUgPSBVTW9kZXMuVk9JQ0U7XG4gICAgICBjaGFubmVsID0gY2hhbm5lbC5zdWJzdHIoMSk7XG4gICAgfVxuICAgIGlmIChjaGFubmVsWzBdID09PSAnIycpIHtcbiAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgICB0aGlzLm5hbWUgPSBjaGFubmVsLnN1YnN0cigxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGFubmVsID0gJyMnICsgY2hhbm5lbDtcbiAgICAgIHRoaXMubmFtZSA9IGNoYW5uZWw7XG4gICAgfVxuICB9XG59XG4iXX0=