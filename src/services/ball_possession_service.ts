import { Ball } from "../ball";
import { Player } from "../player";

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
    const distance = this.distance(player, this.ball);

    return distance <= margin;
  }

  private distance(player: Player, ball: Ball) {
    const xdist = player.x - ball.x;
    const ydist = player.y - ball.y;
    const distance = Math.sqrt((xdist * xdist) + (ydist * ydist));
    return distance;
  }
}
