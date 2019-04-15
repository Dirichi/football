import { constants, EVENTS } from "./constants";
import { IBoundary } from "./iboundary";
import { Player } from "./player";

export class PlayerPhysics {
  private boundary: IBoundary;

  constructor(boundary: IBoundary) {
    this.boundary = boundary;
  }

  public update(player: Player) {
    const nextX = player.x + player.vx;
    const nextY = player.y + player.vy;
    const withinBoundary =
      this.boundary.containsCircle(nextX, nextY, player.diameter);

    if (!withinBoundary) {
      this.stop(player);
    }
    this.move(player);
  }

  private move(player: Player) {
    player.x += player.vx;
    player.y += player.vy;
  }

  private stop(player: Player) {
    player.vx = 0;
    player.vy = 0;
  }
}
