import { BallPhysics } from "./ball_physics";
import { IBallSchema } from "./iball_schema";

export class Ball {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;

  private physics?: BallPhysics;
  private maximumSpeed?: number;

  constructor(x: number, y: number, vx: number, vy: number, diameter: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.diameter = diameter;
  }

  public update() {
    this.physics.update(this);
  }

  public moveTowards(x: number, y: number) {
    // TODO: Test this method
    const [dy, dx] = [y - this.y, x - this.x];
    const magnitude = Math.sqrt((dy * dy) + (dx * dx));
    const [unitDy, unitDx] = [dy / magnitude, dx / magnitude];
    [this.vy, this.vx] = [
      this.maximumSpeed * unitDy,
      this.maximumSpeed * unitDx
    ];
  }

  public setPhysics(physics: BallPhysics) {
    this.physics = physics;
  }

  public setMaximumSpeed(speed: number) {
    this.maximumSpeed = speed;
  }

  public serialized(): IBallSchema {
    return {
      diameter: this.diameter,
      vx: this.vx,
      vy: this.vy,
      x: this.x,
      y: this.y,
    } as IBallSchema;
  }
}
