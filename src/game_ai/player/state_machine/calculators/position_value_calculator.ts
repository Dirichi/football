import { NUM_SHOT_TARGETS } from "../../../../constants";
import { Ball } from "../../../../game_objects/ball";
import { Field } from "../../../../game_objects/field";
import { Player } from "../../../../game_objects/player";
import { IPositionValueCalculator } from "../../../../interfaces/iposition_value_calculator";
import { Vector3D } from "../../../../three_dimensional_vector";
import { range, round, scale } from "../../../../utils/helper_functions";
import { CongestionCalculator } from "./congestion_calculator";
import { ShotValueCalculator } from "./shot_value_calculator";

export class PositionValueCalculator implements IPositionValueCalculator {
  private ball: Ball;
  private field: Field;
  private congestionCalculator: CongestionCalculator;
  private shotValueCalculator: ShotValueCalculator;

  constructor(
    ball: Ball,
    field: Field,
    congestionCalculator: CongestionCalculator,
    shotValueCalculator: ShotValueCalculator) {
      this.ball = ball;
      this.field = field;
      this.congestionCalculator = congestionCalculator;
      this.shotValueCalculator = shotValueCalculator;
  }

  public evaluate(
    player: Player,
    position: Vector3D = player.getPosition(),
    ballPosition: Vector3D = this.ball.getPosition()): number {
      if (!this.field.containsPoint(position)) {
        return 0;
      }

      const congestion = this.congestionScore(player, position);
      const shotValue = this.bestShotValueScore(player, position);
      const trackingBall =
        this.trackingBallScore(player, position, ballPosition);

      const weightedScore =
        // TODO: Make these weights constants
        (congestion * -0.1) +  (shotValue * 0.2) + (trackingBall * 0.2);
      return weightedScore;
  }

  private congestionScore(player: Player, position: Vector3D): number {
    const congestion = this.congestionCalculator.evaluate(position);
    return congestion;
  }

  private bestShotValueScore(player: Player, position: Vector3D): number {
    // TODO: This is duplicated from the PlayerStateFeatureExtractor.
    // Consider deduplicating.
    const targetOptions = this.shotTargetOptions(player);
    const shotValueScores = targetOptions.map((target) => {
      return this.shotValueCalculator.evaluate(player, target, position);
    });
    return Math.max(...shotValueScores);
  }

  private trackingBallScore(
    player: Player, position: Vector3D, ballPosition: Vector3D): number {
    const distanceToBall = position.distanceTo(ballPosition);
    return scale(distanceToBall, 0, this.field.diagonalLength(), 1, 0);
  }

  private shotTargetOptions(player: Player): Vector3D[] {
    const post = player.getOpposingGoalPost();
    const targetDelta = post.ylength / (NUM_SHOT_TARGETS - 1);

    return range(NUM_SHOT_TARGETS).map((index) => {
      const yPosition = post.y + (index * targetDelta);
      return new Vector3D(post.x, yPosition, 0);
    });
  }
}
