import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class MoveCommand implements ICommand {
  public execute(player: Player, direction: ThreeDimensionalVector) {
    player.moveInDirection(direction);
  }
}
