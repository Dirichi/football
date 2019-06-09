import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class ShootBallCommand implements ICommand {
  public execute(player: Player): void {
    const postMidPoint = player.getOpposingGoalPost().getMidPoint();
    player.kickBall(postMidPoint);
  }
}
