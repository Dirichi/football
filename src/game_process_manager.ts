import socketIo from "socket.io";
import { GameProcess } from "./game_process";
import { GameRoom } from "./game_room";
import { ICommandRequest } from "./interfaces/icommand_request";
import { IGameState } from "./interfaces/igame_state";

export class GameProcessManager {
  private io: socketIo.Server;
  private gameProcesses: GameProcess[];

  constructor(io: socketIo.Server) {
    this.io = io;
    this.gameProcesses = [];
  }

  public startProcessFor(room: GameRoom) {
    if (!room.hasStarted()) {
      const gameProcess = new GameProcess(room);
      gameProcess.onGameStateChange((gameState: IGameState) => {
        this.publishStateToRoom(room, gameState);
      });
      gameProcess.start();
    }
  }

  public routeRequestFor(room: GameRoom, command: ICommandRequest) {
    const matchingGameProcess = this.gameProcesses.find((gameProcess) => {
      return gameProcess.roomId() === room.getId();
    });
    // tslint:disable-next-line:no-console
    console.log(`sending command ${command.commandId} to ${matchingGameProcess.getPid()}`);
    matchingGameProcess.handleCommandRequest(command);
  }

  private publishStateToRoom(room: GameRoom, gameState: IGameState) {
    // tslint:disable-next-line:no-console
    console.log(`sending gameState: ${gameState} to ${room.getId()}`);
    // this.io.sockets.in(room.getId()).emit("gameUpdated", gameState);
    this.io.emit("gameUpdated", gameState);
  }
}
