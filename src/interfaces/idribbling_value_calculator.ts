import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IDribblingValueCalculator {
  evaluate(player: Player, position: Vector3D): number;
}
