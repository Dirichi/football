import { Ball } from "../src/ball";
import { IBoundary } from "../src/iboundary";

export class BallPhysics {
  private boundary: IBoundary;

  constructor(boundary: IBoundary) {
    this.boundary = boundary;
  }

  public update(ball: Ball) {
    const withinBoundary =
      this.boundary.containsCircle(ball.x, ball.y, ball.diameter);
    withinBoundary ? this.move(ball) : this.stop(ball);
  }
  private move(ball: Ball) {
    ball.x += ball.vx;
    ball.y += ball.vy;
  }

  private stop(ball: Ball) {
    ball.vx = 0;
    ball.vy = 0;
  }
}
