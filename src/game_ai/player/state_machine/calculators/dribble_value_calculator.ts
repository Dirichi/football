import { Player } from "../../../../../src/game_objects/player";
import { Vector3D } from "../../../../../src/three_dimensional_vector";
import { IAttackPositionValueCalculator } from "../../../../interfaces/iattack_position_value_calculator";
import { IDribbleValueCalculator } from "../../../../interfaces/idribble_value_calculator";
import { scale } from "../../../../utils/helper_functions";
import { InterceptionCalculator } from "./interception_calculator";

interface IDribble {
  player: Player;
  startPosition: Vector3D;
  endPosition: Vector3D;
  speed: number;
}

export class DribbleValueCalculator implements IDribbleValueCalculator {
  constructor(
    private positionValueCalculator: IAttackPositionValueCalculator,
    private interceptionCalculator: InterceptionCalculator) {}

    public evaluate(
      player: Player,
      endPosition: Vector3D,
      startPosition: Vector3D = player.getPosition()): number {
        const dribble = {
          endPosition,
          player,
          speed: player.getMaximumSpeed(),
          startPosition,
        } as IDribble;

        if (this.dribbleCanBeIntercepted(dribble)) { return 0; }
        const ballPosition = endPosition;
        return this.positionValueCalculator.evaluate(
          player, endPosition, ballPosition);
    }

    private dribbleCanBeIntercepted(dribble: IDribble): boolean {
      const opposition = dribble.player.getOpposingPlayers();

      return this.interceptionCalculator.canAnyIntercept(
        opposition, dribble.startPosition, dribble.endPosition, dribble.speed);
    }
}
