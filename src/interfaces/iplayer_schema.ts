import { PLAYER_ANIMATION_STATE, TEAM_ID } from "../constants";
import { ICursor } from "./icursor";

export interface IPlayerSchema {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  cursor: ICursor | null;
  // TODO: this piece of data may not need to be streamed everytime. Consier
  // removing.
  diameter: number;
  state: PLAYER_ANIMATION_STATE;
  teamId: TEAM_ID;
}
