import { webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';

export class CustomWebSocket {

  private messageReceived = new EventEmitter<MessageData>();
  private statusChanged = new EventEmitter<ConnectionStatusData<any>>();
  private wss: WebSocketSubject<string>;
  private onOpenSubject = new Subject();
  private onCloseSubject = new Subject();
  private connected: boolean = false;

  onStatusChanged(): EventEmitter<ConnectionStatusData<any>> {
    return this.statusChanged;
  }

  onMessageReceived(): EventEmitter<MessageData> {
    return this.messageReceived;
  }

  connect(url: string, uuid: string): Observable<string> {
      this.wss = webSocket<string>({
        url,
        serializer: msg => msg,
        deserializer: msg => msg.data,
        openObserver: this.onOpenSubject,
        closeObserver: this.onCloseSubject
      });
      const obs = this.wss.asObservable();
      obs.subscribe(msg => {
        this.messageReceived.emit(new MessageData(uuid, msg));
      },
      err => {
        const status = new ConnectionStatusData<any>();
        status.status = ConnectionStatus.ERROR;
        status.serverID = uuid;
        status.data = err;
        this.statusChanged.emit(status);
        this.connected = false;
      });
      this.onCloseSubject.subscribe((e) => {
        const status = new ConnectionStatusData<any>();
        status.status = ConnectionStatus.DISCONNECTED;
        status.serverID = uuid;
        status.data = e;
        this.statusChanged.emit(status);
        this.connected = false;
      });
      this.onOpenSubject.subscribe(() => {
        const status = new ConnectionStatusData<void>();
        status.status = ConnectionStatus.CONNECTED;
        status.serverID = uuid;
        this.statusChanged.emit(status);
        this.connected = true;
      });
      return obs;
  }

  public send(msg: string) {
      this.wss.next(msg);
  }

  public disconnect() {
    this.wss.complete();
  }

  public isConnected() {
    return this.connected;
  }

}

export class ConnectionStatusData<t> {
  public status?: ConnectionStatus;
  public serverID: string = '';
  public data?: t;
}

export enum ConnectionStatus {
  CONNECTED,
  DISCONNECTED,
  ERROR
}

export class MessageData {
  uuid: string;
  message: string;
  constructor(uuid: string, message: string) {
    this.uuid = uuid;
    this.message = message;
  }
}
