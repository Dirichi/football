import { EventQueue } from "../src/event_queue";

export class Ball {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;

  constructor(x: number, y: number, vx: number, vy: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  public animate() {
    this.x += this.vx;
    this.y += this.vy;
  }
}
