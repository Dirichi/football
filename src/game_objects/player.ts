import v4 from "uuid/v4";
import { BALL_CONTROL_REFRESH_TIME, constants, EVENTS, Y_BALL_MARGIN_FOR_KICKOFF_SUPPORT } from "../constants";
import { EventQueue } from "../event_queue";
import { ICircle } from "../interfaces/icircle";
import { ICollidable } from "../interfaces/icollidable";
import { IPlayerBallInteractionMediator } from "../interfaces/iplayer_ball_interaction_mediator";
import { IPlayerController } from "../interfaces/iplayer_controller";
import { IPlayerSchema } from "../interfaces/iplayer_schema";
import { PlayerPhysics } from "../physics/player_physics";
import { ThreeDimensionalVector } from "../three_dimensional_vector";
import { minimumBy } from "../utils/helper_functions";
import { Ball } from "./ball";
import { Post } from "./post";
import { Team } from "./team";

export class Player implements ICollidable {
  // TODO: Make these private
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;

  private opposingGoalPost?: Post;
  private physics?: PlayerPhysics;
  private maximumSpeed?: number;
  private id: string;
  private colors: [number, number, number];
  private team?: Team;
  private controller?: IPlayerController;
  private messageQueue?: EventQueue;
  private ballInteractionMediator?: IPlayerBallInteractionMediator;

  // TODO: Flirting with the idea of moving these attributes to
  // a PlayerRole class
  private attackingPosition?: ThreeDimensionalVector;
  private defendingPosition?: ThreeDimensionalVector;
  private kickOffPosition?: ThreeDimensionalVector;

  private lastNonZeroVelocity?: ThreeDimensionalVector;

  constructor(x: number, y: number, vx: number, vy: number, diameter: number) {
      this.id = v4(); // Randomly generated id
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.diameter = diameter;
      // TODO: Details like this should maybe be hidden away in another object
      // Like a PhysicalRepresentation or something like that. So that we can
      // swap representations out as we see fit.
      this.colors = [0, 0, 225];
  }

  public update(): void {
    this.controlBall();
    this.physics.update();
    this.controller.update();
  }

  public moveUp(): void {
    const velocity = new ThreeDimensionalVector(0, -this.maximumSpeed, 0);
    this.setVelocity(velocity);
  }

  public moveDown(): void {
    const velocity = new ThreeDimensionalVector(0, this.maximumSpeed, 0);
    this.setVelocity(velocity);
  }

  public moveLeft(): void {
    const velocity = new ThreeDimensionalVector(-this.maximumSpeed, 0, 0);
    this.setVelocity(velocity);
  }

  public moveRight(): void {
    const velocity = new ThreeDimensionalVector(this.maximumSpeed, 0, 0);
    this.setVelocity(velocity);
  }

  public stop(): void {
    [this.vx, this.vy] = [0, 0];
  }

  public feetPosition(): ThreeDimensionalVector {
    this.lastNonZeroVelocity =
      this.lastNonZeroVelocity || ThreeDimensionalVector.random2D();

    const margin = this.diameter / 2;
    return this.lastNonZeroVelocity.unit()
      .scalarMultiply(margin)
      .add(this.getPosition());
  }

  public moveTowards(target: ThreeDimensionalVector): void {
    const unitDelta = target.minus(this.getPosition()).unit();
    const velocity = unitDelta.scalarMultiply(this.maximumSpeed);

    [this.vx, this.vy] = [velocity.x, velocity.y];
  }

  public setPhysics(physics: PlayerPhysics): Player {
    this.physics = physics;
    this.physics.setPlayer(this);
    return this;
  }

  public setMaximumSpeed(speed: number): Player {
    this.maximumSpeed = speed;
    return this;
  }

  public getMaximumSpeed(): number {
    return this.maximumSpeed;
  }

  public getOpposingGoalPost(): Post {
    return this.opposingGoalPost;
  }

