import { MAXIMUM_SHOT_VALUE, MINIMUM_SHOT_VALUE } from "../../../../constants";
import { Ball } from "../../../../game_objects/ball";
import { Field } from "../../../../game_objects/field";
import { Player } from "../../../../game_objects/player";
import { IShotValueCalculator } from "../../../../interfaces/ishot_value_calculator";
import { ThreeDimensionalVector } from "../../../../three_dimensional_vector";
import { scale } from "../../../../utils/helper_functions";
import { InterceptionCalculator } from "./interception_calculator";

export class ShotValueCalculator implements IShotValueCalculator {
  private ball: Ball;
  private field: Field;
  private interceptionCalculator: InterceptionCalculator;
  private minShotValue: number;
  private maxShotValue: number;
  private idealDistanceFromGoal: number;

  constructor(
    ball: Ball,
    field: Field,
    interceptionCalculator: InterceptionCalculator,
    minShotValue: number = MINIMUM_SHOT_VALUE,
    maxShotValue: number = MAXIMUM_SHOT_VALUE,
    idealDistanceFromGoal: number = field.xlength / 3) {
      this.ball = ball;
      this.field = field;
      this.interceptionCalculator = interceptionCalculator;
      this.minShotValue = minShotValue;
      this.maxShotValue = maxShotValue;
      this.idealDistanceFromGoal = idealDistanceFromGoal;
  }

  public evaluate(
    player: Player, shootingFrom?: ThreeDimensionalVector ): number {
      const startingPosition = shootingFrom || player.getPosition();

      if (this.interceptionLikely(player, startingPosition)) {
        return this.minShotValue;
      }

      const distance =
        player.getOpposingGoalPost().distanceTo(startingPosition);

      if (distance <= this.idealDistanceFromGoal) {
        return this.maxShotValue;
      }

      const naiveScore = scale(
        distance,
        this.idealDistanceFromGoal,
        this.field.xlength,
        this.maxShotValue,
        this.minShotValue
      );

      return Math.max(naiveScore, this.minShotValue);
  }

  private interceptionLikely(
    player: Player, startingPosition: ThreeDimensionalVector) {
    const opposition = player.getOpposingFieldPlayers();
    const target = player.getOpposingGoalPost().getMidPoint();
    const speed = this.ball.getMaximumSpeed();

    return this.interceptionCalculator.canAnyIntercept(
      opposition, startingPosition, target, speed);
  }
}
