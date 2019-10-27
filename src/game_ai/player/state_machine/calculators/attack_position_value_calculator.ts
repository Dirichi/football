import { Ball } from "../../../../game_objects/ball";
import { Field } from "../../../../game_objects/field";
import { Player } from "../../../../game_objects/player";
import { IAttackPositionValueCalculator } from "../../../../interfaces/iattack_position_value_calculator";
import { Vector3D } from "../../../../three_dimensional_vector";
import { shotTargetOptions } from "../../../../utils/game_functions";
import { scale } from "../../../../utils/helper_functions";
import { CongestionCalculator } from "./congestion_calculator";
import { ShotValueCalculator } from "./shot_value_calculator";

export class AttackPositionValueCalculator implements IAttackPositionValueCalculator {
  constructor(
    private ball: Ball,
    private field: Field,
    private congestionCalculator: CongestionCalculator,
    private shotValueCalculator: ShotValueCalculator,
    private idealDistanceFromGoal: number,
    private congestionWeight: number,
    private proximityToOpposingPostWeight: number,
    private trackingBallWeight: number,
    private shotValueWeight: number) {
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
        this.trackingBallScore(position, ballPosition);

      const weightedScore =
        (congestion * this.congestionWeight) +
        (proximity * this.proximityToOpposingPostWeight) +
        (trackingBall * this.trackingBallWeight) +
        (shotValue * this.shotValueWeight);
      return weightedScore;
  }

  private congestionScore(player: Player, position: Vector3D): number {
    const playersToMonitor =
      [...player.teamMates(), ...player.getOpposingPlayers()];
    const congestion =
      this.congestionCalculator.evaluate(position, playersToMonitor);
    return congestion;
  }

  private bestShotValueScore(player: Player, position: Vector3D): number {
    const targetOptions = shotTargetOptions(player);
    const shotValueScores = targetOptions.map((target) => {
      return this.shotValueCalculator.evaluate(player, target, position);
    });
    return Math.max(...shotValueScores);
  }

  private trackingBallScore(
    position: Vector3D, ballPosition: Vector3D): number {
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
}
