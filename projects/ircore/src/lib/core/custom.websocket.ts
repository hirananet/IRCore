import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject, Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';

export class CustomWebSocket {

  private messageReceived = new EventEmitter<MessageData>();
  private statusChanged = new EventEmitter<ConnectionStatusData<any>>();
  private wss!: WebSocketSubject<string>;
  private onOpenSubject = new Subject();
  private onCloseSubject = new Subject();
  private connected: boolean = false;
  private uuid: string = '';
  private lastSubscription?: Subscription;

  onStatusChanged(): EventEmitter<ConnectionStatusData<any>> {
    return this.statusChanged;
  }

  onMessageReceived(): EventEmitter<MessageData> {
    return this.messageReceived;
  }

  reconnect() {
    this.lastSubscription?.unsubscribe();
    this.subscribe(this.wss.asObservable(), this.uuid);
  }

  connect(url: string, uuid: string): Observable<string> {
    this.uuid = uuid;
    this.wss = webSocket<string>({
      url,
      serializer: msg => msg,
      deserializer: msg => msg.data,
      openObserver: this.onOpenSubject,
      closeObserver: this.onCloseSubject
    });
    const obs = this.wss.asObservable();
    this.subscribe(obs, this.uuid);
    this.onCloseSubject.subscribe((e: any) => {
      const status = new ConnectionStatusData<any>();
      status.status = ConnectionStatus.DISCONNECTED;
      status.serverID = uuid;
      const ecodes: any = {
        '1000': 'Disconnected from this server.',
        '1001': 'Server connection lost.',
        '1002': 'Protocol error.',
        '1003': 'Invalid data type sended.',
        '1004': 'Reserved error. Undefined.',
        '1005': 'Not status code was actually present.',
        '1006': 'Abruptly connection lost.',
        '1007': 'Message format error or inconsistent.',
        '1008': 'Policy violation.',
        '1009': 'Message too big, can\'t process.',
        '1010': 'Client closed connection, handshake not responsed, websocket support in this server?.',
        '1011': 'Server connection error, can\'t fullfillment the request.',
        '1015': 'TLS handshake error, invalid server certificate?.'
      };
      const reason = ecodes[e.code] ? ecodes[e.code] : 'Unknown error reason.';
      status.data = {
        code: e.code,
        reason,
        event: e
      };
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

  private subscribe(obs: Observable<string>, uuid: string) {
    this.lastSubscription = obs.subscribe(msg => {
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
