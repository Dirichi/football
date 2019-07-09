import { CongestionCalculator } from "./game_ai/player/state_machine/calculators/congestion_calculator";
import { ShotValueCalculator } from "./game_ai/player/state_machine/calculators/shot_value_calculator";
import { Ball } from "./game_objects/ball";
import { Field } from "./game_objects/field";
import { Player } from "./game_objects/player";
import { IPositionValueCalculator } from "./interfaces/iposition_value_calculator";
import { ThreeDimensionalVector } from "./three_dimensional_vector";
import { round, scale } from "./utils/helper_functions";

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

  public evaluate(player: Player, position: ThreeDimensionalVector): number {
    // TODO: Use a more fluent way to check if a position is within the bounds
    if (!this.field.containsCircle(position.x, position.y, 0.001)) {
      return 0;
    }

    const congestion = this.congestionScore(player, position);
    const shotValue = this.shotValueScore(player, position);
    const trackingBall = this.trackingBallScore(player, position);

    const weightedScore =
      // TODO: Make these weights constants
      (congestion * -0.2) + (shotValue * 0.4) + (trackingBall * 0.4);
    return round(weightedScore, 2);
  }

  private congestionScore(
    player: Player, position: ThreeDimensionalVector): number {
      const congestion = this.congestionCalculator.evaluate(position);
      // Make this factor a constant
      return congestion;
  }

  private shotValueScore(
    player: Player, position: ThreeDimensionalVector): number {
      return this.shotValueCalculator.evaluate(player, position);
    }

  private trackingBallScore(
    player: Player, position: ThreeDimensionalVector): number {
      const distanceToBall = position.distanceTo(this.ball.getPosition());
      return scale(distanceToBall, 0, this.field.diagonalLength(), 1, 0);
    }
}
