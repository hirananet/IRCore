import { EventEmitter } from '@angular/core';
/*
  Clase para manejar el estado de los usuarios (si está away, es netop, de donde se conecta, etc.)
*/
// @dynamic
export class WhoHandler {
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
export class UsersWhos {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2hvLmhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvYWxleGEvZ2l0L0lSQ29yZS9wcm9qZWN0cy9pcmNvcmUvc3JjLyIsInNvdXJjZXMiOlsibGliL2hhbmRsZXJzL1doby5oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHN0M7O0VBRUU7QUFDRixXQUFXO0FBQ1gsTUFBTSxPQUFPLFVBQVU7SUFLZCxNQUFNLENBQUMsVUFBVSxDQUFDLElBQVksRUFBRSxJQUFTO1FBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQzVCO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztTQUNsRDtRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFZO1FBQ25DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFlO1FBQ3pDLE9BQU8sOEdBQThHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RJLENBQUM7O0FBdkJzQixtQkFBUSxHQUFjLEVBQUUsQ0FBQztBQUN6Qix3QkFBYSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO0FBMEJwRixNQUFNLE9BQU8sU0FBUztDQUVyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgV2hvIH0gZnJvbSAnLi8uLi9kdG8vV2hvJztcblxuLypcbiAgQ2xhc2UgcGFyYSBtYW5lamFyIGVsIGVzdGFkbyBkZSBsb3MgdXN1YXJpb3MgKHNpIGVzdMOhIGF3YXksIGVzIG5ldG9wLCBkZSBkb25kZSBzZSBjb25lY3RhLCBldGMuKVxuKi9cbi8vIEBkeW5hbWljXG5leHBvcnQgY2xhc3MgV2hvSGFuZGxlciB7XG5cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSB1c2Vyc1dobzogVXNlcnNXaG9zID0ge307XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgb25XaG9SZXNwb25zZTogRXZlbnRFbWl0dGVyPFdobz4gPSBuZXcgRXZlbnRFbWl0dGVyPFdobz4oKTtcblxuICBwdWJsaWMgc3RhdGljIGFkZFdob0RhdGEodXNlcjogc3RyaW5nLCBkYXRhOiBXaG8pIHtcbiAgICBpZiAoIXRoaXMudXNlcnNXaG9bdXNlcl0pIHtcbiAgICAgIHRoaXMudXNlcnNXaG9bdXNlcl0gPSBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVzZXJzV2hvW3VzZXJdLmlzQXdheSA9IGRhdGEuaXNBd2F5O1xuICAgICAgdGhpcy51c2Vyc1dob1t1c2VyXS5pc05ldE9wID0gZGF0YS5pc05ldE9wO1xuICAgICAgdGhpcy51c2Vyc1dob1t1c2VyXS5tb2RlID0gZGF0YS5tb2RlO1xuICAgICAgdGhpcy51c2Vyc1dob1t1c2VyXS5uaWNrID0gZGF0YS5uaWNrO1xuICAgICAgdGhpcy51c2Vyc1dob1t1c2VyXS5yYXdNc2cgPSBkYXRhLnJhd01zZztcbiAgICAgIHRoaXMudXNlcnNXaG9bdXNlcl0uc2VydmVyRnJvbSA9IGRhdGEuc2VydmVyRnJvbTtcbiAgICB9XG4gICAgdGhpcy5vbldob1Jlc3BvbnNlLmVtaXQodGhpcy51c2Vyc1dob1t1c2VyXSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldFdob0RhdGEodXNlcjogc3RyaW5nKTogV2hvIHtcbiAgICByZXR1cm4gdGhpcy51c2Vyc1dob1t1c2VyXTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgV0hPVXNlclBhcnNlcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gLzooW15cXHNdKylcXHMoWzAtOV0rKVxccyhbXlxcc10rKVxccyhbXlxcc10rKVxccyhbXlxcc10rKVxccyhbXlxcc10rKVxccyhbXlxcc10rKVxccyhbXlxcc10rKVxccyhIfEcpKFxcKj8pKFxcfnxcXCZ8XFxAfFxcJXxcXCspPy8uZXhlYyhtZXNzYWdlKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBVc2Vyc1dob3Mge1xuICBba2V5OiBzdHJpbmddOiBXaG87XG59XG4iXX0=