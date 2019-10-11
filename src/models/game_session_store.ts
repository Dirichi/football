import { IGameSessionAttributes } from "../interfaces/igame_session_attributes";
import { BaseModelStore } from "../storage/base_model_store";

export class GameSessionStore extends BaseModelStore<IGameSessionAttributes> {
  constructor(tableName: string = "game_sessions") {
    super(tableName);
  }
}
