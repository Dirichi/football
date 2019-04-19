import { constants, EVENTS } from "../constants";
import { IPlayerSchema } from "../interfaces/iplayer_schema";
import { PlayerPhysics } from "../physics/player_physics";
import { Post } from "./post";

export class Player {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;

  private opposingGoalPost?: Post;
  private physics?: PlayerPhysics;
  private speed: number;
  private mass?: number;

  constructor(x: number, y: number, vx: number, vy: number, speed: number,
              diameter: number) {
      // TODO: For some reason the player moves faster vertically
      // than horizontally
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.diameter = diameter;
      this.speed = speed;
  }

  public update() {
    this.physics.update();
  }

  public moveUp() {
    [this.vx, this.vy] = [0, -this.speed];
  }

  public moveDown() {
    [this.vx, this.vy] = [0, this.speed];
  }

  public moveLeft() {
    [this.vx, this.vy] = [-this.speed, 0];
  }

  public moveRight() {
    [this.vx, this.vy] = [this.speed, 0];
  }

  public stop() {
    [this.vx, this.vy] = [0, 0];
  }

  public moveTowards(x: number, y: number, margin: number) {
    // TODO: Test this method
    if (y - this.y > margin) {
      this.moveDown();
    } else if (this.y - y > margin) {
      this.moveUp();
    } else if (x - this.x > margin) {
      this.moveRight();
    } else if (this.x - x > margin) {
      this.moveLeft();
    }
  }

  public setPhysics(physics: PlayerPhysics) {
    this.physics = physics;
    this.physics.setPlayer(this);
  }

  public setMass(mass: number) {
    this.mass = mass;
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
