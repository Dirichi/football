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
    this.listenForControl();
  }

  public update() {
    const nextX = this.ball.x + this.ball.vx;
    const nextY = this.ball.y + this.ball.vy;
    const withinBoundary =
      this.boundary.containsCircle(nextX, nextY, this.ball.diameter);
    withinBoundary ? this.move(nextX, nextY) : this.stop();

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

  private stop() {
    this.ball.vx = 0;
    this.ball.vy = 0;
  }

  private listenForControl() {
    // TODO: Listen for the specific ball by id
    this.queue.when("ball.control", (data) => {
      const controlPayload = data as IBallControlPayload;
      this.adjustBall(controlPayload);
    });
  }

  private adjustBall(controlPayload: IBallControlPayload) {
    this.ball.x = controlPayload.newX;
    this.ball.y = controlPayload.newY;
    this.ball.vx = controlPayload.newVx;
    this.ball.vy = controlPayload.newVy;
  }
}
