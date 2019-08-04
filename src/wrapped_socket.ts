import { Socket } from "socket.io";
import { GameRoom } from "./game_room";
import { IWebSocket } from "./interfaces/iweb_socket";
import { Participation } from "./models/participation";
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

  public getParticipation(): Participation {
    // TODO: This should not have to be computed from the room and the player.
    // They should be set on the socket in the authorization flow.
    return this.socket.gameRoom.participations.find((participation) => {
      return participation.userId === this.socket.user.id;
    });
  }

  public emit(event: string, message: any): void {
    this.socket.emit(event, message);
  }

  public on(event: string, callback: (payload: any) => void): void {
    this.socket.on(event, callback);
  }
}
