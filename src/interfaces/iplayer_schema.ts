import { PLAYER_ANIMATION_STATE, TEAM_ID } from "../constants";

export interface IPlayerSchema {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  // TODO: this piece of data may not need to be streamed everytime. Consier
  // removing.
  diameter: number;
  state: PLAYER_ANIMATION_STATE;
  teamId: TEAM_ID;
  kicking: boolean;
}
