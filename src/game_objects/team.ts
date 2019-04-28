import { TEAM_SIDES } from "../constants";
import { minimumBy } from "../utils/helper_functions";
import { Player } from "./player";
import { Post } from "./post";

export class Team {
  private players: Player[];
  private opposition?: Team;
  private side?: TEAM_SIDES;

  constructor(players: Player[]) {
    this.players = players;
    this.players.forEach((player) =>  player.setTeam(this));
  }

  public getSide(): string {
    return this.side;
  }

  public getPlayers(): Player[] {
    return [...this.players];
  }

  public getOpposition(): Team {
    return this.opposition;
  }

  public setSide(side: TEAM_SIDES) {
    this.side = side;
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
}
