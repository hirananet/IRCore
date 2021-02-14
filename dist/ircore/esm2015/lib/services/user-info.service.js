import { Injectable, EventEmitter } from '@angular/core';
import { StatusHandler } from '../handlers/Status.handler';
import * as i0 from "@angular/core";
/**
 * Servicio para gestionar mi información
 */
export class UserInfoService {
    constructor() {
        this.onChangeNick = new EventEmitter();
        StatusHandler.setHandlerNickChanged(this);
    }
    getNick() {
        return this.actualNick;
    }
    setNick(nick) {
        this.actualNick = nick;
        this.onChangeNick.emit(nick);
    }
    onNickChanged(nick) {
        if (nick.oldNick === this.actualNick) {
            this.actualNick = nick.newNick;
        }
    }
}
UserInfoService.ɵprov = i0.ɵɵdefineInjectable({ factory: function UserInfoService_Factory() { return new UserInfoService(); }, token: UserInfoService, providedIn: "root" });
UserInfoService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
UserInfoService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbmZvLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvYWxleGEvZ2l0L0lSQ29yZS9wcm9qZWN0cy9pcmNvcmUvc3JjLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL3VzZXItaW5mby5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpELE9BQU8sRUFBaUIsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7O0FBRTFFOztHQUVHO0FBSUgsTUFBTSxPQUFPLGVBQWU7SUFLMUI7UUFGZ0IsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBR3hELGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRU0sT0FBTztRQUNaLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRU0sT0FBTyxDQUFDLElBQVk7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUFnQjtRQUM1QixJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDaEM7SUFDSCxDQUFDOzs7O1lBekJGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmlja0NoYW5nZSB9IGZyb20gJy4uL2R0by9OaWNrQ2hhbmdlJztcbmltcG9ydCB7IE9uTmlja0NoYW5nZWQsIFN0YXR1c0hhbmRsZXIgfSBmcm9tICcuLi9oYW5kbGVycy9TdGF0dXMuaGFuZGxlcic7XG5cbi8qKlxuICogU2VydmljaW8gcGFyYSBnZXN0aW9uYXIgbWkgaW5mb3JtYWNpw7NuXG4gKi9cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFVzZXJJbmZvU2VydmljZSBpbXBsZW1lbnRzIE9uTmlja0NoYW5nZWQge1xuXG4gIHByaXZhdGUgYWN0dWFsTmljazogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgb25DaGFuZ2VOaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgU3RhdHVzSGFuZGxlci5zZXRIYW5kbGVyTmlja0NoYW5nZWQodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TmljaygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmFjdHVhbE5pY2s7XG4gIH1cblxuICBwdWJsaWMgc2V0TmljayhuaWNrOiBzdHJpbmcpIHtcbiAgICB0aGlzLmFjdHVhbE5pY2sgPSBuaWNrO1xuICAgIHRoaXMub25DaGFuZ2VOaWNrLmVtaXQobmljayk7XG4gIH1cblxuICBvbk5pY2tDaGFuZ2VkKG5pY2s6IE5pY2tDaGFuZ2UpIHtcbiAgICBpZiAobmljay5vbGROaWNrID09PSB0aGlzLmFjdHVhbE5pY2spIHtcbiAgICAgIHRoaXMuYWN0dWFsTmljayA9IG5pY2submV3TmljaztcbiAgICB9XG4gIH1cblxufVxuIl19