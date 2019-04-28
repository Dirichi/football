import { Player } from "../game_objects/player";

export interface IShotValueCalculator {
  valueFor(player: Player): number;
}
