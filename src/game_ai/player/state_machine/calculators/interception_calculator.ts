import { Player } from "../../../../game_objects/player";
import { ThreeDimensionalVector } from "../../../../three_dimensional_vector";

export class InterceptionCalculator {
  public canAnyIntercept(
    players: Player[],
    startPosition: ThreeDimensionalVector,
    targetPosition: ThreeDimensionalVector,
    speed: number): boolean {

      return players.some((player) => {
        return this.canIntercept(player, startPosition, targetPosition, speed);
      });
    }

    private canIntercept(
      player: Player,
      startPosition: ThreeDimensionalVector,
      targetPosition: ThreeDimensionalVector,
      speed: number): boolean {

        // TODO: Consider references to entity shapes as an opportunity to
        // introduce bounding boxes
        const playerRadius = player.getShape().getDiameter() / 2;

        const startToTarget = targetPosition.minus(startPosition);
        const playerToStart = player.getPosition().minus(startPosition);

        // If the player is behind the ball return false
        // this assumes that the ball is always faster than the player
        // which reflects real life.
        if (startToTarget.dotProduct(playerToStart) < 0) {
          return false;
        }

        const playerDistanceToInterception =
          playerToStart.perpendicularDistanceTo(startToTarget) - playerRadius;
        const distanceToInterception =
          playerToStart.scalarProjectionOnTo(startToTarget);

        if (startToTarget.magnitude() < distanceToInterception) {
          // TODO: Test and document this
          return false;
        }

        const playerTimeOfArrival =
          playerDistanceToInterception / player.getMaximumSpeed();
        const objectTimeOfArrival =
          distanceToInterception / speed;

        return playerTimeOfArrival <= objectTimeOfArrival;
      }
}