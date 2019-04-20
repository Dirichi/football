import { IBallSchema } from "../interfaces/iball_schema";
import { BallPhysics } from "../physics/ball_physics";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class Ball {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;

  private physics?: BallPhysics;
  private maximumSpeed?: number;
  private mass?: number;

  constructor(x: number, y: number, vx: number, vy: number, diameter: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.diameter = diameter;
  }

  public update() {
    this.physics.update();
  }

  public moveTowards(target: ThreeDimensionalVector) {
    // this should be the responsibility of physics
    const position = new ThreeDimensionalVector(this.x, this.y, 0);
    const unitDelta = target.minus(position).unit();
    const velocity = unitDelta.scalarMultiply(this.maximumSpeed);

    [this.vx, this.vy] = [velocity.x, velocity.y];
  }

  public setPhysics(physics: BallPhysics) {
    this.physics = physics;
    this.physics.setBall(this);
  }

  public setMaximumSpeed(speed: number) {
    this.maximumSpeed = speed;
  }

  public setMass(mass: number) {
    this.mass = mass;
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
