import { ServerHandler } from './../handlers/Server.handler';
import { Injectable, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export class ServerMsgService {
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
ServerMsgService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ServerMsgService_Factory() { return new ServerMsgService(); }, token: ServerMsgService, providedIn: "root" });
ServerMsgService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
ServerMsgService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLW1zZy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL2FsZXhhL2dpdC9JUkNvcmUvcHJvamVjdHMvaXJjb3JlL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9zZXJ2ZXItbXNnLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzdELE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUt6RCxNQUFNLE9BQU8sZ0JBQWdCO0lBSzNCO1FBSGdCLGFBQVEsR0FBaUIsRUFBRSxDQUFDO1FBQzVCLGVBQVUsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUdwRixhQUFhLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQWEsRUFBRSxFQUFFO1lBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsYUFBYSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQWEsRUFBRSxFQUFFO1lBQzdELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7OztZQWpCRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUkNNZXNzYWdlIH0gZnJvbSAnLi8uLi91dGlscy9JUkNNZXNzYWdlLnV0aWwnO1xuaW1wb3J0IHsgU2VydmVySGFuZGxlciB9IGZyb20gJy4vLi4vaGFuZGxlcnMvU2VydmVyLmhhbmRsZXInO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFNlcnZlck1zZ1NlcnZpY2Uge1xuXG4gIHB1YmxpYyByZWFkb25seSBtZXNzYWdlczogSVJDTWVzc2FnZVtdID0gW107XG4gIHB1YmxpYyByZWFkb25seSBuZXdNZXNzYWdlOiBFdmVudEVtaXR0ZXI8SVJDTWVzc2FnZT4gPSBuZXcgRXZlbnRFbWl0dGVyPElSQ01lc3NhZ2U+KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgU2VydmVySGFuZGxlci5zZXJ2ZXJSZXNwb25zZS5zdWJzY3JpYmUoKGQ6IElSQ01lc3NhZ2UpID0+IHtcbiAgICAgIHRoaXMubWVzc2FnZXMucHVzaChkKTtcbiAgICAgIHRoaXMubmV3TWVzc2FnZS5lbWl0KGQpO1xuICAgIH0pXG4gICAgU2VydmVySGFuZGxlci5zZXJ2ZXJOb3RpY2VSZXNwb25zZS5zdWJzY3JpYmUoKGQ6IElSQ01lc3NhZ2UpID0+IHtcbiAgICAgIHRoaXMubWVzc2FnZXMucHVzaChkKTtcbiAgICAgIHRoaXMubmV3TWVzc2FnZS5lbWl0KGQpO1xuICAgIH0pO1xuICB9XG5cblxufVxuIl19