import { ModelQueryRequest } from "../custom_types/types";
import { IGameSessionAttributes } from "../interfaces/igame_session_attributes";
import { IModelStore } from "../interfaces/imodel_store";
import { IParticipationAttributes } from "../interfaces/iparticipation_attributes";
import { BaseModelStore } from "../storage/base_model_store";
import { groupBy, isEmpty } from "../utils/helper_functions";
import { ParticipationStore } from "./participation_store";

export class GameSessionStore extends BaseModelStore<IGameSessionAttributes> {
  private participationStore: IModelStore<IParticipationAttributes>;

  constructor(tableName: string = "game_sessions") {
    super(tableName);
    this.participationStore = new ParticipationStore();
  }

  public async where(
    query: ModelQueryRequest<IGameSessionAttributes>
  ): Promise<IGameSessionAttributes[]> {
    // TODO: This is really a join query but I'm splitting it into two \
    // queries because I'm lazy.
    const { participations, ...rest } = query;
    let matchingSessions = await super.where({ ...rest });
    if (isEmpty(matchingSessions)) { return []; }

    const matchingParticipations =
      await this.findAssociatedParticipations(participations, matchingSessions);
    matchingSessions =
      this.filterByParticipations(matchingParticipations, matchingSessions);
    this.assignAssociatedParticipations(matchingParticipations, matchingSessions);
    return matchingSessions;
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

  private async findAssociatedParticipations(
    participationsQuery: ModelQueryRequest<IParticipationAttributes>,
    gameSessions: IGameSessionAttributes[]
  ): Promise<IParticipationAttributes[]> {
    let query: ModelQueryRequest<IParticipationAttributes> = { gameSessionId: gameSessions.map((s) => s.id) };
    query = participationsQuery ? { ...query, ...participationsQuery } : query;
    return await this.participationStore.where(query);
  }

  private filterByParticipations(
    participations: IParticipationAttributes[],
    gameSessions: IGameSessionAttributes[]): IGameSessionAttributes[] {
      const participationsBySessionId =
        groupBy(participations, (p) => p.gameSessionId);
      return gameSessions.filter((s) => {
        return participationsBySessionId.has(s.id);
      });
    }

  private assignAssociatedParticipations(
    participations: IParticipationAttributes[],
    gameSessions: IGameSessionAttributes[]): void {
    const participationsBySessionId =
      groupBy(participations, (p) => p.gameSessionId);
    gameSessions.forEach((s) => {
      s.participations = participationsBySessionId.get(s.id);
    });
  }
}
