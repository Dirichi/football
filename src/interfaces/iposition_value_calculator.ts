import { Player } from "../game_objects/player";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export interface IPositionValueCalculator {
  evaluate(player: Player, position?: ThreeDimensionalVector): number;
}
