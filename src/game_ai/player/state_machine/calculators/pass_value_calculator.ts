import { TEAM_SIDES } from "../../../../constants";
import { Ball } from "../../../../game_objects/ball";
import { Player } from "../../../../game_objects/player";
import { InterceptionCalculator } from "./interception_calculator";
import { IPassValueCalculator } from '../../../../src/interfaces/ipass_value_calculator';

export class PassValueCalculator implements IPassValueCalculator {
  private ball: Ball;
  private interceptionCalculator: InterceptionCalculator;

  constructor(ball: Ball, interceptionCalculator: InterceptionCalculator) {
    this.ball = ball;
    this.interceptionCalculator = interceptionCalculator;
  }

  public valueFor(player: Player): number {
    if (this.interceptionLikely(player)) {
      return 0;
    }

    const score = this.aheadOfBall(player) ? 0.9 : 0.3;
    return score;
  }

  private interceptionLikely(player: Player): boolean {
    // TODO: So we just don't care about Demeter eh?
    const opposition = player.getTeam().getOpposition().getPlayers();
    const target = player.getPosition();
    const start = this.ball.getPosition();
    const speed = this.ball.getMaximumSpeed();

    const interceptionLikely = this.interceptionCalculator.canAnyIntercept(
      opposition, start, target, speed);
    return interceptionLikely;
  }

  private aheadOfBall(player: Player): boolean {
    if (player.getTeam().getSide() === TEAM_SIDES.LEFT) {
      return player.getPosition().x > this.ball.getPosition().x;
    }

    return player.getPosition().x < this.ball.getPosition().x;
  }
}
