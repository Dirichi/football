import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IShotValueCalculator {
  evaluate(player: Player, target: Vector3D, shootingFrom?: Vector3D): number;
}
