import v4 from "uuid/v4";
import { DEFAULT_START_GAME_TIMEOUT, PROCESS_MESSAGE_TYPE } from "./constants";
import { IGameClient } from "./interfaces/igame_client";
import { IGameSessionAttributes } from "./interfaces/igame_session_attributes";
import { IModelStore } from "./interfaces/imodel_store";
import { IParticipationAttributes } from "./interfaces/iparticipation_attributes";
import { IProcess } from "./interfaces/iprocess";
import { IProcessForker } from "./interfaces/iprocess_forker";
import { IProcessMessage } from "./interfaces/iprocess_message";
import { IPlayerIdToReportMapping } from "./stats/player_report_service";

export class GameRoom {
  // TODO: Store GameRoom in postgres. Also move class to models.
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
  private startGameTimeout: number;
  private gameSessionStore: IModelStore<IGameSessionAttributes>;

  // TODO: Create a worker which runs every X seconds, inspects GameRooms that
  // have not started and then starts them automatically.
  constructor(id?: string) {
    this.id = id || v4();
    this.clients = new Set([]);
    this.startGameTimeout = DEFAULT_START_GAME_TIMEOUT;
  }

  public getId(): string {
    return this.id;
  }

  public getClients(): IGameClient[] {
    return [...this.clients];
  }

  public async addClient(client: IGameClient): Promise<void> {
    this.clients.add(client);
    this.routeClientCommandsToGameProcess(client);
    if (this.clients.size === 1) {
      const _ = await new Promise((resolve) => {
        return setTimeout(resolve, this.startGameTimeout);
      });
      return await this.startGame();
    }
  }

  public setProcessForker(forker: IProcessForker): void {
    this.forker = forker;
  }

  public setGameExecutablePath(executablePath: string): void {
    this.gameExecutablePath = executablePath;
  }

  public setGameSessionStore(store: IModelStore<IGameSessionAttributes>): void {
    this.gameSessionStore = store;
  }

  public setStartGameTimeout(timeout: number): void {
    this.startGameTimeout = timeout;
  }

  public save(): void {
    GameRoom.records.set(this.id, this);
  }

  public getGameProcess(): IProcess | null {
    return this.gameProcess || null;
  }

  public async startGame(): Promise<void> {
    if (this.gameProcess) { return; }
    const savedGameSession =
      await this.gameSessionStore.findBy({ gameRoomId: this.id });
    await this.gameSessionStore.update(savedGameSession.id, { startedAt: new Date() });

    this.gameProcess = this.forker.fork(this.gameExecutablePath);
    // TODO: We will need an abstraction on the raw process to be able to handle
    // direct communication with the process. So that we don't have to have all
    // this IPC code to the GameRoom class, and we can also reduce coupling
    // between raw processes and the GameRoom.
    this.clients.forEach((client) => this.assignControllerToClient(client));
    this.gameProcess.on("message", (payload: object) => {
      this.handleGameProcessMessage(payload as IProcessMessage);
    });
  }

  private async handleGameProcessMessage(
    message: IProcessMessage): Promise<void> {
    if (message.messageType === PROCESS_MESSAGE_TYPE.GAME_STATE) {
      this.clients.forEach((client) => {
        client.updateGameState(message.data);
      });
    }

    if (message.messageType === PROCESS_MESSAGE_TYPE.CONTROLLER_ASSIGNED) {
      const { clientId, playerId } =
        message.data as { clientId: string, playerId: string };
      const assignedClient =
        [...this.clients.values()].find((client) => client.getId() === clientId);
      assignedClient.assignControllerId(playerId);
    }

    if (message.messageType === PROCESS_MESSAGE_TYPE.GAME_OVER) {
      this.gameProcess.termintate();
      const data = message.data as IPlayerIdToReportMapping;
      await this.saveParticipationReports(data);
    }
  }

  private routeClientCommandsToGameProcess(client: IGameClient): void {
    client.onCommandRequest((request) => {
      if (!this.gameProcess) { return; }

      const message = {
        data: request,
        messageType: PROCESS_MESSAGE_TYPE.COMMAND,
      };
      this.gameProcess.send(message);
    });
  }

  private assignControllerToClient(client: IGameClient): void {
    // TODO: Test that each client is assigned a controller in the game.
    // TODO: Choose from a pool of colors for this.
    const message = {
      data: {
        clientId: client.getId(),
        participation: client.getParticipation(),
      },
      messageType: PROCESS_MESSAGE_TYPE.ASSIGN_CONTROLLER,
    };
    this.gameProcess.send(message);
  }

  private async saveParticipationReports(
    stats: IPlayerIdToReportMapping): Promise<IParticipationAttributes[]> {
    const promises = Array.from(this.clients.values()).map((client) => {
      return client.saveParticipationReport(stats[client.getControllerId()]);
    });
    return await Promise.all(promises);
  }
}
