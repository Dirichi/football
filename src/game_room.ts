import v4 from "uuid/v4";
import { IO_MESSAGE_TYPE } from "./constants";
import { IGameClient } from "./interfaces/igame_client";

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
  private _onRequestGameStartCallback?: () => void;

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
    client.setRoom(this);
  }

  public publish(messageType: IO_MESSAGE_TYPE, message: any): void {
    this.clients.forEach((client) => client.send(messageType, message));
  }

  public save(): void {
    GameRoom.records.set(this.id, this);
  }

  public requestGameStart() {
    this._onRequestGameStartCallback.call(this);
  }

  public onRequestGameStart(callback: () => void) {
    this._onRequestGameStartCallback = callback;
  }
}
