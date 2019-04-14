import { ICommand } from "./icommand";
import { Player } from "./player";

export class StopCommand implements ICommand {
  public execute(player: Player) {
    player.stop();
  }
}
