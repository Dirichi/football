import { Player } from "./player";

export class MoveUpCommand {
  public static execute(player: Player) {
    player.moveUp();
  }
}
