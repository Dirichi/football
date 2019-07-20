import { Ball } from "../../../../game_objects/ball";
import { Field } from "../../../../game_objects/field";
import { Player } from "../../../../game_objects/player";
import { Vector3D } from "../../../../three_dimensional_vector";
import { scale } from "../../../../utils/helper_functions";

export class DefenceValueCalculator {
  constructor(private ball: Ball, private field: Field) {}

  public evaluate(player: Player, position: Vector3D): number {
    const distanceToAssignedPosition =
      player.defendingPosition().distanceTo(position);
    return scale(
      distanceToAssignedPosition, 0, this.field.diagonalLength(), 1, 0);
  }
}
