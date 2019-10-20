import { v4 } from "uuid";
import { PLAYER_ROLE_TYPE } from "../constants";
import { GameRoom } from "../game_room";
import { IGameSessionAttributes } from "../interfaces/igame_session_attributes";
import { IModelStore } from "../interfaces/imodel_store";
import { IParticipationAttributes } from "../interfaces/iparticipation_attributes";
import { IUserAttributes } from "../interfaces/iuser_attributes";
import { GameSessionStore } from "../models/game_session_store";
import { ParticipationStore } from "../models/participation_store";
import { sample } from "../utils/helper_functions";
import { ParticipationFactory } from "./participation_factory";
import { RoomFactory } from "./room_factory";

interface IMatchRequest {
  user: IUserAttributes;
  roleType: PLAYER_ROLE_TYPE;
}

export class MatchMakerService {
  constructor(
    private gameSessionStore: IModelStore<IGameSessionAttributes> = new GameSessionStore(),
    private participationStore: IModelStore<IParticipationAttributes> = new ParticipationStore(),
    private participationFactory: ParticipationFactory = new ParticipationFactory(),
    private roomFactory: RoomFactory = new RoomFactory()) { }

  public async match(request: IMatchRequest): Promise<GameRoom | null> {
    let gameSession = await this.findMatchingSession(request);
    if (!gameSession) { gameSession = await this.newGameSession(); }
    const participation =
      await this.claimParticipation(gameSession.participations, request);
    return this.buildRoom(gameSession, participation);
  }

  private async findMatchingSession(
    request: IMatchRequest): Promise<IGameSessionAttributes> {
      // TODO: This should be a findBy
    const sessions = await this.gameSessionStore.where({
      participations: { userId: null, roleType: request.roleType },
      startedAt: null,
    });
    return sessions[0];
  }

  private async newGameSession(): Promise<IGameSessionAttributes> {
    const participations = this.participationFactory.buildAllParticipations();
    return await this.gameSessionStore.create({
      gameRoomId: v4(),
      participations
    });
  }

  private async claimParticipation(
    participations: IParticipationAttributes[],
    request: IMatchRequest): Promise<IParticipationAttributes> {
      const matches =
      participations.filter((p) => {
        return p.roleType === request.roleType && p.userId === null;
      });
      const match = sample(matches);
      return await this.participationStore.update(match.id, {userId: request.user.id});
  }

  private buildRoom(
    gameSession: IGameSessionAttributes,
    participation: IParticipationAttributes): GameRoom {
    const room = this.roomFactory.findOrCreateFromSession(gameSession);
    room.addParticipation(participation);
    room.save();
    return room;
  }
}
