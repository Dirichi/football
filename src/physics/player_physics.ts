import { constants, EVENTS } from "../constants";
import { Player } from "../game_objects/player";
import { IBoundary } from "../interfaces/iboundary";
import { IEventQueue } from "../interfaces/ievent_queue";

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
      const payload = data as { colliderType: string };
      this.handleCollision(payload);
    });
  }

  private handleCollision(collisionPayload: { colliderType: string }): void {
    if (collisionPayload.colliderType === "ball" && !this.player.kickingBall) {
      this.controlBall();
    }
  }

  private controlBall(): void {
    this.queue.trigger("ball.control", {
      newVx: this.player.vx,
      newVy: this.player.vy,
      newX: this.player.x,
      newY: this.player.y,
    });
  }
}
