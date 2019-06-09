import { Player } from "../game_objects/player";
import { IBoundary } from "../interfaces/iboundary";
import { ICircle } from "../interfaces/icircle";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class PlayerPhysics {
  private boundary: IBoundary;
  private friction: number;
  private player?: Player;

  constructor(boundary: IBoundary, ) {
    // TODO: For some reason the player moves faster vertically
    // than horizontally. Also the player starts moving then stops, before
    // starting again

    this.boundary = boundary;
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
