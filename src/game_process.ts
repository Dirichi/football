import { ChildProcess, fork } from "child_process";
import { GameRoom } from "./game_room";
import { ICommandRequest } from "./interfaces/icommand_request";
import { IGameState } from "./interfaces/igame_state";

export class GameProcess {
  private room: GameRoom;
  private rawChildProcess: ChildProcess;
  private stateChangeCallBack: (gameState: IGameState) => void;

  constructor(room: GameRoom) {
    this.room = room;
    this.rawChildProcess = null;
    this.stateChangeCallBack = null;
  }

  public start() {
    this.rawChildProcess = fork(`src/main.ts`);

    this.rawChildProcess.on("message", (data: {messageType: string, messagePayload: any}) => {
      if (data.messageType === "GAME_UPDATED") {
        const gameState = data.messagePayload as IGameState;
        this.stateChangeCallBack.call(this, gameState);
      }
    });

    this.room.start();
    // tslint:disable-next-line:no-console
    console.log(`started game ${this.room.getId()} on process ${this.getPid()}`);
  }

  public roomId() {
    return this.room.getId();
  }

  public getPid() {
    return this.rawChildProcess.pid;
  }

  public handleCommandRequest(command: ICommandRequest) {
    this.rawChildProcess.send({
      messagePayload: command,
      messageType: "COMMAND_REQUEST",
    });
  }

  public onGameStateChange(callback: (message: IGameState) => void) {
    this.stateChangeCallBack = callback;
  }
}
