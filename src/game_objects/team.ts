import { BallPossessionService } from "../services/ball_possession_service";
import { Player } from "./player";
import { Post } from "./post";

export class Team {
  private players: Player[];
  private opposition: Team;
  private possessionService: BallPossessionService;

  constructor(players: Player[], possessionService: BallPossessionService) {
    this.players = players;
    this.possessionService = possessionService;
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

  public nearestPlayerToBall(): Player {
    return this.players[0];
  }

  public hasBall(): boolean {
    const lastPlayerInPossession =
      this.ballPossessionService.getLastPlayerInPossession();
    return this.players.includes(lastPlayerInPossession);
  }
}
