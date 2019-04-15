import { ICommand } from "./icommand";
import { Player } from "./player";

export class MoveUpCommand implements ICommand {
  public execute(player: Player) {
    player.moveUp();
  }
}
