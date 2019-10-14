import { DEFAULT_TEAM_A_ROLES } from "../constants";
import { TEAM_ID } from "../constants";
import { DEFAULT_TEAM_B_ROLES } from "../constants";
import { PLAYER_ROLE } from "../constants";
import { PLAYER_ROLES_CONFIGURATION } from "../game_configs/player_roles_config";
import { IParticipationAttributes } from "../interfaces/iparticipation_attributes";

export class ParticipationFactory {
  public buildAllParticipations(): IParticipationAttributes[] {
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
}
