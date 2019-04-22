import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";

export class BallPossessionService {
  private ball: Ball;
  private players: Player[];

  constructor(ball: Ball, players: Player[]) {
    this.ball = ball;
    this.players = players;
  }

  public getPlayerInPossession(): Player | null {
    return this.players.find((player) => this.isPlayerInPossession(player)) || null;
  }

  private isPlayerInPossession(player: Player): boolean {
    const margin = (player.diameter + this.ball.diameter) / 2;
    const distance = player.getPosition().distanceTo(this.ball.getPosition());

    return distance <= margin;
  }
}
