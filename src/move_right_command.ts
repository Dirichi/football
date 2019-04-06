import { Player } from "./player";

export class MoveRightCommand {
  public static execute(player: Player) {
    player.moveRight();
  }
}
