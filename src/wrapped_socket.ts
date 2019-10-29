import { GameRoom } from "./game_room";
import { ICustomizedSocket } from "./interfaces/icustomized_socket";
import { IParticipationAttributes } from "./interfaces/iparticipation_attributes";
import { IWebSocket } from "./interfaces/iweb_socket";

export class WrappedSocket implements IWebSocket {
  private socket: ICustomizedSocket;

  constructor(socket: ICustomizedSocket) {
    this.socket = socket;
  }

  public getId(): string {
    return this.socket.id;
  }

  public getGameRoom(): GameRoom {
    return this.socket.gameRoom;
  }

  public getParticipation(): IParticipationAttributes {
    return this.socket.participation;
  }

  public emit(event: string, message: any): void {
    this.socket.emit(event, message);
  }

  public on(event: string, callback: (payload: any) => void): void {
    this.socket.on(event, callback);
  }
}
