import path from "path";
import { v4 } from "uuid";
import { DEFAULT_TEAM_A_ROLES, DEFAULT_TEAM_B_ROLES, GAME_EXECUTABLE_FILE, PLAYER_ROLE, PLAYER_ROLE_TYPE, TEAM_ID } from "../constants";
import { PLAYER_ROLES_CONFIGURATION } from "../game_configs/player_roles_config";
import { GameRoom } from "../game_room";
import { IGameSessionAttributes } from "../interfaces/igame_session_attributes";
import { IModelStore } from "../interfaces/imodel_store";
import { IParticipationAttributes } from "../interfaces/iparticipation_attributes";
import { IUserAttributes } from "../interfaces/iuser_attributes";
import { GameSessionStore } from "../models/game_session_store";
import { WrappedProcessForker } from "../wrapped_process_forker";

interface IMatchRequest {
  user: IUserAttributes;
  roleType: PLAYER_ROLE_TYPE;
}

export class MatchMakerService {
  constructor(
    private gameSessionStore: IModelStore<IGameSessionAttributes> = new GameSessionStore()) { }
  // TODO: Do not create a GameRoom everytime. First search for one matching
  // the provided criteria which has not been locked, and if none found, create
  // a new one.
  public async match(request: IMatchRequest): Promise<GameRoom | null> {
    const gameSession = await this.newGameSession(request);
    const matchedParticipation =
      gameSession.participations.find((p) => p.userId === request.user.id);
    return this.buildRoom(gameSession, matchedParticipation);
  }

  private async newGameSession(
    request: IMatchRequest): Promise<IGameSessionAttributes> {
    const participations = this.buildAllParticipations();
    this.claimMatchingParticipation(participations, request);
    return await this.gameSessionStore.create({
      gameRoomId: v4(),
      participations });
  }

  private buildAllParticipations(): IParticipationAttributes[] {
    const teamAParticipations =
      this.buildDefaultParticipations(DEFAULT_TEAM_A_ROLES, TEAM_ID.WHITE);
    const teamBParticipations =
      this.buildDefaultParticipations(DEFAULT_TEAM_B_ROLES, TEAM_ID.RED);
    return teamAParticipations.concat(teamBParticipations);
  }

  private buildDefaultParticipations(
    roles: PLAYER_ROLE[], teamId: TEAM_ID): IParticipationAttributes[] {
    return roles.map((roleId) => {
      return {
        role: roleId,
        roleType: PLAYER_ROLES_CONFIGURATION.get(roleId).type,
        teamId,
      };
    });
  }

  private claimMatchingParticipation(
    participations: IParticipationAttributes[], request: IMatchRequest): void {
    const participationToClaim =
      participations.find((p) => p.roleType === request.roleType);
    participationToClaim.userId = request.user.id;
  }

  private buildRoom(
    gameSession: IGameSessionAttributes,
    participation: IParticipationAttributes): GameRoom {
    const room = new GameRoom(gameSession.gameRoomId);
    room.setProcessForker(new WrappedProcessForker());
    room.setGameExecutablePath(path.join(process.cwd(), GAME_EXECUTABLE_FILE));
    room.addParticipation(participation);
    room.setGameSessionStore(this.gameSessionStore);
    room.save();
    return room;
  }
}
