import path from "path";
import v4 from "uuid/v4";
import { GAME_EXECUTABLE_FILE, IO_MESSAGE_TYPE , PROCESS_MESSAGE_TYPE } from "./constants";
import { IGameClient } from "./interfaces/igame_client";
import { IProcess } from "./interfaces/iprocess";
import { IProcessForker } from "./interfaces/iprocess_forker";
import { IProcessMessage } from "./interfaces/iprocess_message";

export class GameRoom {

  public static find(id: string): GameRoom | null {
    return GameRoom.records.get(id) || null;
  }

  public static deleteAll(): void {
    GameRoom.records.clear();
  }

  public static count(): number {
    return GameRoom.records.size;
  }

  private static records = new Map<string, GameRoom>();
  private id: string;
  private clients: Set<IGameClient>;
  private gameProcess?: IProcess;
  private forker?: IProcessForker;
  private gameExecutablePath?: string;

  constructor(id?: string) {
    this.id = id || v4();
    this.clients = new Set([]);
  }

  public getId(): string {
    return this.id;
  }

  public getClients(): IGameClient[] {
    return [...this.clients];
  }

  public addClient(client: IGameClient): void {
    this.clients.add(client);
    client.when(IO_MESSAGE_TYPE.COMMAND, (payload: object) => {
      this.gameProcess.send(payload);
    });
  }

  public setProcessForker(forker: IProcessForker): void {
    this.forker = forker;
  }

  public setGameExecutablePath(executablePath: string): void {
    this.gameExecutablePath = executablePath;
  }

  public save(): void {
    GameRoom.records.set(this.id, this);
  }

  public getGameProcess(): IProcess | null {
    return this.gameProcess || null;
  }

  public startGame(): void {
    if (this.gameProcess) { return; }

    this.gameProcess = this.forker.fork(this.gameExecutablePath);
    this.gameProcess.on("message", (payload: object) => {
      this.handleGameProcessMessage(payload as IProcessMessage);
    });
  }

  private handleGameProcessMessage(message: IProcessMessage): void {
    if (message.messageType === PROCESS_MESSAGE_TYPE.GAME_STATE) {
      this.clients.forEach((client) => {
        client.send(IO_MESSAGE_TYPE.GAME_STATE, message.data);
      });
    }
  }
}
