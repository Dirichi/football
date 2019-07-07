import { EVENTS } from "./constants";
import { Ball } from "./game_objects/ball";
import { Box } from "./game_objects/box";
import { Field } from "./game_objects/field";
import { FieldRegion } from "./game_objects/field_region";
import { Player } from "./game_objects/player";
import { Post } from "./game_objects/post";
import { Team } from "./game_objects/team";
import { IGameStateMachine } from "./interfaces/igame_state_machine";
import { IPositionValueSchema } from "./interfaces/iposition_value_schema";
import { IScoresPanelSchema } from "./interfaces/iscores_panel_schema";
import { ITextSchema } from "./interfaces/itext_schema";
import { PositionValueCalculator } from "./position_value_calculator";
import { GoalDetectionService } from "./services/goal_detection_service";
import { GoalRecordService } from "./services/goal_record_service";
import { ThreeDimensionalVector } from "./three_dimensional_vector";
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
  // TODO: This should be moved into a different class
  private stateText: string = "";
  private goalRecordService: GoalRecordService;
  private goalDetectionService: GoalDetectionService;
  private timer: TimerService;
  private positionValueCalculator: PositionValueCalculator;

  public update(): void {
    this.timer.update();
    this.goalDetectionService.update();
    this.goalRecordService.update();
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

  public setPositionValueCalculator(calculator: PositionValueCalculator): Game {
    this.positionValueCalculator = calculator;
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
    return this.goalDetectionService.goalDetected();
  }

  public isOver(): boolean {
    return this.timer.isFinished();
  }

  public prepareForKickOff(): void {
    this.ball.prepareForKickOff();
    this.teams.forEach((team) => team.prepareForKickOff());
    this.teamToStartKickOff().prepareToStartKickOff(this.ball);
  }

  public getState() {
    return {
      [EVENTS.GAME_STATE_TEXT_DATA]: this.buildStateText(),
      [EVENTS.BALL_DATA]: this.ball.serialized(),
      [EVENTS.BOXES_DATA]: this.boxes.map((box) => box.serialized()),
      [EVENTS.FIELD_DATA]: this.field.serialized(),
      [EVENTS.FIELD_REGION_DATA]: this.regions.map(
        (region) => region.serialized()),
      [EVENTS.PLAYER_DATA]: this.players().map((player) => player.serialized()),
      [EVENTS.POSTS_DATA]: this.posts.map((post) => post.serialized()),
      [EVENTS.SCORES_PANEL_DATA]: this.buildScoresPanel(),
      [EVENTS.POSITION_VALUE_DEBUG_INFO]: this.buildPositionValues(),
    };
  }

  private players(): Player[] {
    return this.teams.map((team) => team.getPlayers()).flat();
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

  private buildPositionValues(): IPositionValueSchema[] {
    return this.players().map((player) => {
      return this.buildPositionValue(player);
    });
  }

  private buildPositionValue(player: Player) {
    const positionDiffs = [
      new ThreeDimensionalVector(0.1, 0, 0),
      new ThreeDimensionalVector(-0.1, 0, 0),
      new ThreeDimensionalVector(0, 0.1, 0),
      new ThreeDimensionalVector(0, -0.1, 0),
    ];

    const potentialPositionsAndValues = positionDiffs.map((diff) => {
      const position = player.getPosition().add(diff);
      const value = this.positionValueCalculator.evaluate(player, position);

      return {x: position.x, y: position.y, value: String(value)} as ITextSchema;
    });

    return {
      currentPositionX: player.getPosition().x,
      currentPositionY: player.getPosition().y,
      potentialPositionsAndValues,
    } as IPositionValueSchema;
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
