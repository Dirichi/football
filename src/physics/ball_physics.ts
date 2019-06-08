import { Ball } from "../game_objects/ball";
import { IBallControlPayload } from "../interfaces/iball_control_payload";
import { IBoundary } from "../interfaces/iboundary";
import { IEventQueue } from "../interfaces/ievent_queue";

export class BallPhysics {
  private boundary: IBoundary;
  private ball?: Ball;
  private friction: number;
  private queue: IEventQueue;

  constructor(boundary: IBoundary, queue: IEventQueue) {
    this.boundary = boundary;
    this.queue = queue;
    this.friction = 0;
  }

  public setBall(ball: Ball) {
    this.ball = ball;
  }

  public update() {
    const nextX = this.ball.x + this.ball.vx;
    const nextY = this.ball.y + this.ball.vy;
    const withinBoundary =
      this.boundary.containsCircle(nextX, nextY, this.ball.diameter);
    withinBoundary ? this.move(nextX, nextY) : this.ball.stop();

    this.applyFriction();
  }

  public setFriction(friction: number) {
    this.friction = friction;
  }

  public applyFriction() {
    this.ball.vx *= (1 - this.friction);
    this.ball.vy *= (1 - this.friction);
  }

  private move(x: number, y: number) {
    this.ball.x = x;
    this.ball.y = y;
  }
}
