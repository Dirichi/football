import { ICommand } from "./icommand";
import { Player } from "./player";

export class MoveDownCommand implements ICommand {
  public execute(player: Player) {
    player.moveDown();
  }
}
