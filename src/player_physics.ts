import { constants, EVENTS } from "./constants";
import { EventQueue } from "./event_queue";
import { IBoundary } from "./iboundary";
import { Player } from "./player";

export class PlayerPhysics {
  private boundary: IBoundary;
  private queue: EventQueue;

  constructor(boundary: IBoundary, queue: EventQueue) {
    this.boundary = boundary;
    this.queue = queue;
  }

  public update(player: Player) {
    const nextX = player.x + player.vx;
    const nextY = player.y + player.vy;
    const withinBoundary =
      this.boundary.containsCircle(nextX, nextY, player.diameter);
    withinBoundary ? this.move(player) : this.stop(player);
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
