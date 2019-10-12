import { IGameSessionAttributes } from "../interfaces/igame_session_attributes";
import { IModelStore } from "../interfaces/imodel_store";
import { IParticipationAttributes } from "../interfaces/iparticipation_attributes";
import { BaseModelStore } from "../storage/base_model_store";
import { ParticipationStore } from "./participation_store";

export class GameSessionStore extends BaseModelStore<IGameSessionAttributes> {
  private participationStore: IModelStore<IParticipationAttributes>;

  constructor(tableName: string = "game_sessions") {
    super(tableName);
    this.participationStore = new ParticipationStore();
  }

  public async create(
    attributes: IGameSessionAttributes
  ): Promise<IGameSessionAttributes> {
    const { participations, ...rest } = attributes;
    const createdSession = await super.create(rest);
    createdSession.participations =
      await this.createAssociatedParticipations(participations, createdSession);
    return createdSession;
  }

  private async createAssociatedParticipations(
    participations: IParticipationAttributes[],
    gameSession: IGameSessionAttributes,
  ): Promise<IParticipationAttributes[]> {
    if (!participations) {
      return [];
    }
    participations.forEach((p) => p.gameSessionId = gameSession.id);
    return await Promise.all(participations.map((p) => {
      return this.participationStore.create(p);
    }));
  }
}
