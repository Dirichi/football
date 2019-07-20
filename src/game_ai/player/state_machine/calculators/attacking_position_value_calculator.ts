import { IDEAL_DISTANCE_FROM_GOAL, NUM_SHOT_TARGETS } from "../../../../constants";
import { Ball } from "../../../../game_objects/ball";
import { Field } from "../../../../game_objects/field";
import { Player } from "../../../../game_objects/player";
import { IAttackingPositionValueCalculator } from "../../../../interfaces/iattacking_position_value_calculator";
import { Vector3D } from "../../../../three_dimensional_vector";
import { range, round, scale } from "../../../../utils/helper_functions";
import { CongestionCalculator } from "./congestion_calculator";
import { ShotValueCalculator } from "./shot_value_calculator";

export class AttackingPositionValueCalculator implements IAttackingPositionValueCalculator {
  constructor(
    private ball: Ball,
    private field: Field,
    private congestionCalculator: CongestionCalculator,
    private shotValueCalculator: ShotValueCalculator,
    private idealDistanceFromGoal: number = IDEAL_DISTANCE_FROM_GOAL) {
  }

  public evaluate(
    player: Player,
    position: Vector3D = player.getPosition(),
    ballPosition: Vector3D = this.ball.getPosition()): number {
      if (!this.field.containsPoint(position)) {
        return 0;
      }

      const congestion = this.congestionScore(player, position);
      const proximity = this.proximityToOpposingPostScore(player, position);
      const shotValue = this.bestShotValueScore(player, position);
      const trackingBall =
        this.trackingBallScore(player, position, ballPosition);

      const weightedScore =
        // TODO: Make these weights constants
        (congestion * -0.1) +  (proximity * 0.2) + (trackingBall * 0.2) +
          (shotValue * 0.2);
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

  private proximityToOpposingPostScore(
    player: Player, position: Vector3D): number {
      const post = player.getOpposingGoalPost();
      const distanceToPost = Math.abs(position.x - post.getMidPoint().x);

      if (distanceToPost <= this.idealDistanceFromGoal) {
        return 1;
      }
      return scale(
        distanceToPost, this.idealDistanceFromGoal, this.field.xlength, 1, 0);
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
