import path from "path";
import { v4 } from "uuid";
import { DEFAULT_TEAM_A_ROLES, DEFAULT_TEAM_B_ROLES, GAME_EXECUTABLE_FILE, PLAYER_ROLE, PLAYER_ROLE_TYPE, TEAM_ID } from "../constants";
import { PLAYER_ROLES_CONFIGURATION } from "../game_configs/player_roles_config";
import { GameRoom } from "../game_room";
import { IParticipationAttributes } from "../interfaces/iparticipation_attributes";
import { GameSession } from "../models/game_session";
import { Participation } from "../models/participation";
import { User } from "../models/user";
import { WrappedProcessForker } from "../wrapped_process_forker";

interface IMatchRequest {
  user: User;
  roleType: PLAYER_ROLE_TYPE;
}

export class MatchMakerService {
  // TODO: Do not create a GameRoom everytime. First search for one matching
  // the provided criteria which has not been locked, and if none found, create
  // a new one.
  public async match(request: IMatchRequest): Promise<GameRoom | null> {
    const gameSession = await GameSession.create({ gameRoomId: v4() });
    const allParticipations = this.buildAllParticipations(gameSession.id);
    this.claimMatchingParticipation(allParticipations, request);
    const savedParticipations =
      await Promise.all(allParticipations.map((p) => Participation.create(p)));
    const matchedParticipation =
      savedParticipations.find((p) => p.userId === request.user.id);
    return this.buildRoom(gameSession, matchedParticipation);
  }

  private buildAllParticipations(
    gameSessionId: number): Array<Partial<IParticipationAttributes>> {
    const teamAParticipations =
      this.buildDefaultParticipations(
        DEFAULT_TEAM_A_ROLES, TEAM_ID.WHITE, gameSessionId);
    const teamBParticipations =
      this.buildDefaultParticipations(
        DEFAULT_TEAM_B_ROLES, TEAM_ID.RED, gameSessionId);
    return teamAParticipations.concat(teamBParticipations);
  }

  private buildDefaultParticipations(
    roles: PLAYER_ROLE[],
    teamId: TEAM_ID,
    gameSessionId: number): Array<Partial<IParticipationAttributes>> {
    return roles.map((roleId) => {
      return {
        gameSessionId,
        role: roleId,
        roleType: PLAYER_ROLES_CONFIGURATION.get(roleId).type,
        teamId,
      };
    });
  }

  private claimMatchingParticipation(
    participations: Array<Partial<IParticipationAttributes>>,
    request: IMatchRequest) {
    const participationToClaim =
      participations.find((p) => p.roleType === request.roleType);
    participationToClaim.userId = request.user.id;
  }

  private buildRoom(
    gameSession: GameSession, participation: Participation): GameRoom {
    const room = new GameRoom(gameSession.gameRoomId);
    room.setProcessForker(new WrappedProcessForker());
    room.setGameExecutablePath(path.join(process.cwd(), GAME_EXECUTABLE_FILE));
    room.addParticipation(participation);
    room.save();
    return room;
  }
}
