import { Ball } from "../src/ball";
import { IBoundary } from "../src/iboundary";

export class BallPhysics {
  private boundary: IBoundary;

  constructor(boundary: IBoundary) {
    this.boundary = boundary;
  }

  public update(ball: Ball) {
    const nextX = ball.x + ball.vx;
    const nextY = ball.y + ball.vy;
    const withinBoundary =
      this.boundary.containsCircle(nextX, nextY, ball.diameter);
    withinBoundary ? this.move(ball, nextX, nextY) : this.stop(ball);
  }

  private move(ball: Ball, x: number, y: number) {
    ball.x = x;
    ball.y = y;
  }

  private stop(ball: Ball) {
    ball.vx = 0;
    ball.vy = 0;
  }
}
