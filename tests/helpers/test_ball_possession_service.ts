import { IBallPossessionService } from "../../src/interfaces/iball_possession_service";
import { Player } from "../../src/game_objects/player";

export class TestBallPossessionService implements IBallPossessionService {
  private current: Player;
  private last: Player;

  constructor(current: Player | null = null, last: Player | null = null) {
    this.current = current;
    this.last = last;
  }

  public getCurrentPlayerInPossessionOrNull() {
    return this.current;
  }

  public getLastPlayerInPossession() {
    return this.last;
  }
}