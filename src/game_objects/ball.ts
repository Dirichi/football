import v4 from "uuid/v4";
import { IBallSchema } from "../interfaces/iball_schema";
import { ICircle } from "../interfaces/icircle";
import { ICollidable } from "../interfaces/icollidable";
import { BallPhysics } from "../physics/ball_physics";
import { Vector3D } from "../three_dimensional_vector";

export class Ball implements ICollidable {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;

  private physics?: BallPhysics;
  private maximumSpeed?: number;
  private id: string;
  private kickOffPosition: Vector3D;

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

  public moveTowards(target: Vector3D) {
    // this should be the responsibility of physics
    const position = new Vector3D(this.x, this.y, 0);
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

  public setKickOffPosition(position: Vector3D) {
    this.kickOffPosition = position;
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

  public getPosition(): Vector3D {
    return new Vector3D(this.x, this.y, 0);
  }

  public reposition(newPosition: Vector3D): void {
    [this.x, this.y] = [newPosition.x, newPosition.y];
  }

  public stop(): void {
    [this.vx, this.vy] = [0, 0];
  }

  public prepareForKickOff(): void {
    [this.x, this.y] = [this.kickOffPosition.x, this.kickOffPosition.y];
  }

  public getGameObjectId(): string {
    return this.id;
  }

  public getMaximumSpeed(): number {
    return this.maximumSpeed;
  }

  public getShape(): ICircle {
    return {
      getCentre: () => new Vector3D(this.x, this.y, 0),
      getDiameter: () => this.diameter,
      kind: "circle",
    } as ICircle;
  }
}
