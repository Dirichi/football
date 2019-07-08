import { TEAM_SIDES } from "../../../../constants";
import { Ball } from "../../../../game_objects/ball";
import { Player } from "../../../../game_objects/player";
import { IPassValueCalculator } from "../../../../interfaces/ipass_value_calculator";
import { IShotValueCalculator } from "../../../../interfaces/ishot_value_calculator";
import { InterceptionCalculator } from "./interception_calculator";

export class PassValueCalculator implements IPassValueCalculator {
  private ball: Ball;
  private interceptionCalculator: InterceptionCalculator;
  private shotValueCalculator: IShotValueCalculator;

  constructor(
    ball: Ball,
    interceptionCalculator: InterceptionCalculator,
    shotValueCalculator: IShotValueCalculator) {
      this.ball = ball;
      this.interceptionCalculator = interceptionCalculator;
      this.shotValueCalculator = shotValueCalculator;
  }

  // TODO: Perhaps pass in an actual Pass object
  // TODO: Change this to `evaluate` for consistency.
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

    const interceptionLikely = this.interceptionCalculator.canAnyIntercept(
      opposition, start, target, speed);
    return interceptionLikely;
  }
}
