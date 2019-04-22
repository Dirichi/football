import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";

export class MoveToAttackingPositionCommand implements ICommand {
  public execute(player: Player) {
    player.moveTowardsAttackingPosition();
  }
}
