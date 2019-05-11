import { Socket } from "socket.io";
import { IO_MESSAGE_TYPE } from "./constants";
import { GameRoom } from "./game_room";

export class GameClient {
  private socket: Socket;
  private room?: GameRoom;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  public send(messageType: IO_MESSAGE_TYPE, message: any): void {
    this.socket.emit(messageType, message);
  }

  public getId(): string {
    return this.socket.id;
  }

  public getRoom(): GameRoom | null {
    return this.room || null;
  }

  public setRoom(room: GameRoom): void {
    this.room = room;
  }

  public configureListeners(): void {
    this.socket.on(IO_MESSAGE_TYPE.COMMAND, (message: any) => {
      // tslint:disable-next-line:no-console
      console.log(`message: ${message}`);
    });
  }
}
