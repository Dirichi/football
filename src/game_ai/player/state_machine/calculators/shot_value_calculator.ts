import { Ball } from "../../../../game_objects/ball";
import { Player } from "../../../../game_objects/player";
import { IShotValueCalculator } from "../../../../interfaces/ishot_value_calculator";
import { Vector3D } from "../../../../three_dimensional_vector";
import { InterceptionCalculator } from "./interception_calculator";

export class ShotValueCalculator implements IShotValueCalculator {
  private ball: Ball;
  private interceptionCalculator: InterceptionCalculator;

  constructor(
    ball: Ball,
    interceptionCalculator: InterceptionCalculator) {
      this.ball = ball;
      this.interceptionCalculator = interceptionCalculator;
  }

  public evaluate(
    player: Player,
    target: Vector3D,
    shootingFrom: Vector3D = player.getPosition()): number {
      // TODO: Make sure to return 0 is the target is not within the post
      // if (!player.getOpposingGoalPost().containsPoint(target)) { return 0; }

      return this.interceptionLikely(player, target, shootingFrom) ? 0 : 1;
  }

  private interceptionLikely(
    player: Player, target: Vector3D, position: Vector3D): boolean {
    const opposition = player.getOpposingPlayers();
    const speed = this.ball.getMaximumSpeed();

    return this.interceptionCalculator.canAnyIntercept(
      opposition, position, target, speed);
  }
}
