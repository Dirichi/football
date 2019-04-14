import { ICommand } from "./icommand";
import { Player } from "./player";

export class MoveLeftCommand implements ICommand {
  public execute(player: Player) {
    player.moveLeft();
  }
}
