import { TEAM_SIDES } from "../../../../constants";
import { Ball } from "../../../../game_objects/ball";
import { Player } from "../../../../game_objects/player";
import { IPassValueCalculator } from "../../../../interfaces/ipass_value_calculator";
import { IShotValueCalculator } from "../../../../interfaces/ishot_value_calculator";
import { InterceptionCalculator } from "./interception_calculator";

export class PassValueCalculator implements IPassValueCalculator {

  constructor(
    private ball: Ball,
    private interceptionCalculator: InterceptionCalculator,
    private shotValueCalculator: IShotValueCalculator) {
  }

  // TODO: Rename this to evaluate for consistency with other calculators
  // TODO: Consider passing in a Pass object
  public valueFor(player: Player): number {
    if (this.interceptionLikely(player)) {
      return 0;
    }
    return this.shotValueCalculator.evaluate(player);
  }

  private interceptionLikely(player: Player): boolean {
    const opposition = player.getOpposingPlayers();
    const target = player.getPosition();
    const start = this.ball.getPosition();
    const speed = this.ball.getMaximumSpeed();

    return this.interceptionCalculator.canAnyIntercept(
      opposition, start, target, speed);
  }
}
