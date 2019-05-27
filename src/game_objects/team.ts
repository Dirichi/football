import { TEAM_SIDES } from "../constants";
import { minimumBy } from "../utils/helper_functions";
import { Ball } from "./ball";
import { Player } from "./player";
import { Post } from "./post";

export class Team {
  private players: Player[];
  private opposition?: Team;
  private side?: TEAM_SIDES;
  private opposingGoalPost?: Post;
  private kickOffStartingPlayer?: Player;
  private kickOffSupportingPlayer?: Player;

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

  public setSide(side: TEAM_SIDES): Team {
    this.side = side;
    return this;
  }

  public setOpposingGoalPost(post: Post): Team {
    this.opposingGoalPost = post;
    this.players.forEach((player) => player.setOpposingGoalPost(post));
    return this;
  }

  public setOpposition(opposition: Team): Team {
    this.opposition = opposition;
    return this;
  }

  public setKickOffStartingPlayer(player: Player): Team {
    this.kickOffStartingPlayer = player;
    return this;
  }

  public setKickOffSupportingPlayer(player: Player): Team {
    this.kickOffSupportingPlayer = player;
    return this;
  }

  public getOpposingGoalPost(): Post {
    return this.opposingGoalPost;
  }

  public setColors(colors: [number, number, number]): Team {
    this.players.forEach((player) => player.setColors(colors));
    return this;
  }

  public update(): void {
    this.players.forEach((player) => player.update());
  }

  public enableControls(): void {
    this.players.forEach((player) => player.enableControls());
  }

  public disableControls(): void {
    this.players.forEach((player) => player.disableControls());
  }

  public prepareForKickOff(): void {
    this.players.forEach((player) => player.prepareForKickOff());
  }

  public prepareToStartKickOff(ball: Ball): void {
    this.kickOffStartingPlayer.prepareToStartKickOff(ball);
    this.kickOffSupportingPlayer.prepareToSupportKickOff(ball);
  }
}
