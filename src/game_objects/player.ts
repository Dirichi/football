import { constants, EVENTS } from "../constants";
import { IPlayerSchema } from "../interfaces/iplayer_schema";
import { PlayerPhysics } from "../physics/player_physics";
import { ThreeDimensionalVector } from "../three_dimensional_vector";
import { Post } from "./post";

export class Player {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;

  private opposingGoalPost?: Post;
  private physics?: PlayerPhysics;
  private maximumSpeed?: number;
  private mass?: number;

  constructor(x: number, y: number, vx: number, vy: number, diameter: number) {
      // TODO: For some reason the player moves faster vertically
      // than horizontally
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.diameter = diameter;
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
}
