import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IDribbleValueCalculator {
  evaluate(
    player: Player, endPositon: Vector3D, startPosition?: Vector3D): number;
}
