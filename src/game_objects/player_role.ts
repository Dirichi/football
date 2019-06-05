import { TEAM_SIDES } from "../constants";
import { PLAYER_ROLES_CONFIGURATION } from "../game_configs/player_roles_config";
import { IRoleConfig } from "../interfaces/irole_config";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class PlayerRole {

  public static loadRoles(storedRoles: IRoleConfig[]): PlayerRole[] {
    return storedRoles.map((role) => this.loadRole(role));
  }

  public static loadRole(storedRole: IRoleConfig): PlayerRole {
    const attackingPosition =
      new ThreeDimensionalVector(
        storedRole.defaultAttackingPosition[0],
        storedRole.defaultAttackingPosition[1],
        0);
    const defendingPosition =
      new ThreeDimensionalVector(
        storedRole.defaultDefensivePosition[0],
        storedRole.defaultDefensivePosition[1],
        0);

    return new PlayerRole(
      storedRole.name,
      attackingPosition,
      defendingPosition
    );
  }
  private name: string;
  private defaultAttackingPosition: ThreeDimensionalVector;
  private defaultDefensivePosition: ThreeDimensionalVector;

  constructor(
    name: string,
    attackingPosition: ThreeDimensionalVector,
    defendingPosition: ThreeDimensionalVector) {
      this.name = name;
      this.defaultAttackingPosition = attackingPosition;
      this.defaultDefensivePosition = defendingPosition;
  }

  public getDefaultAttackingPosition(side: TEAM_SIDES): ThreeDimensionalVector {
    if (side === TEAM_SIDES.LEFT) {
      return this.defaultAttackingPosition;
    } else {
      const x = 1 - this.defaultAttackingPosition.x;
      const y = 1 - this.defaultAttackingPosition.y;
      return new ThreeDimensionalVector(x, y, this.defaultAttackingPosition.z);
    }
  }

  public getDefaultDefendingPosition(side: TEAM_SIDES): ThreeDimensionalVector {
    if (side === TEAM_SIDES.LEFT) {
      return this.defaultDefensivePosition;
    } else {
      const x = 1 - this.defaultDefensivePosition.x;
      const y = 1 - this.defaultDefensivePosition.y;
      return new ThreeDimensionalVector(x, y, this.defaultDefensivePosition.z);
    }
  }
}
