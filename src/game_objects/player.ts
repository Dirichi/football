import v4 from "uuid/v4";
import { constants, EVENTS } from "../constants";
import { ICircle } from "../interfaces/icircle";
import { ICollidable } from "../interfaces/icollidable";
import { IPlayerSchema } from "../interfaces/iplayer_schema";
import { PlayerPhysics } from "../physics/player_physics";
import { ThreeDimensionalVector } from "../three_dimensional_vector";
import { Post } from "./post";

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
  private mass?: number;
  private id: string;

  constructor(x: number, y: number, vx: number, vy: number, diameter: number) {
      this.id = v4(); // Randomly generated id
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.diameter = diameter;
      // TODO: This is a temporary flag to ensure the ball moves when it's kicked
      // It will be changed to a state object
      this.kickingBall = false;
  }

  public update() {
    this.physics.update();
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

  public setMass(mass: number) {
    this.mass = mass;
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

  public serialized(): IPlayerSchema {
    return {
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

  public getShape(): ICircle {
    return {
      getCentre: () => new ThreeDimensionalVector(this.x, this.y, 0),
      getDiameter: () => this.diameter,
      kind: "circle",
    } as ICircle;
  }
}
