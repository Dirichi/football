import { EVENTS } from "./constants";
import { Ball } from "./game_objects/ball";
import { Box } from "./game_objects/box";
import { Field } from "./game_objects/field";
import { FieldRegion } from "./game_objects/field_region";
import { Post } from "./game_objects/post";
import { Team } from "./game_objects/team";
import { IGameStateMachine } from "./interfaces/igame_state_machine";
import { ITextSchema } from "./interfaces/itext_schema";

export class Game {
  private ball: Ball;
  private field: Field;
  private boxes: Box[];
  private regions: FieldRegion[];
  private posts: Post[];
  private stateMachine: IGameStateMachine;
  private teams: Team[];
  private stateText: string = "";

  public update(): void {
    this.stateMachine.update(this);
    this.ball.update();
    this.teams.forEach((team) => team.update());
  }

  public setBall(ball: Ball): Game {
    this.ball = ball;
    return this;
  }

  public setField(field: Field): Game {
    this.field = field;
    return this;
  }

  public setTeams(teams: Team[]): Game {
    // TODO: Leaving out a check for whether the size of teams == 2
    this.teams = teams;
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
    this.teams.forEach((team) => team.disableControls());
  }

  public enableControls(): void {
    this.teams.forEach((team) => team.enableControls());
  }

  public runGoalAnimation(): void {
    this.stateText = "GOAL";
  }

  public runKickOffAnimation(): void {
    this.stateText = "KICK OFF";
  }

  public runPlayAnimation(): void {
    this.stateText = "";
  }

  public goalScored(): boolean {
    return this.posts.some((post) => post.containsBall(this.ball));
  }

  public prepareForKickOff(): void {
    this.ball.prepareForKickOff();
    this.teams.forEach((team) => team.prepareForKickOff());
  }

  public getState() {
    const players = this.teams.map((team) => team.getPlayers()).flat();
    return {
      [EVENTS.GAME_STATE_TEXT_DATA]: this.buildStateText(),
      [EVENTS.BALL_DATA]: this.ball.serialized(),
      [EVENTS.BOXES_DATA]: this.boxes.map((box) => box.serialized()),
      [EVENTS.FIELD_DATA]: this.field.serialized(),
      [EVENTS.FIELD_REGION_DATA]: this.regions.map(
        (region) => region.serialized()),
      [EVENTS.PLAYER_DATA]: players.map((player) => player.serialized()),
      [EVENTS.POSTS_DATA]: this.posts.map((post) => post.serialized()),
    };
  }

  // TODO: Maybe this doesn't belong to `Game`
  private buildStateText(): ITextSchema {
    const midPoint = this.field.getMidPoint();
    return {
      value: this.stateText,
      x: midPoint.x,
      y: midPoint.y,
    };
  }
}
