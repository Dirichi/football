import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";

export class BallPossessionService {
  private ball: Ball;
  private players: Player[];
  private lastPlayerInPossession?: Player;
  private currentPlayerInPossession?: Player;

  constructor(ball: Ball, players: Player[]) {
    this.ball = ball;
    this.players = players;
  }

  public update() {
    const player =
      this.players.find((player) => this.isPlayerInPossession(player)) || null;

    if (player) {
      this.lastPlayerInPossession = player;
    }
    this.currentPlayerInPossession = player;
  }

  public getLastPlayerInPossession(): Player | null {
    return this.lastPlayerInPossession;
  }

  public getCurrentPlayerInPossession(): Player | null {
    return this.currentPlayerInPossession;
  }


  private isPlayerInPossession(player: Player): boolean {
    const margin = (player.diameter + this.ball.diameter) / 2;
    const distance = player.getPosition().distanceTo(this.ball.getPosition());

    return distance <= margin;
  }
}
