import { Player } from "../../../../game_objects/player";
import { IDribblingValueCalculator } from "../../../../interfaces/idribbling_value_calculator";
import { IPositionValueCalculator } from "../../../../interfaces/iposition_value_calculator";
import { Vector3D } from "../../../../three_dimensional_vector";
import { InterceptionCalculator } from "./interception_calculator";

export class DribblingValueCalculator implements IDribblingValueCalculator {
  constructor(
    private positionValueCalculator: IPositionValueCalculator,
    private interceptionCalculator: InterceptionCalculator) {}

  public evaluate(player: Player, position: Vector3D): number {
    if (this.interceptionLikely(player, position)) {
      return 0;
    }

    return this.positionValueCalculator.evaluate(player, position, true);
  }

  private interceptionLikely(player: Player, position: Vector3D): boolean {
    const opposition = player.getOpposingPlayers();
    const start = player.getPosition();
    const target = position;
    const speed = player.getMaximumSpeed();

    return this.interceptionCalculator.canAnyIntercept(
      opposition, start, target, speed);
  }
}
