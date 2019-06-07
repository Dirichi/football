import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class ChaseBallCommand implements ICommand {
  private ball: Ball;

  constructor(ball: Ball) {
    this.ball = ball;
  }

  public execute(player: Player) {
    if (!player.hasBall()) {
      player.moveTowards(this.ball.getPosition());
    } else {
      player.stop();
    }
  }
}
