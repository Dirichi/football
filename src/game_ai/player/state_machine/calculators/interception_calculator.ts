import { Player } from "../../../../game_objects/player";
import { Vector3D } from "../../../../three_dimensional_vector";

export class InterceptionCalculator {
  public canAnyIntercept(
    players: Player[],
    startPosition: Vector3D,
    targetPosition: Vector3D,
    speed: number): boolean {

      return players.some((player) => {
        return this.canIntercept(player, startPosition, targetPosition, speed);
      });
    }

    private canIntercept(
      player: Player,
      startPosition: Vector3D,
      targetPosition: Vector3D,
      speed: number): boolean {

        // TODO: Consider references to entity shapes as an opportunity to
        // introduce bounding boxes
        const playerRadius = player.getShape().getDiameter() / 2;

        const startToTarget = targetPosition.minus(startPosition);
        const startToPlayer = player.getPosition().minus(startPosition);

        // If the player is behind the ball return false
        // this assumes that the ball is always faster than the player
        // which reflects real life.
        if (startToTarget.dotProduct(startToPlayer) < 0) {
          return false;
        }

        if (startToPlayer.magnitude() > startToTarget.magnitude()) {
          // TODO: Test and document this
          return false;
        }

        const playerDistanceToInterception =
          startToPlayer.perpendicularDistanceTo(startToTarget) - playerRadius;
        const distanceToInterception =
          startToPlayer.scalarProjectionOnTo(startToTarget);

        const playerTimeOfArrival =
          playerDistanceToInterception / player.getMaximumSpeed();
        const objectTimeOfArrival =
          distanceToInterception / speed;

        return playerTimeOfArrival <= objectTimeOfArrival;
      }
}
