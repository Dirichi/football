import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class ShootBallCommand implements ICommand {
  private ball: Ball;

  constructor(ball: Ball) {
    this.ball = ball;
  }

  public execute(player: Player) {
    const postMidPoint = player.getOpposingGoalPost().getMidPoint();
    player.kickBall(this.ball, postMidPoint);
  }
}
