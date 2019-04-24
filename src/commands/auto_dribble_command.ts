import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class AutoDribbleCommand implements ICommand {
  public execute(player: Player): void {
    if (!player.hasBall()) {
      return;
    }
  }
}