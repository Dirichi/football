import socketIOClient from "socket.io-client";
import { IWebSocket } from "./iweb_socket";

export class SocketIOAdapter implements IWebSocket {
  private socket: SocketIOClient.Socket;
  constructor(socket: SocketIOClient.Socket) {
    this.socket = socket;
  }

  public emit(event: string, payload: any) {
    this.socket.emit(event, payload);
  }

  public on(event: string, callback: (payload: any) => void) {
    this.socket.on(event, callback);
  }
}
