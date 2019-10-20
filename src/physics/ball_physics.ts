import { Ball } from "../game_objects/ball";
import { IBoundary } from "../interfaces/iboundary";

export class BallPhysics {
  private boundary: IBoundary;
  private friction: number;

  constructor(boundary: IBoundary) {
    this.boundary = boundary;
    this.friction = 0;
  }

  public update(ball: Ball) {
    const nextX = ball.x + ball.vx;
    const nextY = ball.y + ball.vy;
    const withinBoundary =
      this.boundary.containsCircle(nextX, nextY, ball.diameter);
    withinBoundary ? this.move(ball, nextX, nextY) : ball.stop();

    this.applyFriction(ball);
  }

  public setFriction(friction: number): this {
    this.friction = friction;
    return this;
  }

  public applyFriction(ball: Ball) {
    ball.vx *= (1 - this.friction);
    ball.vy *= (1 - this.friction);
  }

  private move(ball: Ball, x: number, y: number) {
    ball.x = x;
    ball.y = y;
  }
}
