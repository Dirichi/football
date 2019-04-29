import { constants, EVENTS } from "../constants";
import { Player } from "../game_objects/player";
import { IBallControlPayload } from "../interfaces/iball_control_payload";
import { IBoundary } from "../interfaces/iboundary";
import { ICircle } from "../interfaces/icircle";
import { IEventQueue } from "../interfaces/ievent_queue";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class PlayerPhysics {
  private boundary: IBoundary;
  private friction: number;
  private player?: Player;
  private queue: IEventQueue;

  constructor(boundary: IBoundary, queue: IEventQueue) {
    // TODO: For some reason the player moves faster vertically
    // than horizontally. Also the player starts moving then stops, before
    // starting again

    this.boundary = boundary;
    this.queue = queue;
    this.friction = 0;
  }

  public update(): void {
    const nextX = this.player.x + this.player.vx;
    const nextY = this.player.y + this.player.vy;
    const withinBoundary =
      this.boundary.containsCircle(nextX, nextY, this.player.diameter);
    withinBoundary ? this.move() : this.stop();

    this.applyFriction();
  }

  public setPlayer(player: Player): void {
    this.player = player;
    this.listenForCollisions();
  }

  public setFriction(friction: number): void {
    this.friction = friction;
  }

  private applyFriction(): void {
    this.player.vx *= (1 - this.friction);
    this.player.vy *= (1 - this.friction);
  }

  private move(): void {
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;
  }

  private stop(): void {
    this.player.vx = 0;
    this.player.vy = 0;
  }

  private listenForCollisions(): void {
    this.queue.when(`${this.player.getGameObjectId()}.collision`, (data) => {
      const payload = data as { colliderType: string, shape: ICircle };
      this.handleCollision(payload);
    });
  }

  private handleCollision(
    collisionPayload: { colliderType: string, shape: ICircle }): void {
    if (collisionPayload.colliderType === "ball" && !this.player.kickingBall) {
      this.controlBall(collisionPayload.shape);
    }
  }

  private controlBall(ball: ICircle): void {
    const newBallPosition = this.calculateNewBallPosition(ball);
    const payload: IBallControlPayload = {
      newVx: 0,
      newVy: 0,
      newX: newBallPosition.x,
      newY: newBallPosition.y,
    };
    this.queue.trigger("ball.control", payload);
  }

  private calculateNewBallPosition(ball: ICircle): ThreeDimensionalVector {
    const velocity = this.player.getVelocity();
    if (velocity.isZero()) {
      return ball.getCentre();
    }

    const desiredMargin = (this.player.diameter + ball.getDiameter()) / 2;
    return velocity
      .unit()
      .scalarMultiply(desiredMargin)
      .add(this.player.getPosition());
  }
}
