import { Player } from "../game_objects/player";

export interface IBallPossessionService {
  hasBall(player: Player): boolean;
  getCurrentPlayerInPossessionOrNull(): Player | null;
  getLastPlayerInPossession(): Player | null;
  whenPossessionChanged(callback: (player: Player) => void): void;
}
