import { PLAYER_ROLE, PLAYER_ROLE_TYPE } from "../constants";
import { IRoleConfig } from "../interfaces/irole_config";

export const PLAYER_ROLES_CONFIGURATION: Map<PLAYER_ROLE, IRoleConfig> =
  new Map([
    [PLAYER_ROLE.GK, {
      defaultAttackingPosition: [0.2, 0.5, 0],
      defaultDefensivePosition: [0.05, 0.5, 0],
      type: PLAYER_ROLE_TYPE.KEEPER
    } as IRoleConfig],
    [PLAYER_ROLE.LB, {
      defaultAttackingPosition: [0.4, 0.2, 0],
      defaultDefensivePosition: [0.17, 0.2, 0],
      type: PLAYER_ROLE_TYPE.DEFENDER
    } as IRoleConfig],
    [PLAYER_ROLE.LCB, {
      defaultAttackingPosition: [0.3, 0.4, 0],
      defaultDefensivePosition: [0.17, 0.4, 0],
      type: PLAYER_ROLE_TYPE.DEFENDER
    } as IRoleConfig],
    [PLAYER_ROLE.RCB, {
      defaultAttackingPosition: [0.3, 0.6, 0],
      defaultDefensivePosition: [0.17, 0.6, 0],
      type: PLAYER_ROLE_TYPE.DEFENDER
    } as IRoleConfig],
    [PLAYER_ROLE.RB, {
      defaultAttackingPosition: [0.4, 0.8, 0],
      defaultDefensivePosition: [0.17, 0.8, 0],
      type: PLAYER_ROLE_TYPE.DEFENDER
    } as IRoleConfig],
    [PLAYER_ROLE.LM, {
      defaultAttackingPosition: [0.65, 0.2, 0],
      defaultDefensivePosition: [0.33, 0.2, 0],
      type: PLAYER_ROLE_TYPE.MIDFIELDER
    } as IRoleConfig],
    [PLAYER_ROLE.LCM, {
      defaultAttackingPosition: [0.6, 0.4, 0],
      defaultDefensivePosition: [0.33, 0.4, 0],
      type: PLAYER_ROLE_TYPE.MIDFIELDER
    } as IRoleConfig],
    [PLAYER_ROLE.RCM, {
      defaultAttackingPosition: [0.6, 0.6, 0],
      defaultDefensivePosition: [0.33, 0.6, 0],
      type: PLAYER_ROLE_TYPE.MIDFIELDER
    } as IRoleConfig],
    [PLAYER_ROLE.RM, {
      defaultAttackingPosition: [0.65, 0.8, 0],
      defaultDefensivePosition: [0.33, 0.8, 0],
      type: PLAYER_ROLE_TYPE.MIDFIELDER
    } as IRoleConfig],
    [PLAYER_ROLE.LF, {
      defaultAttackingPosition: [0.8, 0.4, 0],
      defaultDefensivePosition: [0.5, 0.4, 0],
      type: PLAYER_ROLE_TYPE.FORWARD
    } as IRoleConfig],
    [PLAYER_ROLE.RF, {
      defaultAttackingPosition: [0.8, 0.6, 0],
      defaultDefensivePosition: [0.5, 0.6, 0],
      type: PLAYER_ROLE_TYPE.FORWARD
    } as IRoleConfig],
  ]);
