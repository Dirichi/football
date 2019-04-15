import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";

export class MoveUpCommand implements ICommand {
  public execute(player: Player) {
    player.moveUp();
  }
}
