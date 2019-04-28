import { Player } from "../game_objects/player";

export interface IBallPossessionService {
  getCurrentPlayerInPossessionOrNull(): Player | null;
  getLastPlayerInPossession(): Player | null;
}