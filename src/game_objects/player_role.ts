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
      new ThreeDimensionalVector(...storedRole.defaultAttackingPosition);
    const defendingPosition =
      new ThreeDimensionalVector(...storedRole.defaultDefensivePosition);

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
    return side === TEAM_SIDES.LEFT ?
      this.defaultAttackingPosition : this.invert(this.defaultAttackingPosition);
  }

  public getDefaultDefendingPosition(side: TEAM_SIDES): ThreeDimensionalVector {
    return side === TEAM_SIDES.LEFT ?
      this.defaultDefensivePosition : this.invert(this.defaultDefensivePosition);
  }

  private invert(position: ThreeDimensionalVector): ThreeDimensionalVector {
    return position.scalarMultiply(-1).add(new ThreeDimensionalVector(1, 1, 0));
  }
}
