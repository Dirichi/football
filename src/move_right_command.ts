import { ICommand } from "./icommand";
import { Player } from "./player";

export class MoveRightCommand implements ICommand {
  public execute(player: Player) {
    player.moveRight();
  }
}
