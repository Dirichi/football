import { constants, EVENTS } from "../constants";
import { Player } from "../game_objects/player";
import { IBallControlPayload } from "../interfaces/iball_control_payload";
import { IBoundary } from "../interfaces/iboundary";
import { ICircle } from "../interfaces/icircle";
import { ICollisionPayload } from "../interfaces/icollision_payload";
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
    withinBoundary ? this.move() : this.player.stop();

    this.applyFriction();
  }

  public setPlayer(player: Player): void {
    this.player = player;
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
}
