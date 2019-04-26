export interface IBallPossessionService {
  getCurrentPlayerInPossessionOrNull(): Player | null;
  getLastPlayerInPossession(): Player | null;
}
