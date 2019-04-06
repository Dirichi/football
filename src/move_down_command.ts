import { Player } from "./player";

export class MoveDownCommand {
  public static execute(player: Player) {
    player.moveDown();
  }
}
