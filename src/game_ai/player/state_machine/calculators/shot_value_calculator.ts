import {
   SHOT_VALUE_IDEAL_DISTANCE_FROM_GOAL,
   SHOT_VALUE_INTERCEPTION_LIKELIHOOD_WEIGHT,
   SHOT_VALUE_PROXIMITY_TO_POST_WEIGHT } from "../../../../constants";
import { Ball } from "../../../../game_objects/ball";
import { Field } from "../../../../game_objects/field";
import { Player } from "../../../../game_objects/player";
import { IShotValueCalculator } from "../../../../interfaces/ishot_value_calculator";
import { Vector3D } from "../../../../three_dimensional_vector";
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
    target: Vector3D,
    shootingFrom: Vector3D = player.getPosition()): number {
      // TODO: Make sure to return 0 is the target is not within the post
      // if (!player.getOpposingGoalPost().containsPoint(target)) { return 0; }

      const weightedInterceptionLikelihood =
        this.interceptionLikelihood(player, target, shootingFrom) *
        this.interceptionLikelihoodWeight;
      const weightedProximityToPost =
        this.proximityToPost(player, target, shootingFrom) *
          this.proximityToPostWeight;

      return  weightedProximityToPost - weightedInterceptionLikelihood;
  }

  private proximityToPost(
    player: Player, target: Vector3D, shootingFrom: Vector3D): number {
    const distance = target.distanceTo(shootingFrom);
    if (distance <= this.idealDistanceFromGoal) {
      return 1;
    }
    return scale(
      distance, this.idealDistanceFromGoal, this.field.diagonalLength(), 1, 0);
  }

  private interceptionLikelihood(
    player: Player, target: Vector3D, position: Vector3D): number {
    const opposition = player.getOpposingPlayers();
    const speed = this.ball.getMaximumSpeed();

    const likely = this.interceptionCalculator.canAnyIntercept(
      opposition, position, target, speed);
    return likely ? 1 : 0;
  }
}
