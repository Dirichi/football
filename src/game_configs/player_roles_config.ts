import { IRoleConfig } from "../interfaces/irole_config";

export const PLAYER_ROLES_CONFIGURATION: IRoleConfig[] = [
    {
      defaultAttackingPosition: [0.2, 0.5, 0],
      defaultDefensivePosition: [0.05, 0.5, 0],
      name: "Goal Keeper",
    },
    {
      defaultAttackingPosition: [0.4, 0.2, 0],
      defaultDefensivePosition: [0.17, 0.2, 0],
      name: "Left Back",
    },
    {
      defaultAttackingPosition: [0.3, 0.4, 0],
      defaultDefensivePosition: [0.17, 0.4, 0],
      name: "Left Centre Back",
    },
    {
      defaultAttackingPosition: [0.3, 0.6, 0],
      defaultDefensivePosition: [0.17, 0.6, 0],
      name: "Right Centre Back",
    },
    {
      defaultAttackingPosition: [0.4, 0.8, 0],
      defaultDefensivePosition: [0.17, 0.8, 0],
      name: "Right Back",
    },
    {
      defaultAttackingPosition: [0.65, 0.2, 0],
      defaultDefensivePosition: [0.33, 0.2, 0],
      name: "Left MidField",
    },
    {
      defaultAttackingPosition: [0.6, 0.4, 0],
      defaultDefensivePosition: [0.33, 0.4, 0],
      name: "Left Centre MidField",
    },
    {
      defaultAttackingPosition: [0.6, 0.6, 0],
      defaultDefensivePosition: [0.33, 0.6, 0],
      name: "Right Centre MidField",
    },
    {
      defaultAttackingPosition: [0.65, 0.8, 0],
      defaultDefensivePosition: [0.33, 0.8, 0],
      name: "Right MidField",
    },
    {
      defaultAttackingPosition: [0.8, 0.4, 0],
      defaultDefensivePosition: [0.5, 0.4, 0],
      name: "Left Forward",
    },
    {
      defaultAttackingPosition: [0.8, 0.6, 0],
      defaultDefensivePosition: [0.5, 0.6, 0],
      name: "Right Forward",
    }
];
