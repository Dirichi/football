import { Player } from "./player";
import { Post } from "./post";

export class Team {
  private players: Player[];
  private opposition: Team;

  constructor(players: Player[]) {
    this.players = players;
    this.players.forEach((player) => player.setTeam(this));
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

  public setColors(colors: [number, number, number]) {
    this.players.forEach((player) => player.setColors(colors));
  }
}
