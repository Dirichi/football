import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IShot {
  isGoal?: boolean;
  shooter: Player;
  target: Vector3D;
  interceptedBy?: Player;
}
