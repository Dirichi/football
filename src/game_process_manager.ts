import { IProcess } from "./interfaces/iprocess";
import { IProcessForker } from "./interfaces/iprocess_forker";
import path from "path";
import v4 from "uuid";
import { GAME_EXECUTABLE_FILE } from "./constants";
import { GameRoom } from "./game_room";

export class GameProcessManager {
  private processRecords: Map<string, IProcess>;
  private executabelFile: string;
  private forker?: WrappedProcessForker;

  constructor(executabelFile?: string) {
    this.executabelFile =
      executabelFile || path.join(__dirname, GAME_EXECUTABLE_FILE);
    this.processRecords = new Map();
  }

  public manageProcessesFor(room: GameRoom) {
    room.onRequestGameStart(() => this.startGameProcessFor(room));
  }

  public setProcessForker(forker: IProcessForker): GameProcess {
    this.processForker = forker;
  }

  private startGameProcessFor(room: GameRoom) {
    const gameProcess = this.processForker.fork(this.executabelFile);
    this.processRecords.set(room.id, gameProcess);
    gameProcess.send('start');
  }
}
