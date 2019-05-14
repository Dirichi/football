import { EVENTS } from "./constants";
import { Ball } from "./game_objects/ball";
import { Box } from "./game_objects/box";
import { Field } from "./game_objects/field";
import { FieldRegion } from "./game_objects/field_region";
import { Post } from "./game_objects/post";
import { Team } from "./game_objects/team";

export class Game {
  private ball: Ball;
  private field: Field;
  private teamA: Team;
  private teamB: Team;
  private boxes: Box[];
  private regions: FieldRegion[];
  private posts: Post[];
  private stateMachine: IGameStateMachine;

  public update(): void {
    this.ball.update();
    this.teamA.update();
    this.teamB.update();
    this.stateMachine.update(this);
  }

  public setBall(ball: Ball): Game {
    this.ball = ball;
    return this;
  }

  public setField(field: Field): Game {
    this.field = field;
    return this;
  }

  public setTeamA(teamA: Team): Game {
    this.teamA = teamA;
    return this;
  }

  public setTeamB(teamB: Team): Game {
    this.teamB = teamB;
    return this;
  }

  public setBoxes(boxes: Box[]): Game {
    this.boxes = boxes;
    return this;
  }

  public setRegions(regions: FieldRegion[]): Game {
    this.regions = regions;
    return this;
  }

  public setPosts(posts: Post[]): Game {
    this.posts = posts;
    return this;
  }

  public setStateMachine(machine: IGameStateMachine): Game {
    this.stateMachine = machine;
    return this;
  }

  public disableControls(): void {
    [this.teamA, this.teamB].forEach((team) => team.disableControls());
  }

  public enableControls(): void {
    [this.teamA, this.teamB].forEach((team) => team.enableControls());
  }

  public getState() {
    const players = [this.teamA, this.teamB].map(
      (team) => team.getPlayers()).flat();
    return {
      [EVENTS.BALL_DATA]: this.ball.serialized(),
      [EVENTS.BOXES_DATA]: this.boxes.map((box) => box.serialized()),
      [EVENTS.FIELD_DATA]: this.field.serialized(),
      [EVENTS.FIELD_REGION_DATA]: this.regions.map(
        (region) => region.serialized()),
      [EVENTS.PLAYER_DATA]: players.map((player) => player.serialized()),
      [EVENTS.POSTS_DATA]: this.posts.map((post) => post.serialized()),
    };
  }
}
