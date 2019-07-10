import { PLAYER_ROLE, PLAYER_ROLE_TYPE, TEAM_SIDES } from "../constants";
import { PLAYER_ROLES_CONFIGURATION } from "../game_configs/player_roles_config";
import { Field } from "../game_objects/field";
import { IRoleConfig } from "../interfaces/irole_config";
import { Vector3D } from "../three_dimensional_vector";

export class PlayerRole {

  public static get(roleId: PLAYER_ROLE, field: Field): PlayerRole {
    const config = PLAYER_ROLES_CONFIGURATION.get(roleId);
    const attackingPosition = new Vector3D(...config.defaultAttackingPosition);
    const defendingPosition = new Vector3D(...config.defaultDefensivePosition);

    return new PlayerRole(
      attackingPosition, defendingPosition, config.type, field);
  }

  constructor(
    private defaultAttackingPosition: Vector3D,
    private defaultDefensivePosition: Vector3D,
    private roleType: PLAYER_ROLE_TYPE,
    private field: Field) {
  }

  public getDefaultAttackingPosition(side: TEAM_SIDES): Vector3D {
    return side === TEAM_SIDES.LEFT ?
      this.defaultAttackingPosition : this.invert(this.defaultAttackingPosition);
  }

  public getDefaultDefendingPosition(side: TEAM_SIDES): Vector3D {
    return side === TEAM_SIDES.LEFT ?
      this.defaultDefensivePosition : this.invert(this.defaultDefensivePosition);
  }

  public getType(): PLAYER_ROLE_TYPE {
    return this.roleType;
  }

  private invert(position: Vector3D): Vector3D {
    const fieldStart = this.field.leftMostPosition();
    const fieldEnd = this.field.rightMostPosition();
    return fieldStart.minus(position).add(fieldEnd);
  }
}
