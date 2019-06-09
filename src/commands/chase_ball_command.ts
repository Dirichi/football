import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";

export class ChaseBallCommand implements ICommand {
  public execute(player: Player): void {
    player.chaseBall();
  }
}
