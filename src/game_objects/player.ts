import v4 from "uuid/v4";
import { Ball } from "./ball";
import { BallPossessionService } from "../services/ball_possession_service";
import { constants, EVENTS } from "../constants";
import { ICircle } from "../interfaces/icircle";
import { ICollidable } from "../interfaces/icollidable";
import { IPlayerController } from "../interfaces/iplayer_controller";
import { IPlayerSchema } from "../interfaces/iplayer_schema";
import { minimumBy } from "../utils/helper_functions";
import { PlayerPhysics } from "../physics/player_physics";
import { ThreeDimensionalVector } from "../three_dimensional_vector";
import { Post } from "./post";
import { Team } from "./team";

export class Player implements ICollidable {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;
  public kickingBall: boolean;

  private opposingGoalPost?: Post;
  private physics?: PlayerPhysics;
  private maximumSpeed?: number;
  private id: string;
  private colors: [number, number, number];
  private team?: Team;
  private ballPossessionService?: BallPossessionService;
  private controller?: IPlayerController;

  // TODO: Flirting with the idea of moving these attributes to
  // a PlayerRole class
  private attackingPosition?: ThreeDimensionalVector;
  private defendingPosition?: ThreeDimensionalVector;

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
      // TODO: This is a temporary flag to ensure the ball moves when it's kicked
      // It will be changed to a state object
      this.kickingBall = false;
  }

  public update() {
    this.physics.update();
    this.controller.update();
  }

  public moveUp() {
    [this.vx, this.vy] = [0, -this.maximumSpeed];
  }

  public moveDown() {
    [this.vx, this.vy] = [0, this.maximumSpeed];
  }

  public moveLeft() {
    [this.vx, this.vy] = [-this.maximumSpeed, 0];
  }

  public moveRight() {
    [this.vx, this.vy] = [this.maximumSpeed, 0];
  }

  public stop() {
    [this.vx, this.vy] = [0, 0];
  }

  public moveTowards(target: ThreeDimensionalVector) {
    // TODO: Move to physics class
    const position = new ThreeDimensionalVector(this.x, this.y, 0);
    const unitDelta = target.minus(position).unit();
    const velocity = unitDelta.scalarMultiply(this.maximumSpeed);

    [this.vx, this.vy] = [velocity.x, velocity.y];
  }

  public setPhysics(physics: PlayerPhysics) {
    this.physics = physics;
    this.physics.setPlayer(this);
  }

  public setMaximumSpeed(speed: number) {
    this.maximumSpeed = speed;
  }

  public getOpposingGoalPost(): Post {
    return this.opposingGoalPost;
  }

  public setOpposingGoalPost(post: Post) {
    this.opposingGoalPost = post;
  }

  public setColors(colors: [number, number, number]) {
    this.colors = colors;
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

  public getVelocity() {
    return new ThreeDimensionalVector(this.vx, this.vy, 0);
  }

  public getPosition() {
    return new ThreeDimensionalVector(this.x, this.y, 0);
  }

  public getShape(): ICircle {
    return {
      getCentre: () => new ThreeDimensionalVector(this.x, this.y, 0),
      getDiameter: () => this.diameter,
      kind: "circle",
    } as ICircle;
  }

  public getNearestTeamMate(): Player | null {
    const teammates = this.team.getPlayers().filter(
      (player) => player !== this);
    const position = this.getPosition();

    return minimumBy(teammates, (teammate: Player): number => {
      return teammate.getPosition().distanceTo(position);
    })
  }

  public isNearestTeamMateToBall(ball: Ball): boolean {
    return this === this.team.nearestPlayerToBall(ball);
  }

  public hasBall(): boolean {
    return this.ballPossessionService.getCurrentPlayerInPossession() === this;
  }

  public teamInControl(): boolean {
    return this.team.inControl();
  }

  public hasGoodPassingOptions(): boolean {
    return !this.inGoodShootingPosition();
  }

  public inGoodShootingPosition(): boolean {
    const position = this.getPosition();
    const distanceToGoal = position.distanceTo(this.opposingGoalPost.getMidPoint());
    return distanceToGoal < 0.25;
  }

  public setTeam(team: Team): void {
    this.team = team;
  }

  public setAttackingPosition(position: ThreeDimensionalVector): void {
    this.attackingPosition = position;
  }

  public setDefendingPosition(position: ThreeDimensionalVector): void {
    this.defendingPosition = position;
  }

  public setBallPossessionService(possessionService: BallPossessionService) {
    this.ballPossessionService = possessionService;
  }

  public setController(controller: IPlayerController) {
    this.controller = controller;
  }

  public positionAtDefendingPosition(): void {
    this.x = this.defendingPosition.x;
    this.y = this.defendingPosition.y;
  }

  public moveTowardsAttackingPosition(): void {
    this.moveTowards(this.attackingPosition);
  }

  public moveTowardsDefensivePosition(): void {
    this.moveTowards(this.defendingPosition);
  }
}
