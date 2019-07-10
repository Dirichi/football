import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { Vector3D } from "../three_dimensional_vector";

export class MoveCommand implements ICommand {
  public execute(player: Player, direction: Vector3D) {
    player.moveInDirection(direction);
  }
}
