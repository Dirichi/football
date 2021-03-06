import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IAttackPositionValueCalculator {
  evaluate(
    player: Player, playerPosition?: Vector3D, ballPosition?: Vector3D): number;
}