  public setOpposingGoalPost(post: Post): Player {
    this.opposingGoalPost = post;
    return this;
  }

  public setColors(colors: [number, number, number]): Player {
    this.colors = colors;
    return this;
  }

  public serialized(): IPlayerSchema {
    return {
      colors: this.colors,
      diameter: this.diameter,
      vx: this.vx,
      vy: this.vy,
      x: this.x,
      y: this.y,
    } as IPlayerSchema;
  }

  public getGameObjectId(): string {
    return this.id;
  }

  public getVelocity(): ThreeDimensionalVector {
    return new ThreeDimensionalVector(this.vx, this.vy, 0);
  }

  public getPosition(): ThreeDimensionalVector {
    return new ThreeDimensionalVector(this.x, this.y, 0);
  }

  public getShape(): ICircle {
    return {
      getCentre: () => new ThreeDimensionalVector(this.x, this.y, 0),
      getDiameter: () => this.diameter,
      kind: "circle",
    } as ICircle;
  }

  public getTeam(): Team {
    return this.team;
  }

  public teamMates(): Player[] {
    return this.team.getPlayers().filter((player) => player !== this);
  }

  public getNearestTeamMate(): Player | null {
    const position = this.getPosition();

    return minimumBy(this.teamMates(), (teammate: Player): number => {
      return teammate.getPosition().distanceTo(position);
    });
  }

  public setTeam(team: Team): Player {
    this.team = team;
    return this;
  }

  public setAttackingPosition(position: ThreeDimensionalVector): Player {
    this.attackingPosition = position;
    return this;
  }

  public setDefendingPosition(position: ThreeDimensionalVector): Player {
    this.defendingPosition = position;
    return this;
  }

  public setKickOffPosition(position: ThreeDimensionalVector): Player {
    this.kickOffPosition = position;
    return this;
  }

  public setController(controller: IPlayerController): Player {
    this.controller = controller;
    return this;
  }

  public setMessageQueue(queue: EventQueue): Player {
    this.messageQueue = queue;
    this.listenForMessages();
    return this;
  }

  public setBallInteractionMediator(
    mediator: IPlayerBallInteractionMediator): Player {
      this.ballInteractionMediator = mediator;
      return this;
  }

  public moveTowardsAttackingPosition(): void {
    this.moveTowards(this.attackingPosition);
  }

  public moveTowardsDefensivePosition(): void {
    this.moveTowards(this.defendingPosition);
  }

  public sendMessage(player: Player, message: {details: string}): void {
    this.messageQueue.trigger(
      `player.${player.getGameObjectId()}.messaged`, message);
  }

  public enableControls(): void {
    this.controller.enable();
  }

  public disableControls(): void {
    this.controller.disable();
  }

  public prepareForKickOff(): void {
    [this.x, this.y] = [this.kickOffPosition.x, this.kickOffPosition.y];
  }

  public prepareToStartKickOff(ball: Ball): void {
    this.x = ball.getPosition().x;
    this.y = ball.getPosition().y;
  }

  public prepareToSupportKickOff(ball: Ball): void {
    this.x = ball.getPosition().x;
    this.y = ball.getPosition().y - Y_BALL_MARGIN_FOR_KICKOFF_SUPPORT;
  }

  public kickBall(destination: ThreeDimensionalVector): boolean {
    return this.ballInteractionMediator.kickBall(this, destination);
  }

  public hasBall(): boolean {
    return this.ballInteractionMediator.hasBall(this);
  }

  public controlBall(): boolean {
    return this.ballInteractionMediator.controlBall(this);
  }

  private listenForMessages(): void {
    this.messageQueue.when(
      `player.${this.id}.messaged`, (message: {details: string}) => {
        this.controller.handleMessage(message);
      });
  }

  private setVelocity(velocity: ThreeDimensionalVector) {
    [this.vx, this.vy] = [velocity.x, velocity.y];

    if (velocity.isNonZero()) {
      this.lastNonZeroVelocity = velocity;
    }
  }
}
