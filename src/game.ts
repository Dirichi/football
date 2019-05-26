import { EVENTS } from "./constants";
import { Ball } from "./game_objects/ball";
import { Box } from "./game_objects/box";
import { Field } from "./game_objects/field";
import { FieldRegion } from "./game_objects/field_region";
import { Post } from "./game_objects/post";
import { Team } from "./game_objects/team";
import { IGameStateMachine } from "./interfaces/igame_state_machine";
import { IScoresPanelSchema } from "./interfaces/iscores_panel_schema";
import { ITextSchema } from "./interfaces/itext_schema";
import { TimerService } from "./timer_service";

export class Game {
  private ball: Ball;
  private field: Field;
  private boxes: Box[];
  private regions: FieldRegion[];
  private posts: Post[];
  private stateMachine: IGameStateMachine;
  private teams: Team[];
  // TODO: These three should be moved into different classes, or be classes of
  // their own.
  private stateText: string = "";
  private teamAScore: number = 0;
  private teamBScore: number = 0;

  private timer: TimerService;

  public update(): void {
    this.timer.update();
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

  public setTimer(timer: TimerService): Game {
    this.timer = timer;
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

  public runGameOverAnimation(): void {
    this.stateText = "GAME OVER";
  }

  public goalScored(): boolean {
    return this.getPostContainingBall() !== null;
  }

  public isOver(): boolean {
    return this.timer.isFinished();
  }

  public prepareForKickOff(): void {
    this.ball.prepareForKickOff();
    this.teams.forEach((team) => team.prepareForKickOff());
  }

  public recordGoal(): void {
    const post = this.getPostContainingBall();
    if (!post) { return; }

    const scoringTeam = this.teams.find((team) => {
      return team.getOpposingGoalPost() === post;
    });

    this.incrementScoreFor(scoringTeam);
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
      [EVENTS.SCORES_PANEL_DATA]: this.buildScoresPanel(),
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

  // TODO: This may not need to be here
  private buildScoresPanel(): IScoresPanelSchema {
    return {
      teamAScore: this.teamAScore,
      teamBScore: this.teamBScore,
      time: Math.floor(this.timer.getElapsedTime()),
      x: this.field.x,
      xlength: this.field.xlength * 0.1,
      y: this.field.y,
      ylength: this.field.ylength * 0.05,
    };
  }

  private getPostContainingBall(): Post | null {
    return this.posts.find((post) => post.containsBall(this.ball)) || null;
  }

  private incrementScoreFor(team: Team): void {
    // TODO: This could be moved into a player / team stats class
    if (team === this.teams[0]) {
      this.teamAScore += 1;
    } else {
      this.teamBScore += 1;
    }
  }
}
