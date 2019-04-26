import { Ball } from "../game_objects/ball";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { Player } from "../game_objects/player";

export class BallPossessionService implements IBallPossessionService {
  private ball: Ball;
  private players: Player[];
  private lastPlayerInPossession?: Player;
  private currentPlayerInPossession?: Player;

  constructor(ball: Ball, players: Player[]) {
    this.ball = ball;
    this.players = players;
  }

  public update(): void {
    const playerInPossession =
      this.players.find((player) => this.isPlayerInPossession(player)) || null;

    if (playerInPossession) {
      this.lastPlayerInPossession = playerInPossession;
    }
    this.currentPlayerInPossession = playerInPossession;
  }

  public getLastPlayerInPossession(): Player | null {
    return this.lastPlayerInPossession;
  }

  public getCurrentPlayerInPossessionOrNull(): Player | null {
    return this.currentPlayerInPossession;
  }

  private isPlayerInPossession(player: Player): boolean {
    const margin = (player.diameter + this.ball.diameter) / 2;
    const distance = player.getPosition().distanceTo(this.ball.getPosition());

    return distance <= margin;
  }
}
