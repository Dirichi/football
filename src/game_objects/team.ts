import { BallPossessionService } from "../services/ball_possession_service";
import { Ball } from "./ball";
import { Player } from "./player";
import { Post } from "./post";
import { minimumBy } from "../utils/helper_functions"

export class Team {
  private players: Player[];
  private opposition?: Team;
  private ballPossessionService?: BallPossessionService;
  private ball?: Ball;

  constructor(players: Player[]) {
    this.players = players;
    this.players.forEach((player) =>  player.setTeam(this));
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

  public setBallPossessionService(ballPossessionService: BallPossessionService) {
    this.ballPossessionService = ballPossessionService;
    this.players.forEach((player) => {
      player.setBallPossessionService(ballPossessionService) }
    );
  }

  public nearestPlayerToBall(ball: Ball): Player | null {
    const ballPosition = ball.getPosition();
    return minimumBy(this.players, (player: Player) => {
      return player.getPosition().distanceTo(ballPosition);
    });
  }

  public inControl(): boolean {
    const lastPlayerInPossession =
      this.ballPossessionService.getLastPlayerInPossession();
    return this.players.includes(lastPlayerInPossession);
  }
}
