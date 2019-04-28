import { Ball } from "../../../../game_objects/ball";
import { Player } from "../../../../game_objects/player";
import { IShotValueCalculator } from "../../../../interfaces/ishot_value_calculator";
import { InterceptionCalculator } from "./interception_calculator";

export class ShotValueCalculator implements IShotValueCalculator {
  private ball: Ball;
  private interceptionCalculator: InterceptionCalculator;

  constructor(ball: Ball, interceptionCalculator: InterceptionCalculator) {
    this.ball = ball;
    this.interceptionCalculator = interceptionCalculator;
  }

  public valueFor(player: Player): number {
    if (this.interceptionLikelyFor(player)) {
      return 0;
    }

    const maxDistance = Math.sqrt(1.25);
    const distance = this.distanceToGoal(player);
    if (distance > maxDistance / 2) {
      return 0;
    }
    const minScore = 0.1;
    const maxScore = 1;
    const score =
      minScore + (maxDistance - distance) / (maxScore - minScore);
    return score;
  }

  private interceptionLikelyFor(player: Player) {
    const opposition = player.getTeam().getOpposition().getPlayers();
    const target = player.getOpposingGoalPost().getMidPoint();
    const start = player.getPosition();
    const speed = this.ball.getMaximumSpeed();
    const interceptionLikely = this.interceptionCalculator.canAnyIntercept(
      opposition, start, target, speed);
    return interceptionLikely;
  }

  private distanceToGoal(player: Player): number {
    const target = player.getOpposingGoalPost().getMidPoint();
    return player.getPosition().distanceTo(target);
  }
}
