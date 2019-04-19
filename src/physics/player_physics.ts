import { constants, EVENTS } from "../constants";
import { Player } from "../game_objects/player";
import { IBoundary } from "../interfaces/iboundary";

export class PlayerPhysics {
  private boundary: IBoundary;
  private player?: Player;

  constructor(boundary: IBoundary) {
    this.boundary = boundary;
  }

  public update() {
    const nextX = this.player.x + this.player.vx;
    const nextY = this.player.y + this.player.vy;
    const withinBoundary =
      this.boundary.containsCircle(nextX, nextY, this.player.diameter);
    withinBoundary ? this.move() : this.stop();
  }

  private move() {
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;
  }

  private stop() {
    this.player.vx = 0;
    this.player.vy = 0;
  }

  public setPlayer(player: Player) {
    this.player = player;
  }
}
