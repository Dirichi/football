import { IBallSchema } from "./iball_schema";

export class Ball {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;

  constructor(coordinates: number[]) {
    this.x = coordinates[0];
    this.y = coordinates[1];
    this.vx = coordinates[2];
    this.vy = coordinates[3];
    this.diameter = coordinates[4];
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
