import { Socket } from "socket.io";
import { GameProcessManager } from "./game_process_manager";
import { GameRoom } from "./game_room";
import { ICommandRequest } from "./interfaces/icommand_request";

export class SocketConfiguration {
  private gameProcessManager: GameProcessManager;

  constructor(gameProcessManager: GameProcessManager) {
    this.gameProcessManager = gameProcessManager;
  }

  public applyTo(socket: Socket) {
    this.handleJoinRequests(socket);
    this.handleStartRequests(socket);
    this.handleCommandRequests(socket);
    this.triggerJoinRequest(socket);
  }

  private triggerJoinRequest(socket: Socket) {
    // tslint:disable-next-line:no-console
    console.log(`requesting join for socket ${socket.id}`);
    socket.emit("requestJoin", {});
  }

  private handleJoinRequests(socket: Socket) {
    socket.on("join", (gameRoomId: string) => {
      const room = GameRoom.findById(gameRoomId) || new GameRoom(gameRoomId);
      room.add(socket.id);
      socket.join(gameRoomId);
      socket.emit("joinSuccessful", {});
      // tslint:disable-next-line:no-console
      console.log(`successfully added socket ${socket.id} to room ${room.getId()}`);
    });
  }

  private handleStartRequests(socket: Socket) {
    socket.on("start", () => {
      const room = GameRoom.findBySocketId(socket.id);
      // tslint:disable-next-line:no-console
      console.log(`starting gameroom ${room.getId()} for socket ${socket.id}`);
      this.gameProcessManager.startProcessFor(room);
    });
  }

  private handleCommandRequests(socket: Socket) {
    socket.on("command", (commandRequest: ICommandRequest) => {
      const room = GameRoom.findBySocketId(socket.id);
      // tslint:disable-next-line:no-console
      console.log(`routing request for ${room.getId()}`);
      this.gameProcessManager.routeRequestFor(room, commandRequest);
    });
  }
}
