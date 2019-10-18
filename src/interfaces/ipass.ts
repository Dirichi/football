import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IPass {
  sender: Player;
  isSuccessful?: boolean;
  intendedReceiver: Player;
  eventualReceiver?: Player;
}
