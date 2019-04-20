import v4 from "uuid/v4";
import { IBallSchema } from "../interfaces/iball_schema";
import { ICircle } from "../interfaces/icircle";
import { ICollidable } from "../interfaces/icollidable";
import { BallPhysics } from "../physics/ball_physics";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class Ball implements ICollidable {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;

  private physics?: BallPhysics;
  private maximumSpeed?: number;
  private mass?: number;
  private id: string;

  constructor(x: number, y: number, vx: number, vy: number, diameter: number) {
    this.id = v4(); // Random unique id generation
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