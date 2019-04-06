import { Player } from "./player";

export class MoveLeftCommand {
  public static execute(player: Player) {
    player.moveLeft();
  }
}
