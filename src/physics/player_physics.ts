import { Player } from "../game_objects/player";
import { IBoundary } from "../interfaces/iboundary";

export class PlayerPhysics {
  private boundary: IBoundary;
  private friction: number;

  constructor(boundary: IBoundary, ) {
    // TODO: For some reason the player moves faster vertically
    // than horizontally. Also the player starts moving then stops, before
    // starting again

    this.boundary = boundary;
    this.friction = 0;
  }

  public update(player: Player): void {
    const nextX = player.x + player.vx;
    const nextY = player.y + player.vy;
    const withinBoundary =
      this.boundary.containsCircle(nextX, nextY, player.diameter);
    withinBoundary ? this.move(player) : player.stop();

    this.applyFriction(player);
  }

  public setFriction(friction: number): this {
    this.friction = friction;
    return this;
  }

  private applyFriction(player: Player): void {
    player.vx *= (1 - this.friction);
    player.vy *= (1 - this.friction);
  }

  private move(player: Player): void {
    player.x += player.vx;
    player.y += player.vy;
  }
}
