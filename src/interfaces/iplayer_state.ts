import { Player } from "../game_objects/player";

export interface IPlayerState {
  update(player: Player): void;
  eligibleFor(player: Player): boolean;
}
