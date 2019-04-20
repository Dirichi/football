import { Ball } from "../game_objects/ball";
import { IBoundary } from "../interfaces/iboundary";

export class BallPhysics {
  private boundary: IBoundary;
  private ball?: Ball;

  constructor(boundary: IBoundary) {
    this.boundary = boundary;
  }

  public setBall(ball: Ball) {
    this.ball = ball;
  }

  public update() {
    const nextX = this.ball.x + this.ball.vx;
    const nextY = this.ball.y + this.ball.vy;
    const withinBoundary =
      this.boundary.containsCircle(nextX, nextY, this.ball.diameter);
    withinBoundary ? this.move(nextX, nextY) : this.stop();
  }

  private move(x: number, y: number) {
    this.ball.x = x;
    this.ball.y = y;
  }

  private stop() {
    this.ball.vx = 0;
    this.ball.vy = 0;
  }
}
