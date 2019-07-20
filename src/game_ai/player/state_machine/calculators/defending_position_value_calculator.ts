import { Ball } from "../../../../game_objects/ball";
import { Field } from "../../../../game_objects/field";
import { Player } from "../../../../game_objects/player";
import { Vector3D } from "../../../../three_dimensional_vector";
import { scale } from "../../../../utils/helper_functions";
import { CongestionCalculator } from "./congestion_calculator";
import { InterceptionCalculator } from "./interception_calculator";

export class DefendingPositionValueCalculator {
  constructor(
    private ball: Ball,
    private field: Field,
    private congestionCalculator: CongestionCalculator) {}

  public evaluate(player: Player, position: Vector3D): number {
    if (!this.field.containsPoint(position)) {
      return 0;
    }

    const tracking = this.trackingBallScore(player, position);
    const congestion = this.congestionScore(player, position);
    const marking = this.aheadOfBallScore(player, position);

    return (-0.3 * congestion) + (0.2 * marking) + (0.02 * tracking);
  }

  private trackingBallScore(player: Player, position: Vector3D): number {
    const distanceToBall = position.distanceTo(this.ball.getPosition());
    return scale(distanceToBall, 0, this.field.diagonalLength(), 1, 0);
  }

  private aheadOfBallScore(player: Player, position: Vector3D): number {
    const postPosition = player.getTeamGoalPost().getMidPoint();
    const distanceToPost = Math.abs(postPosition.x - position.x);
    const ballDistanceToPost =
      Math.abs(postPosition.x - this.ball.getPosition().x);

    const distanceAheadOfBall = ballDistanceToPost - distanceToPost;
    const idealDistanceAheadOfBall = this.field.xlength / 8;
    if (distanceAheadOfBall >= idealDistanceAheadOfBall) { return 1; }

    return scale(
      distanceAheadOfBall, -this.field.xlength, idealDistanceAheadOfBall, 0, 1);
  }

  private congestionScore(player: Player, position: Vector3D): number {
    const playersToConsider = player.teamMates();
    return this.congestionCalculator.evaluate(position, playersToConsider);
  }
}
