import { PLAYER_ROLE_TYPE, TEAM_ID, TEAM_SIDES } from "../constants";
import { Ball } from "./ball";
import { Player } from "./player";
import { PlayerRole } from "./player_role";
import { Post } from "./post";

export class Team {
  private players: Player[];
  private opposition?: Team;
  private side?: TEAM_SIDES;
  private opposingGoalPost?: Post;
  private goalPost?: Post;
  private kickOffStartingPlayer?: Player;
  private kickOffSupportingPlayer?: Player;
  private id?: TEAM_ID;

  constructor(players: Player[]) {
    this.players = players;
    this.players.forEach((player) =>  player.setTeam(this));
  }

  public getSide(): TEAM_SIDES {
    return this.side;
  }

  public getPlayers(): Player[] {
    return [...this.players];
  }

  public getFieldPlayers(): Player[] {
    return this.players.filter((player) => {
      return player.getRole().getType() !== PLAYER_ROLE_TYPE.KEEPER;
    });
  }

  public getOpposition(): Team {
    return this.opposition;
  }

  public getId(): TEAM_ID {
    return this.id;
  }

  public setId(id: TEAM_ID): Team {
    this.id = id;
    return this;
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

  public setGoalPost(post: Post): Team {
    this.goalPost = post;
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

  public getGoalPost(): Post {
    return this.goalPost;
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

  public setRoles(roles: PlayerRole[]): void {
    if (roles.length !== this.players.length) {
      throw new Error(`Number of roles: ${roles.length}, must match the number\
         of players: ${this.players.length}`);
    }

    roles.forEach((role, index) => {
      this.players[index].setRole(role);
    });
  }
}
