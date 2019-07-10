import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IShotValueCalculator {
  evaluate(player: Player, shootingFrom?: Vector3D): number;
}
