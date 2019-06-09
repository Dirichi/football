import { PLAYER_ROLE, TEAM_SIDES } from "../constants";
import { PLAYER_ROLES_CONFIGURATION } from "../game_configs/player_roles_config";
import { Field } from "../game_objects/field";
import { IRoleConfig } from "../interfaces/irole_config";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class PlayerRole {

  public static get(roleId: PLAYER_ROLE, field: Field): PlayerRole {
    const roleConfig = PLAYER_ROLES_CONFIGURATION.get(roleId);
    const attackingPosition =
      new ThreeDimensionalVector(...roleConfig.defaultAttackingPosition);
    const defendingPosition =
      new ThreeDimensionalVector(...roleConfig.defaultDefensivePosition);

    return new PlayerRole(attackingPosition, defendingPosition, field);
  }
  private defaultAttackingPosition: ThreeDimensionalVector;
  private defaultDefensivePosition: ThreeDimensionalVector;
  private field: Field;

  constructor(
    attackingPosition: ThreeDimensionalVector,
    defendingPosition: ThreeDimensionalVector,
    field: Field) {
      this.defaultAttackingPosition = attackingPosition;
      this.defaultDefensivePosition = defendingPosition;
      this.field = field;
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
    const fieldStart = this.field.leftMostPosition();
    const fieldEnd = this.field.rightMostPosition();
    return fieldStart.minus(position).add(fieldEnd);
  }
}
