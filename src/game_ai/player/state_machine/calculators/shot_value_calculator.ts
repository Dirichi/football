import {
   SHOT_VALUE_IDEAL_DISTANCE_FROM_GOAL,
   SHOT_VALUE_INTERCEPTION_LIKELIHOOD_WEIGHT,
   SHOT_VALUE_PROXIMITY_TO_POST_WEIGHT } from "../../../../constants";
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
  private interceptionLikelihoodWeight: number;
  private proximityToPostWeight: number;
  private idealDistanceFromGoal: number;

  constructor(
    ball: Ball,
    field: Field,
    interceptionCalculator: InterceptionCalculator,
    interceptionLikelihoodWeight: number =
      SHOT_VALUE_INTERCEPTION_LIKELIHOOD_WEIGHT,
    proximityToPostWeight: number = SHOT_VALUE_PROXIMITY_TO_POST_WEIGHT,
    idealDistanceFromGoal: number = SHOT_VALUE_IDEAL_DISTANCE_FROM_GOAL) {
      this.ball = ball;
      this.field = field;
      this.interceptionCalculator = interceptionCalculator;
      this.interceptionLikelihoodWeight = interceptionLikelihoodWeight;
      this.proximityToPostWeight = proximityToPostWeight;
      this.idealDistanceFromGoal = idealDistanceFromGoal;
  }

  public evaluate(
    player: Player,
    position: ThreeDimensionalVector = player.getPosition()): number {
      const weightedInterceptionLikelihood =
        this.interceptionLikelihood(player, position) *
        this.interceptionLikelihoodWeight;
      const weightedProximityToPost =
        this.proximityToPost(player, position) * this.proximityToPostWeight;

      return  weightedProximityToPost - weightedInterceptionLikelihood;
  }

  private proximityToPost(
    player: Player, position: ThreeDimensionalVector): number {
      const distance = player.getOpposingGoalPost().distanceTo(position);
      if (distance <= this.idealDistanceFromGoal) {
        return 1;
      }
      return scale(
        distance,
        this.idealDistanceFromGoal,
        this.field.diagonalLength(),
        1,
        0
      );
  }

  private interceptionLikelihood(
    player: Player, position: ThreeDimensionalVector): number {
    // TODO: This should be all players, including the keeper.
    const opposition = player.getOpposingFieldPlayers();
    const target = player.getOpposingGoalPost().getMidPoint();
    const speed = this.ball.getMaximumSpeed();

    const likely = this.interceptionCalculator.canAnyIntercept(
      opposition, position, target, speed);
    return likely ? 1 : 0;
  }
}
