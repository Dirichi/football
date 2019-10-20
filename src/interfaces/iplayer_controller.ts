import { Player } from "../game_objects/player";

export interface IPlayerController {
  update(player: Player): void;
  enable(): void;
  disable(): void;
}
