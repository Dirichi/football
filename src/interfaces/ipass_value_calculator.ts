import { Player } from "../game_objects/player";

export interface IPassValueCalculator {
  valueFor(player: Player): number;
}
