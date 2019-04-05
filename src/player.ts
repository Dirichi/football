import { IPlayerSchema } from "./iplayer_schema";

export class Player {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;

  constructor(x: number, y: number, vx: number, vy: number, diameter: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.diameter = diameter;
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
