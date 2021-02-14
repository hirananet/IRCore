import { Injectable } from '@angular/core';
import { WhoHandler } from '../handlers/Who.handler';
import * as i0 from "@angular/core";
export class WhoStatusService {
    constructor() {
        this.whoStatus = {};
        WhoHandler.onWhoResponse.subscribe((dW) => {
            this.whoStatus[dW.nick] = dW;
        });
    }
    isAway(nick) {
        if (this.whoStatus[nick] && this.whoStatus[nick].isAway) {
            return true;
        }
        return false;
    }
}
WhoStatusService.ɵprov = i0.ɵɵdefineInjectable({ factory: function WhoStatusService_Factory() { return new WhoStatusService(); }, token: WhoStatusService, providedIn: "root" });
WhoStatusService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
WhoStatusService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hvLXN0YXR1cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL2FsZXhhL2dpdC9JUkNvcmUvcHJvamVjdHMvaXJjb3JlL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy93aG8tc3RhdHVzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7O0FBS3JELE1BQU0sT0FBTyxnQkFBZ0I7SUFJM0I7UUFGTyxjQUFTLEdBQXlCLEVBQUUsQ0FBQztRQUcxQyxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQU8sRUFBRSxFQUFFO1lBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxNQUFNLENBQUMsSUFBWTtRQUN4QixJQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDdEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7OztZQWxCRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBXaG8gfSBmcm9tICcuLi9kdG8vV2hvJztcbmltcG9ydCB7IFdob0hhbmRsZXIgfSBmcm9tICcuLi9oYW5kbGVycy9XaG8uaGFuZGxlcic7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFdob1N0YXR1c1NlcnZpY2Uge1xuXG4gIHB1YmxpYyB3aG9TdGF0dXM6IHtba2V5OiBzdHJpbmddOiBXaG99ID0ge307XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgV2hvSGFuZGxlci5vbldob1Jlc3BvbnNlLnN1YnNjcmliZSgoZFc6IFdobykgPT4ge1xuICAgICAgdGhpcy53aG9TdGF0dXNbZFcubmlja10gPSBkVztcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBpc0F3YXkobmljazogc3RyaW5nKSB7XG4gICAgaWYodGhpcy53aG9TdGF0dXNbbmlja10gJiYgdGhpcy53aG9TdGF0dXNbbmlja10uaXNBd2F5KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=