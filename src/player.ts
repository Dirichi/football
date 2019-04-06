import { constants, EVENTS } from "./constants";
import { EventQueue } from "./event_queue";
import { IPlayerSchema } from "./iplayer_schema";
import { PlayerPhysics } from "./player_physics";

export class Player {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;

  private queue: EventQueue;
  private physics: PlayerPhysics;
  private speed: number;

  constructor(x: number, y: number, vx: number, vy: number,
              speed: number, diameter: number, queue: EventQueue,
              physics: PlayerPhysics) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.diameter = diameter;
      this.queue = queue;
      this.physics = physics;
      this.speed = speed;
  }

  public moveUp() {
    [this.vx, this.vy] = [0, -this.speed];
    this.physics.update(this);
  }

  public moveDown() {
    [this.vx, this.vy] = [0, this.speed];
    this.physics.update(this);
  }

  public moveLeft() {
    [this.vx, this.vy] = [-this.speed, 0];
    this.physics.update(this);
  }

  public moveRight() {
    [this.vx, this.vy] = [this.speed, 0];
    this.physics.update(this);
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
