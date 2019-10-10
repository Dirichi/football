import path from "path";
import { GAME_EXECUTABLE_FILE, PLAYER_ROLE_TYPE, DEFAULT_TEAM_A_ROLES, DEFAULT_TEAM_B_ROLES, TEAM_ID, PLAYER_ROLE } from "../constants";
import { GameRoom } from "../game_room";
import { Participation } from "../models/participation";
import { User } from "../models/user";
import { WrappedProcessForker } from "../wrapped_process_forker";
import { v4 } from "uuid";
import { GameSession } from "../models/game_session";
import { IParticipationAttributes } from "../interfaces/iparticipation_attributes";
import { PLAYER_ROLES_CONFIGURATION } from "../game_configs/player_roles_config";

export class MatchMakerService {
  // TODO: Do not create a GameRoom everytime. First search for one matching
  // the provided criteria which has not been locked, and if none found, create
  // a new one.
  public async match(
    request: { user: User, roleType: PLAYER_ROLE_TYPE }): Promise<GameRoom | null> {
    const roomId = v4();
    const gameSession = await GameSession.create({
      gameRoomId: roomId,
      participations: this.defaultParticipations()
    });
    const participation = await gameSession.participations().findBy({
      userId: null,
      roleType: request.roleType
    });
    participation.update({ userId: request.user.id });
    const participations = await gameSession.participations();
    return this.buildRoom(roomId, participations);
  }

  private defaultParticipations(): Partial<IParticipationAttributes>[] {
    const teamAParticipations =
      this.buildParticipations(DEFAULT_TEAM_A_ROLES, TEAM_ID.WHITE);
    const teamBParticipations =
      this.buildParticipations(DEFAULT_TEAM_B_ROLES, TEAM_ID.RED);
    return [...teamAParticipations, ...teamBParticipations];
  }

  private buildRoom(roomId: string, participations: Participation[]): GameRoom {
    const room = new GameRoom(roomId);
    room.setProcessForker(new WrappedProcessForker());
    room.setGameExecutablePath(path.join(process.cwd(), GAME_EXECUTABLE_FILE));
    participations.forEach((participation) => {
      room.addParticipation(participation);
    });
    room.save();
    return room;
  }

  private buildParticipations(
    roles: PLAYER_ROLE[],
    teamId: TEAM_ID): Partial<IParticipationAttributes>[] {
    return roles.map((roleId) => {
      return {
        role: roleId,
        roleType: PLAYER_ROLES_CONFIGURATION.get(roleId).type,
        teamId: teamId,
      };
    });
  }
}
