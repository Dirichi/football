import { EVENTS, GAME_STATUS } from "./constants";
import { Ball } from "./game_objects/ball";
import { Box } from "./game_objects/box";
import { Field } from "./game_objects/field";
import { FieldRegion } from "./game_objects/field_region";
import { Player } from "./game_objects/player";
import { Post } from "./game_objects/post";
import { Team } from "./game_objects/team";
import { IGameStateMachine } from "./interfaces/igame_state_machine";
import { IScoresPanelSchema } from "./interfaces/iscores_panel_schema";
import { GoalDetectionService } from "./services/goal_detection_service";
import { GoalRecordService } from "./services/goal_record_service";
import { PositionValueDebugService } from "./services/position_value_debug_service";
import { TimerService } from "./timer_service";
import { sample } from "./utils/helper_functions";

export class Game {
  private ball: Ball;
  private field: Field;
  private boxes: Box[];
  private regions: FieldRegion[];
  private posts: Post[];
  private stateMachine: IGameStateMachine;
  private teams: Team[];
  private status: GAME_STATUS = GAME_STATUS.NONE;
  private goalRecordService: GoalRecordService;
  private goalDetectionService: GoalDetectionService;
  private timer: TimerService;
  private positionValueDebugService: PositionValueDebugService;

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

  public setGoalRecordService(goalRecordService: GoalRecordService): Game {
    this.goalRecordService = goalRecordService;
    return this;
  }

  public setGoalDetectionService(detectionService: GoalDetectionService): Game {
    this.goalDetectionService = detectionService;
    return this;
  }

  public setPositionValueDebugService(
    service: PositionValueDebugService): Game {
      this.positionValueDebugService = service;
      return this;
  }

  public disableControls(): void {
    this.teams.forEach((team) => team.disableControls());
  }

  public enableControls(): void {
    this.teams.forEach((team) => team.enableControls());
  }

  public runGoalAnimation(): void {
    this.status = GAME_STATUS.GOAL;
  }

  public runKickOffAnimation(): void {
    this.status = GAME_STATUS.KICKOFF;
  }

  public runPlayAnimation(): void {
    this.status = GAME_STATUS.IN_PLAY;
  }

  public runGameOverAnimation(): void {
    this.status = GAME_STATUS.GAME_OVER;
  }

  public goalScored(): boolean {
    return this.goalDetectionService.goalDetected();
  }

  public isOver(): boolean {
    return this.timer.isFinished();
  }

  public isReadyToExit(): boolean {
    // This is an indirect way of checking the state. Perhaps allow the state
    // to say when it is done.
    return this.status === GAME_STATUS.GAME_OVER;
  }

  public prepareForKickOff(): void {
    this.ball.prepareForKickOff();
    this.teams.forEach((team) => team.prepareForKickOff());
    this.teamToStartKickOff().prepareToStartKickOff(this.ball);
  }

  public stopPlayers(): void {
    this.players().map((player) => player.stop());
  }

  public getState() {
    return {
      [EVENTS.GAME_STATUS]: { status: this.status },
      [EVENTS.BALL_DATA]: this.ball.serialized(),
      [EVENTS.BOXES_DATA]: this.boxes.map((box) => box.serialized()),
      [EVENTS.FIELD_DATA]: this.field.serialized(),
      [EVENTS.FIELD_REGION_DATA]: this.regions.map(
        (region) => region.serialized()),
      [EVENTS.PLAYER_DATA]: this.players().map((player) => player.serialized()),
      [EVENTS.POSTS_DATA]: this.posts.map((post) => post.serialized()),
      [EVENTS.SCORES_PANEL_DATA]: this.buildScoresPanel(),
      [EVENTS.POSITION_VALUE_DEBUG_INFO]:
        this.positionValueDebugService.getDebugData(),
    };
  }

  private players(): Player[] {
    return this.teams.map((team) => team.getPlayers()).flat();
  }

  // TODO: This may not need to be here
  private buildScoresPanel(): IScoresPanelSchema {
    return {
      teamAScore: this.goalRecordService.goalsFor(this.teams[0]),
      teamBScore: this.goalRecordService.goalsFor(this.teams[1]),
      time: Math.floor(this.timer.getElapsedTime()),
      x: this.field.x,
      xlength: this.field.xlength * 0.1,
      y: this.field.y,
      ylength: this.field.ylength * 0.05,
    };
  }

  private teamToStartKickOff(): Team {
    const lastConcedingTeam = this.goalRecordService.getLastConcedingTeam();
    return lastConcedingTeam || sample(this.teams);
  }
}
