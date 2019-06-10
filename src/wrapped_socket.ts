import { Socket } from "socket.io";
import { IWebSocket } from "./interfaces/iweb_socket";

export class WrappedSocket implements IWebSocket {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  public getId(): string {
    return this.socket.id;
  }

  public emit(event: string, message: any): void {
    this.socket.emit(event, message);
  }

  public on(event: string, callback: (payload: any) => void): void {
    this.socket.on(event, callback);
  }
}
