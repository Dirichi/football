import { IGameSessionAttributes } from "../interfaces/igame_session_attributes";
import { StorageService } from "../storage/storage_service";

export class GameSession {
  get id(): number {
    return this.attributes.id;
  }

  get gameRoomId(): string {
    return this.attributes.gameRoomId;
  }

  public static find(id: number): Promise<GameSession> {
    return this.store().find(id);
  }

  public static findOrCreateBy(
    attributes: Partial<IGameSessionAttributes>): Promise<GameSession> {
    return this.store().findOrCreateBy(attributes);
  }

  public static findBy(
    attributes: Partial<IGameSessionAttributes>): Promise<GameSession> {
    return this.store().findBy(attributes);
  }

  public static create(
    attributes: Partial<IGameSessionAttributes>): Promise<GameSession> {
    return this.store().create(attributes);
  }

  private static store(): StorageService<IGameSessionAttributes, GameSession> {
    return new StorageService(GameSession);
  }

  private attributes: IGameSessionAttributes;

  constructor(attributes: IGameSessionAttributes) {
    this.attributes = { ...attributes };
  }
}
