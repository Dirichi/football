import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { BallPossessionService } from "../services/ball_possession_service";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class ShootBallCommand implements ICommand {
  private ball: Ball;
  private possessionService: BallPossessionService;

  constructor(ball: Ball, possessionService: BallPossessionService) {
    this.ball = ball;
    this.possessionService = possessionService;
  }

  public execute(player: Player) {
    const owner = this.possessionService.getCurrentPlayerInPossessionOrNull();

    if (owner === player) {
      player.kickingBall = true;
      const postMidPoint = player.getOpposingGoalPost().getMidPoint();
      this.ball.moveTowards(postMidPoint);
    }
  }
}
