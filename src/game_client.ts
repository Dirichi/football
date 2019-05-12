import { Socket } from "socket.io";
import { IO_MESSAGE_TYPE } from "./constants";
import { ICommandRequest } from "./interfaces/icommand_request";
import { IGameClient } from "./interfaces/igame_client";

export class GameClient implements IGameClient {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  public send(messageType: IO_MESSAGE_TYPE, message: any): void {
    this.socket.emit(messageType, message);
  }

  public getId(): string {
    return this.socket.id;
  }

  public when(event: IO_MESSAGE_TYPE, callback: (payload: object) => void) {
    this.socket.on(event, callback);
  }
}
