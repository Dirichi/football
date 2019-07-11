import { Player } from "../game_objects/player";

export interface IPassValueCalculator {
  evaluate(player: Player): number;
}
