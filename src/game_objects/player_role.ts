import { PLAYER_ROLE, PLAYER_ROLE_TYPE, TEAM_SIDES } from "../constants";
import { PLAYER_ROLES_CONFIGURATION } from "../game_configs/player_roles_config";
import { Field } from "../game_objects/field";
import { IRoleConfig } from "../interfaces/irole_config";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class PlayerRole {

  public static get(roleId: PLAYER_ROLE, field: Field): PlayerRole {
    const config = PLAYER_ROLES_CONFIGURATION.get(roleId);
    const attackingPosition =
      new ThreeDimensionalVector(...config.defaultAttackingPosition);
    const defendingPosition =
      new ThreeDimensionalVector(...config.defaultDefensivePosition);

    return new PlayerRole(
      attackingPosition, defendingPosition, config.type, field);
  }
  private defaultAttackingPosition: ThreeDimensionalVector;
  private defaultDefensivePosition: ThreeDimensionalVector;
  private field: Field;
  private roleType: PLAYER_ROLE_TYPE;

  constructor(
    attackingPosition: ThreeDimensionalVector,
    defendingPosition: ThreeDimensionalVector,
    roleType: PLAYER_ROLE_TYPE,
    field: Field) {
      this.defaultAttackingPosition = attackingPosition;
      this.defaultDefensivePosition = defendingPosition;
      this.roleType = roleType;
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

  public getType(): PLAYER_ROLE_TYPE {
    return this.roleType;
  }

  private invert(position: ThreeDimensionalVector): ThreeDimensionalVector {
    const fieldStart = this.field.leftMostPosition();
    const fieldEnd = this.field.rightMostPosition();
    return fieldStart.minus(position).add(fieldEnd);
  }
}
