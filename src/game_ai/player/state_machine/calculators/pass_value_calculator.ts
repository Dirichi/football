import { TEAM_SIDES } from "../../../../constants";
import { Ball } from "../../../../game_objects/ball";
import { Player } from "../../../../game_objects/player";
import { IPassValueCalculator } from "../../../../interfaces/ipass_value_calculator";
import { IShotValueCalculator } from "../../../../interfaces/ishot_value_calculator";
import { Vector3D } from "../../../../three_dimensional_vector";
import { InterceptionCalculator } from "./interception_calculator";

export class PassValueCalculator implements IPassValueCalculator {
  constructor(
    private ball: Ball,
    private interceptionCalculator: InterceptionCalculator,
    private shotValueCalculator: IShotValueCalculator) {
  }

  // TODO: Consider passing in a Pass object
  public evaluate(
    player: Player, position: Vector3D = this.ball.getPosition()): number {
    if (this.interceptionLikely(player, position)) {
      return 0;
    }
    return this.shotValueCalculator.evaluate(player);
  }

  private interceptionLikely(player: Player, position: Vector3D): boolean {
    const opposition = player.getOpposingPlayers();
    const target = player.getPosition();
    const start = position;
    const speed = this.ball.getMaximumSpeed();

    return this.interceptionCalculator.canAnyIntercept(
      opposition, start, target, speed);
  }
}
