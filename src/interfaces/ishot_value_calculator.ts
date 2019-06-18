import { Player } from "../game_objects/player";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export interface IShotValueCalculator {
  evaluate(player: Player, shootingFrom?: ThreeDimensionalVector): number;
}
