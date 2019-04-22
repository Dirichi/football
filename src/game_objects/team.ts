import { BallPossessionService } from "../services/ball_possession_service";
import { Ball } from "./ball";
import { Player } from "./player";
import { Post } from "./post";

export class Team {
  private players: Player[];
  private opposition: Team;
  private ballPossessionService: BallPossessionService;
  private ball: Ball;

  constructor(players: Player[], ballPossessionService: BallPossessionService, ball: Ball) {
    this.players = players;
    this.ballPossessionService = ballPossessionService;
    this.players.forEach((player) =>  player.setTeam(this));
    this.ball = ball;
  }

  public getPlayers(): Player[] {
    return [...this.players];
  }

  public setOpposingGoalPost(post: Post): void {
    this.players.forEach((player) => player.setOpposingGoalPost(post));
  }

  public setOpposition(opposition: Team): void {
    this.opposition = opposition;
  }

  public setColors(colors: [number, number, number]): void {
    this.players.forEach((player) => player.setColors(colors));
  }

  public nearestPlayerToBall(): Player {
    const position = this.ball.getPosition();
    let nearest: Player | null = null;
    let nearestDistance: number | null = null;

    this.players.forEach((player) => {
      const distanceToBall = position.distanceTo(player.getPosition());
      if (!nearest || distanceToBall < nearestDistance) {
        nearest = player;
        nearestDistance = distanceToBall;
      }
    });

    return nearest;
  }

  public hasBall(): boolean {
    const lastPlayerInPossession =
      this.ballPossessionService.getLastPlayerInPossession();
    return this.players.includes(lastPlayerInPossession);
  }
}
