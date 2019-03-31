// import { EventQueue } from "../src/event_queue";
export class Ball {
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

}
