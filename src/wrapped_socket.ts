import { Socket } from "socket.io";
import { GameRoom } from "./game_room";
import { IWebSocket } from "./interfaces/iweb_socket";
import { User } from "./models/user";

export class WrappedSocket implements IWebSocket {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  public getId(): string {
    return this.socket.id;
  }

  public getUser(): User {
    return this.socket.user;
  }

  public getGameRoom(): GameRoom {
    return this.socket.gameRoom;
  }

  public emit(event: string, message: any): void {
    this.socket.emit(event, message);
  }

  public on(event: string, callback: (payload: any) => void): void {
    this.socket.on(event, callback);
  }
}
