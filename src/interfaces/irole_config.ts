import { PLAYER_ROLE_TYPE } from "../constants";
export interface IRoleConfig {
  defaultAttackingPosition: [number, number, number];
  defaultDefensivePosition: [number, number, number];
  type: PLAYER_ROLE_TYPE;
}
